import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.use(helmet());
  app.enableCors({
    origin: (process.env.CORS_ORIGINS ?? 'http://localhost:3000').split(','),
    credentials: true,
  });

  app.setGlobalPrefix(process.env.API_PREFIX ?? 'api/v1');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Amal Yatri API')
    .setDescription(
      'REST API powering the Amal Yatri lifelong wellness companion.',
    )
    .setVersion('0.1.0')
    .addBearerAuth()
    .addTag('auth', 'Login, registration, refresh tokens')
    .addTag('users', 'Yatri profile management')
    .addTag('wellness-timeline', 'Retreats, assessments, goals, plans')
    .addTag('doctor-connect', 'Messaging and consultations')
    .addTag('communities', 'Moderated wellness circles')
    .addTag('knowledge', 'Articles, recipes, yoga, podcasts')
    .addTag('events', 'Live sessions and workshops')
    .addTag('notifications', 'In-app, push, email')
    .addTag('ai-assistant', 'Wellness AI conversations')
    .addTag('admin', 'Admin portal endpoints')
    .addTag('health', 'Liveness and readiness')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`🌿  Amal Yatri API listening on http://localhost:${port}`);
  // eslint-disable-next-line no-console
  console.log(`📚  Swagger:  http://localhost:${port}/api/docs`);
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Fatal bootstrap error', err);
  process.exit(1);
});
