import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {dynamoose} from '@youtube-sync/core/database'
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  dynamoose.aws.sdk.config.update({region:'eu-west-1'});
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
      .setTitle('Cats example')
      .setDescription('Youtube Sync API')
      .setVersion('1.0')
      .addTag('joystream')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    allowedHeaders:'*',
    methods:'*',
    origin: '*'
  });
  await app.listen(3001);
}
bootstrap();
