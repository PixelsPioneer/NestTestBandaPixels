# **NestJS Project Documentation**

## **Project Description**

This project is a backend service built with NestJS, designed to scrape data from different sources (e.g., Rozetka and Telemart), store the scraped data in a MySQL database, and expose it via RESTful APIs. It uses TypeORM for database operations and follows a modular structure for scalability and maintainability.

---

## **Requirements**

- Node.js (version >= 16)
- MySQL (version >= 8)
- Docker (if using containerization)
- NestJS CLI (for development)

---

## **Environment Configuration**
Create a .env file in the root directory with the following variables:
 ```bash
 DB_HOST=localhost           # Database host
DB_PORT=3306                 # Database port
DB_USERNAME=root             # Database username
DB_PASSWORD=your_password    # Database password
DB_NAME=newschema            # Database name

# Other variables
PORT=5000                  # Server port
```
## **Running the Project**
Locally
Install dependencies:

```bash
npm install
Start the development server:
```

```bash
npm run start:dev
The server will be available at http://localhost:5000.
```
## **With Docker**

Ensure Docker is installed and running.

Create a docker-compose.yml file (if not already created).

Build and start the container:

```bash
Copy code
docker-compose up --build
```

## **Common Commands**

Start in development mode:

```bash
npm run start:dev
Build for production:
```

```bash
npm run build
Run the built application:
```

```bash
Copy code
npm run start:prod
```

## ** Swagger **

```bash
http://localhost:5000/api-docs/#
```