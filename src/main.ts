import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { generateSwaggerDocument } from './utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  generateSwaggerDocument(app);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () =>
    console.log(`running API in mode ${process.env.NODE_ENV} on PORT ${PORT}`),
  );
}
bootstrap();
