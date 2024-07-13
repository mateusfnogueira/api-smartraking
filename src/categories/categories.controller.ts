import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
  Param,
  Put,
} from '@nestjs/common';
import { Categorie } from './interfaces/categories.interface';
import { CategoriesService } from './categories.service';
import { UpdateCategorieDto, CreateCategorieDto } from './dtos';

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

  @Post('/:categorie/players/:playerId')
  async updateCategorieWithPlayer(@Param() params: String[]): Promise<void> {
    return await this.categoriesService.updateCategorieWithPlayer(params);
  }

  @Put(':/categorie')
  @UsePipes(ValidationPipe)
  async updateCategorie(
    @Body() updateCategorieDto: UpdateCategorieDto,
    @Param('categorie') categorie: string,
  ): Promise<void> {
    return this.categoriesService.updateCategorie(
      categorie,
      updateCategorieDto,
    );
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
