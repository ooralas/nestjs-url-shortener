import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

export function generateSwaggerDocument(app: INestApplication): void {
  const configService = app.get(ConfigService);

  const protocol = configService.get<string>('API_PROTOCOL', 'http');
  const host = configService.get<string>('API_HOST', 'localhost');
  const port = configService.get<string>('API_PORT', '3000');

  const baseUrl = `${protocol}://${host}:${port}`;

  const config = new DocumentBuilder()
    .setTitle('NestJS URL Shortener')
    .setDescription(
      'A RESTful API for shortening URLs, developed with NestJS. This project includes user management, link tracking, and unique URL generation. It utilizes a relational database schema for efficient data handling.',
    )
    .setVersion('1.0')
    .addServer(baseUrl)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  const jsonData = JSON.stringify(document);

  const filePath = path.resolve(
    process.cwd(),
    'api-documentation',
    'swagger-document.json',
  );

  try {
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    fs.writeFileSync(filePath, jsonData);
    console.log(`Swagger document saved successfully at ${filePath}`);
  } catch (error) {
    console.error('Error writing Swagger document to file:', error);
  }
}
