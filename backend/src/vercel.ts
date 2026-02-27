import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

export const bootstrap = async () => {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));

    await app.init();
    return server;
};

export default async (req: any, res: any) => {
    const app = await bootstrap();
    app(req, res);
};
