import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {dynamoose} from '@youtube-sync/core/database'

async function bootstrap() {
  dynamoose.aws.sdk.config.update({region:'eu-west-1'});
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders:'*',
    methods:'*',
    origin: '*'
  });
  await app.listen(3001);
}
bootstrap();
