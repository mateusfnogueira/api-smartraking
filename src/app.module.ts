import { Module } from '@nestjs/common';
import { JogadoresModule } from './jogadores/jogadores.module';
import { MongooseModule } from '@nestjs/mongoose';

const DB_URL = process.env.MONGODB_URL;
const DB_PASSWORD = process.env.MONGODB_PASSWORD;
@Module({
  imports: [
    MongooseModule.forRoot(DB_URL.replace('<password>', DB_PASSWORD)),
    JogadoresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
