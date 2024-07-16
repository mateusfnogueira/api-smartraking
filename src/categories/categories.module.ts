import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesSchema } from './interfaces/categories.schema';
import { PlayersModule } from '../jogadores/jogadores.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Categorie', schema: CategoriesSchema },
    ]),
    PlayersModule,
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
