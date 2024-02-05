# Use the official Python image with Python 3.11 (replace "3.11" with the actual version)
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /app

# Copy the requirements file to the working directory
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to the working directory
COPY . .

# Copy the entire backend directory into the container
COPY backend/ .


# Expose the port that Gunicorn will run on
EXPOSE 8080

# Command to run Gunicorn
CMD exec gunicorn --workers=1 --threads=8 --timeout=0 --bind=0.0.0.0:8080 app:app
