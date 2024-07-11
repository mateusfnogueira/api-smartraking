import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categorie } from './interfaces/categories.interface';
import { CreateCategorieDto } from './dtos/create-categorie.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Categorie') private readonly categorieModel: Model<Categorie>,
  ) {}

  async createCategorie(
    createCategorieDto: CreateCategorieDto,
  ): Promise<Categorie> {
    const { categorie } = createCategorieDto;

    const categorieShared = await this.categorieModel
      .findOne({ categorie })
      .exec();

    if (categorieShared) {
      throw new BadRequestException(`Categoria ${categorie} já cadastrada`);
    }

    const createCategorie = new this.categorieModel(createCategorieDto);
    return await createCategorie.save();
  }

  async getAllCategories(): Promise<Array<Categorie>> {
    return await this.categorieModel.find().exec();
  }

  async getCategorieByCategorie(categorie: string): Promise<Categorie> {
    const categorieShared = await this.categorieModel
      .findOne({ categorie })
      .exec();

    if (!categorieShared) {
      throw new BadRequestException(`Categoria ${categorie} não encontrada`);
    }
    return await this.categorieModel.findOne({ categorie }).exec();
  }
}
