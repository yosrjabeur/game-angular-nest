import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path'; 
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
   // Activer CORS
   app.enableCors({
    origin: 'http://localhost:4200', // Autoriser uniquement Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Méthodes HTTP autorisées
    credentials: true, // Autoriser les cookies et les en-têtes d'authentification
  });
  await app.listen(process.env.PORT ?? 3000);
 
}
bootstrap();