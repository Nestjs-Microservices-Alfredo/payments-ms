import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {

  const logger = new Logger('Mircoservice Payment');

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers,
      },
      
    },
    {
      inheritAppConfig: true,
    }
  );

  await app.startAllMicroservices();

  logger.log(`Mircoservice Payment onLine`);

  await app.listen( envs.port );

  logger.log(`Mircoservice Payment is running on ${envs.port}`);
}
bootstrap();
