# Use an official Python runtime as a parent image
FROM python:3.9-slim-buster

# Set work directory
WORKDIR /usr/src/app

# Install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt

# Copy project
COPY . /usr/src/app/

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port 8000
EXPOSE 8000

# Run the app with migrations and data loading
CMD ["sh", "-c", "python manage.py migrate && gunicorn --bind 0.0.0.0:8000 backend.wsgi:application"]