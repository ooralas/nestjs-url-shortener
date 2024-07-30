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

### Production Setup

To start the production environment, run the following command in the project root:

```shell
docker-compose -f docker-compose.prod.yml up --build
```
