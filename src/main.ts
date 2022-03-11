import { HttpExceptionFilter } from './common/exception/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { setupAdminPanel } from './admin-panel/admin-panel.plugin';
import helmet from 'helmet';
import { config } from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
config();

declare const module: any;

async function bootstrap() {
  console.log(process.env.NODE_ENV);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT;
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.use(helmet());
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.CLIENT_URL
        : 'http://localhost:8000',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Dimelo API')
    .setDescription('Dimelo 개발을 위한 API 문서')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  let cookieConfig = {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  };
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);

    cookieConfig['sameSite'] = 'strict';
    cookieConfig['domain'] = '.dimelo.io';
    cookieConfig['secure'] = true;
  }

  app.use(cookieParser());
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      proxy: true,
      cookie: cookieConfig,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await setupAdminPanel(app);

  await app.listen(port);
  console.log(`Listening on port ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
