import { Module } from '@nestjs/common';
import { PlayersModule } from './jogadores/jogadores.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { ChallengesModule } from './challenges/challenges.module';

const DB_URL = process.env.MONGODB_URL;
const DB_PASSWORD = process.env.MONGODB_PASSWORD;
@Module({
  imports: [
    MongooseModule.forRoot(DB_URL.replace('<password>', DB_PASSWORD)),
    PlayersModule,
    CategoriesModule,
    ChallengesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
