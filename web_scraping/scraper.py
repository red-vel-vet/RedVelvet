import requests
from bs4 import BeautifulSoup
from tqdm import tqdm
import time
import random
import pandas as pd
from datetime import datetime
import pytz
from dotenv import load_dotenv
import os
import psycopg2
from datetime import datetime, timezone
import logging



# Load environment variables
load_dotenv()

LOG_PATH=os.getenv("LOG_PATH")
now = datetime.now().strftime("%Y-%m-%d")
logging.basicConfig(filename=f"{LOG_PATH}{now}.log", level=logging.INFO)

# Database connection details from environment variables
DB_HOST=os.getenv("DB_HOST")
DB_PORT=os.getenv("DB_PORT")
DB_USER=os.getenv("DB_USER")
DB_NAME=os.getenv("DB_NAME")
DB_PASSWORD=os.getenv("DB_PWD")

# Headers to mimic a browser request
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

# Function to get current UTC time
def get_current_utc_time():
    return datetime.now(timezone.utc)

def execute_CH_query(query, data=None, fetch=False):
    """
    Execute a query on the PostgreSQL database.

    :param query: SQL query to be executed.
    :param data: Optional tuple of data to be passed to the query.
    :param fetch: Boolean indicating whether to fetch results (True) or not (False).
    :return: Fetched results if fetch is True, else None.
    """
    try:
        # Establish a connection to the database
        connection = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            dbname=DB_NAME,
            password=DB_PASSWORD
        )
        cursor = connection.cursor()
        # print("Connected to the database successfully")

        # Execute the query
        cursor.execute(query, data)

        # Fetch results if needed
        if fetch:
            results = cursor.fetchall()
            column_names = [desc[0] for desc in cursor.description]
            return results, column_names
        else:
            connection.commit()
            # print("Query executed successfully")

    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL", error)

    finally:
        if connection:
            cursor.close()
            connection.close()
            # print("PostgreSQL connection is closed")

def get_api_events():
    query = "SELECT * FROM api_event WHERE start > NOW();"
    api_event_data, api_event_columns = execute_CH_query(query, fetch=True)
    return pd.DataFrame(api_event_data, columns=api_event_columns)


def fetch_page(url):
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.text


def check_for_existing(event, api_events):
    return len(api_events[api_events["event_url"] == event["event_url"]])

def save_event_to_db(event):
    query = """
    INSERT INTO api_event (host_id, title, image_url, event_url, start, "end", address, city, state, zip, description, membership_required, is_active, created_date, updated_date)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    data = (
        event["host_id"], event["title"], event["image_url"], event["event_url"], event["start"], event["end"],
        event["address"], event["city"], event["state"], event["zip"], event["description"],
        event["membership_required"], event["is_active"], event["created_date"], event["updated_date"]
    )
    execute_CH_query(query, data)


def parse_loft_main(html_content, BASE_URL):
    soup = BeautifulSoup(html_content, 'html.parser')
    events = soup.find_all('div', class_='event')

    in_scope_events = []
    for event in events:
        buttons = event.find_all('a')
        has_rsvp = any('RSVP' in button.get_text() for button in buttons)
        has_tickets = any('Tickets' in button.get_text() for button in buttons)

        if has_rsvp and has_tickets:
            in_scope_events.append(event)

    event_urls = [BASE_URL + 'events/' + event['id'].split('_')[-1] for event in in_scope_events]
    return event_urls

def parse_loft_event(html_content, event_url, host_id):
    soup = BeautifulSoup(html_content, 'html.parser')

    event_name = soup.find(id='event_title').get_text(strip=True)
    event_cover_img = soup.find('img', class_='shadow-small')['src']
    event_date = soup.find(id='event_date').get_text(strip=True).replace('\n', ' ')
    location = "Brooklyn, NY"
    event_details = soup.find(id='event_details')
    description = '\n'.join(element.get_text(strip=True) for element in event_details.find_all(recursive=False))

    prices = "Couples Ticket: $130\nSingle Lady Ticket: $30"

    current_year = datetime.now().year
    current_month = datetime.now().month
    date_part, time_range = event_date.split(' ')[1:3], event_date.split(' ')[-1]
    date_part = ' '.join(date_part)
    start_time, end_time = time_range.split('-')

    event_month = datetime.strptime(date_part.split()[0], "%b").month
    if event_month in [1, 2, 3] and current_month == 12:
        event_year = current_year + 1
    else:
        event_year = current_year

    start_datetime = pd.to_datetime(f"{date_part} {event_year} {start_time}", format="%b %d %Y %I%p")
    end_datetime = pd.to_datetime(f"{date_part} {event_year} {end_time}", format="%b %d %Y %I%p")
    end_datetime += pd.Timedelta(days=1) if start_datetime > end_datetime else pd.Timedelta(days=0)

    # Set timezone to UTC for both datetime objects
    start_datetime = start_datetime.tz_localize(pytz.UTC)
    end_datetime = end_datetime.tz_localize(pytz.UTC)

    membership_reqd = not ('newbie night' in description.lower() or 'no membership required' in description.lower())

    row = {
        'host_id': host_id,
        'title': event_name,
        'image_url': event_cover_img,
        'event_url': event_url,
        'start': start_datetime,
        'end': end_datetime,
        'address': '70 John St',
        'city': 'Brooklyn',
        'state': 'NY',
        'zip': '11201',
        'description': description,
        'membership_required': membership_reqd,
        'is_active' : True,
        'created_date': get_current_utc_time(),
        'updated_date': get_current_utc_time()
    }

    return row

hosts = []
hosts.append(("https://www.theloftesl.com/", 24, parse_loft_main, parse_loft_event))


def parse_caligula_main(main_page_content, BASE_URL):
    soup = BeautifulSoup(main_page_content, 'html.parser')
    try:
        pages = int(soup.find_all('div', class_='pagination')[0].find_all('a')[-1].get_text())
    except:
        pages = 0

    # Extract event links
    event_archives = soup.find_all('div', class_='event-archive')
    
    event_urls = []
    for event in event_archives:
        h2 = event.find('h2', class_='event-arc-title')
        if h2:
            a = h2.find('a')
            if a and 'href' in a.attrs:
                event_urls.append(a['href'])

    return event_urls

def parse_caligula_event(event_page_content, url, host_id):

    # Parse the HTML content
    soup = BeautifulSoup(event_page_content, 'html.parser')

    # Extract the image src of the event cover
    event_cover_img = soup.find('div', class_='event-cover').find('img')['src']

    # Extract the event date
    month = soup.find('div', class_='event-single-month').get_text().strip()[:3]
    day = soup.find('div', class_='event-single-day').get_text().strip()
    year = soup.find('div', class_='event-single-year').get_text().strip()
    event_date_str = f"{month} {day}, {year}"
    event_date = datetime.strptime(event_date_str, "%b %d, %Y")

    # Extract the event name
    event_name = soup.find('h2', class_='event-title').get_text(strip=True)

    # Get location & times
    event_meta = soup.find('ul', class_='event-meta').get_text().split('\n')
    location = event_meta[1].split(':')[1].strip()
    length = event_meta[2].split('Length:')[-1]
    start_str = length.split(' – ')[0].strip()
    end_str = length.split(' – ')[-1].strip()

    # Convert times to datetime
    start_time = datetime.strptime(start_str, "%I:%M %p").time()
    end_time = datetime.strptime(end_str, "%I:%M %p").time()

    start_datetime = datetime.combine(event_date, start_time)
    end_datetime = datetime.combine(event_date, end_time)

    # Adjust end_datetime if it is earlier than start_datetime (event ends next day)
    end_datetime += pd.Timedelta(days=1) if start_datetime > end_datetime else pd.Timedelta(days=0)

    # Get event description
    description = soup.find('em').get_text()
    
    # # Get admission prices
    # prices = ""
    # for line in soup.find_all('p'):
    #     if 'Admission' in line.get_text():
    #         prices = line.get_text().split('Admission')[1].strip()
    
    row = {
        'host_id': host_id,
        'title': event_name,
        'image_url': event_cover_img,
        'event_url': url,
        'start': start_datetime,
        'end': end_datetime,
        'address': '40-19 20th Av',
        'city': 'Astoria',
        'state': 'NY',
        'zip': '11105',
        'description': description,
        'membership_required': False,
        'is_active' : True,
        'created_date': get_current_utc_time(),
        'updated_date': get_current_utc_time()
    }

    return row

hosts.append(("https://www.caligulany.com/events/", 16, parse_caligula_main, parse_caligula_event))



new_event_count = 0

def main(BASE_URL, host_id, parse_main_page, parse_event_page):
    main_page_content = fetch_page(BASE_URL)
    event_urls = parse_main_page(main_page_content, BASE_URL)

    for url in tqdm(event_urls, desc=f"Processing events for {BASE_URL}"):
        event_page_content = fetch_page(url)
        event = parse_event_page(event_page_content, url, host_id)
        if check_for_existing(event, api_events) == 0:
            save_event_to_db(event)
            logging.info(f"Added event {url} to database at {datetime.now()}")
            new_event_count += 1
        time.sleep(random.uniform(5, 10))  # Sleep to mimic human browsing and avoid getting blocked



logging.info(f'Script started at {datetime.now()}')

api_events = get_api_events()
for host in hosts:
    main(*host)
    
logging.info(f'Script finished at {datetime.now()}\n\nNew Events Added: {new_event_count}')

