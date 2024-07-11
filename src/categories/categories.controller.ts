import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
  Param,
} from '@nestjs/common';
import { CreateCategorieDto } from './dtos/create-categorie.dto';
import { Categorie } from './interfaces/categories.interface';
import { CategoriesService } from './categories.service';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCategorie(
    @Body() createCategorieDto: CreateCategorieDto,
  ): Promise<Categorie> {
    return await this.categoriesService.createCategorie(createCategorieDto);
  }

  @Get()
  async getCategories(): Promise<Array<Categorie>> {
    return await this.categoriesService.getAllCategories();
  }

  @Get('/:categorie')
  async getCategorieByCategorie(
    @Param('categorie') categorie: string,
  ): Promise<Categorie> {
    return await this.categoriesService.getCategorieByCategorie(categorie);
  }
}
