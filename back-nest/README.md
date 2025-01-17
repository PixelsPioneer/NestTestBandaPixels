# **NestJS Project Documentation**

## **Project Description**

This project is a backend service built with NestJS, designed to scrape data from different sources (e.g., Rozetka and Telemart), store the scraped data in a MySQL database, and cache response with product in Redis db for faster requests and better optimization. Expose it via RESTful APIs and uses swagger for better view scraping api. It uses Prisma for database operations and follows a modular structure for scalability and maintainability.

---

## **Requirements**

- Node.js (version >= 16)
- MySQL (version >= 8)
- Docker (if using containerization)
- NestJS CLI (for development)
- Redis (version >= 7.4)
- Prisma (version >= 6.2)
- Swagger (version >= 5)
---

## **Environment Configuration**
Create a .env file in the root directory with the following variables:
 ```bash
PORT=5000

DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=newschema

CORS_ORIGIN= http://localhost:3000

REDIS_HOST = redis
REDIS_PORT = 6379

DATABASE_URL= "mysql://root:rootpassword@db:3306/newschema"
```
## **Running the Project**
Locally
Install dependencies:

```bash
 npm install
```
Start the development server:

```bash
 npm run prisgen
```
Generate Prisma Client and update his type

```bash
 npm run start:dev
```
The server will be available at http://localhost:5000.

## **With Docker**

Ensure Docker is installed and running.

Create a docker-compose.yml file (if not already created).

Build and start the container:

```bash
 docker-compose up --build
```

## **Prisma Migrations**

If u want create new migration in Prisma:

Firstly u must change database host in DATABASE_URL .env file

```bash
 DATABASE_URL= "mysql://root:rootpassword@db:3306/newschema"  
```

TO

```bash
 DATABASE_URL= "mysql://root:rootpassword@localhost:3306/newschema"
```

and start only db container in docker

after u can  change module in  schema.prisma and make migrations

If u change module in schema prisma u must write this comand

```bash
 npx prisma migrate dev --name your_name_prisma_migration
```
And press "y" button for make migration

After this complitet  u must write this comand for generate Prisma Client

```bash
   npm run prsigen
```

Atention!!!

dont forget add migration to git if u see what she doesn`t added

And change u DATABASE_URL back

```bash
 DATABASE_URL= "mysql://root:rootpassword@db:3306/newschema"
```

## **Common Commands**

Start in development mode:

```bash
 npm run start:dev
```

Build for production:

```bash
 npm run build
```

Run the built application:

```bash
 npm run start:prod
```

## ** Swagger **

```bash
 http://localhost:5000/api-docs/#
```