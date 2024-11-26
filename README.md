# Product Scraping API

This API is designed to connect to various online stores and scrape product details.

## Technological Stack

The API is developed using **TypeScript** and integrates several libraries and tools, such as:

- **TypeORM** for database interaction
- **dotenv** for environment variable management
- **nodemon** for auto-reloading during development
- **Express** for building the REST API
- **React** for the frontend
- **Axios** for HTTP requests
- **Cheerio** for scraping HTML data
- **Puppeteer** for interacting with dynamic pages
- **MySQL** as the database
- **Docker** for containerization

## Getting Started

To get started with the project, follow these steps:

### 1. Clone the Repository

Clone the repository to your local machine and install the required dependencies by running:

```bash 
npm install
```

### 2. Choosing the Deployment Environment

You will need to decide where you want to deploy the API. There are two options available:

#### Local Setup

If you choose to run the API on your local machine, follow these steps:

1. Create a `.env` file by copying `.env.example`:

2. Configure the database connection details in the `.env` file:

```bash 
PORT=5000

DB_HOST=localhost
DB_PORT=3306 
DB_USER=user 
DB_PASSWORD=password 
DB_NAME=mydatabase
```
#### Docker Setup

If you prefer to deploy the API using Docker, you can use the `.env.docker` file and run the following command to build and start the containers:

```bash
docker-compose up --build
```

This will build and launch the API in a Docker container.

## Populating the Database with Product Data

To populate the database with product information, you need to send POST requests to the scraping endpoints. Use tools like Postman or any other HTTP request tool to interact with the API.

### Scraping Products from Telemart

Send a POST request to the following endpoint:

Send a POST request to the following endpoint:

```bash
http://localhost:5000/api/telemart
```

This endpoint will scrape and save information about PCs from Telemart.

### Scraping Products from Rozetka

To scrape product details from Rozetka, use this endpoint:

```bash
http://localhost:5000/api/rozetka
```

This will fetch and store information about PCs from Rozetka.

### Scraping Products from Both Telemart and Rozetka

To scrape product details from both Telemart and Rozetka, use this endpoint:

```bash
http://localhost:5000/api/scrape
```

After executing these requests, your database will be populated with the product data, and you can proceed to display the product list.

## Accessing the Frontend Application

Once the Docker build process is complete, you will see the following message in your terminal:

```bash
You can now view frontend in the browser.
frontend-1  |
frontend-1  |   Local:            http://localhost:3000
frontend-1  |   On Your Network:  *********************
```

This means the frontend application is running and can be accessed at the provided URLs.

- **Local:** This URL allows you to view the application on the machine where Docker is running.
- **On Your Network:** This URL lets other devices on the same network access the application.

Simply open a browser and navigate to either URL to start interacting with the frontend application.

## Accessing Swagger API Documentation

The Swagger UI provides an interactive interface for exploring and testing the API. It allows you to view all available endpoints, understand their parameters, and make requests directly from the UI.

To access the Swagger documentation for this project, follow these steps:

1. Ensure that the server is running. If you are using Docker, confirm that the frontend and backend containers are up and running.
2. Open a browser and navigate to the following URL:

```bash
http://localhost:5000/api-docs
```


This will load the Swagger UI, where you can explore the available API endpoints and try out different operations.

### What You Can Do with Swagger

- **Browse Available Endpoints:** You can see all the available API endpoints with their respective methods (GET, POST, etc.).
- **View Parameters and Responses:** Each endpoint displays information about the parameters it accepts and the responses it returns, including example responses.
- **Make Test Requests:** You can directly test the API by sending requests (e.g., GET, POST) through the Swagger UI. It will show the response in real-time, making it easy to test the functionality of the API.