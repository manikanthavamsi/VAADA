# Use an official lightweight Python image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install dependencies (if any)
RUN pip install --no-cache-dir -r requirements.txt

# Copy all the static files (HTML, CSS, JS, Images) into the container
COPY . .

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run a Python HTTP server binding to 0.0.0.0 so it can be accessed publicly
CMD ["python", "-m", "http.server", "8080", "--bind", "0.0.0.0"]
