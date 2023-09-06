import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
<<<<<<< HEAD
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  
=======
  const app = await NestFactory.create(AppModule, {cors: true});
  app.enableCors();
>>>>>>> a0bf9a60f07ecabae155be9b3392a5b9c871e8c7
  await app.listen(3000);
}
bootstrap();
