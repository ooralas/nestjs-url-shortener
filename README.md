<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# NestJS URL Shortener

A RESTful API for shortening URLs, developed with NestJS. This project includes user management, link tracking, and unique URL generation. It utilizes a relational database schema for efficient data handling.

## Features

- User registration and authentication
- URL shortening with unique, secure identifiers
- Tracking link views
- Relational database schema for managing users and links

## Usage

This project is Dockerized for both development and production environments. Below are the instructions to set up and run the application using Docker.

### Development Setup

To start the development environment, run the following command in the project root:

```shell
docker-compose -f docker-compose.yml up --build
```

### Production Setup (will come later)

To start the production environment, run the following command in the project root:

```shell
docker-compose -f docker-compose.prod.yml up --build
```

### Environment Variables

The project relies on environment variables to configure various aspects of the application. An `.env.example` file is provided in the project root as a template for the environment configuration.

To set up the environment variables:

- Create a copy of the `.env.example` file and rename it to `.env`:

  ```shell
  cp .env.example .env
  ```

- Open the `.env` file and update the variables as needed:

  ```yml
  NODE_ENV=development

  API_PROTOCOL=http
  API_HOST=localhost
  API_PORT=3000

  DB_URL=postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT><DB_NAME>

  ALIAS_LENGTH=5
  ```

This file defines the protocol, host, and port for the API server, among other configuration settings.

## API Documentation

The API documentation is generated using the Swagger module of NestJS and is saved in the `api-documentation/swagger-document.json` file. This JSON file follows the OpenAPI standard and can be imported directly into Postman for testing and debugging the endpoints of the application.

The Swagger UI is also accessible at `/swagger` for interacting with the API documentation through a web interface.

By importing this documentation into Postman, all the endpoints of the application will be accessible, allowing for easy testing and debugging of the API.

The `swagger-document.json` file is dynamically updated whenever changes are made to the existing controllers (endpoints) or new endpoints are added, as long as the appropriate Swagger decorators are used. This ensures that the API documentation is always up-to-date with the current state of the application's endpoints.

### Using the API Documentation in Postman

The API documentation can be easily imported into Postman for testing and debugging purposes. Follow these steps:

1. Open Postman
2. Click on "Import" in the top left corner
3. Select `swagger-document.json` file from project folder
4. Click "Continue" and then "Import"

For detailed instructions on importing Swagger/OpenAPI specifications into Postman, refer to the [official Postman documentation](https://learning.postman.com/docs/getting-started/importing-and-exporting/importing-from-swagger/).
