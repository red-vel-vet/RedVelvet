
# RedVelvet

RedVelvet is an app designed for the ENM (Ethical Non-Monogamy) community. It centralizes event listings to make it easier for community members to find relevant events.

## Features

- **List View of Events**: Displays upcoming events sorted by date.
- **Event Details**: Click on an event to get more information.
- **RSVP**: Click the RSVP button to navigate to the event website to buy tickets.

## Tech Stack

- **Frontend**: React
- **Backend**: Django
- **Database**: PostgreSQL

## Setup Instructions

### Prerequisites

- **Node.js** and **npm** for the frontend.
- **Python 3.10.x** for the backend.
- **PostgreSQL** for the database.

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

Create a `.env` file in both the `backend` directory with the following variables:

**backend/.env**
```env
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_USER=your_db_user
DB_NAME=your_db_name
DB_PWD=your_db_password
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