
# RedVelvet

RedVelvet is an app designed for the ENM (Ethical Non-Monogamy) community. It centralizes event listings to make it easier for community members to find relevant events.

## Features

- **List View of Events**: Displays upcoming events sorted by date.
- **Event Details**: Click on an event to get more information.
- **RSVP**: Click the RSVP button to navigate to the event website to buy tickets.
- **Web Scraping**: Daily web scraping updates the database with new events at 3 AM.

## Tech Stack

- **Frontend**: React
- **Backend**: Django
- **Database**: PostgreSQL
- **Web Scraping**: BeautifulSoup, Pytz, datetime.timezone

## Setup Instructions

### Prerequisites

- **Node.js** and **npm** for the frontend.
- **Python 3.10.x** for the backend.
- **PostgreSQL** for the database.
- **BeautifulSoup**, **Pytz**, and **datetime.timezone** for web scraping.

### Frontend

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/RedVelvet.git
   ```
2. Navigate to the frontend directory:
   ```sh
   cd RedVelvet/frontend
   ```
3. Install dependencies and build the project:
   ```sh
   npm install && npm run build
   ```

### Backend

1. Navigate to the backend directory:
   ```sh
   cd RedVelvet/backend
   ```
2. Create a virtual environment and activate it:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install backend dependencies:
   ```sh
   pip install -r requirements.txt
   ```

### Database

1. Set up a PostgreSQL database and create the necessary `.env` files.

### Environment Variables

Create a `.env` file in both the `backend` and `web_scraping` directories with the following variables:

**backend/.env**
```env
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_USER=your_db_user
DB_NAME=your_db_name
DB_PWD=your_db_password
```

**web_scraping/.env**
```env
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_USER=your_db_user
DB_NAME=your_db_name
DB_PWD=your_db_password
LOG_PATH=path_to_log_directory
```

## Running the Project

### Frontend

1. Start the frontend server:
   ```sh
   npm start
   ```

### Backend

1. Navigate to the backend directory and run the server:
   ```sh
   python manage.py runserver
   ```

### Web Scraping

1. Ensure the cron job is set up to run daily at 3 AM for updating the database with new events.
