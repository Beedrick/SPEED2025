import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { DB_URI } from './config'; 

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(DB_URI),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}