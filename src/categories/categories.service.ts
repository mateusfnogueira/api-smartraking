import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categorie } from './interfaces/categories.interface';
import { UpdateCategorieDto, CreateCategorieDto } from './dtos';
import { PlayersService } from 'src/jogadores/jogadores.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Categorie') private readonly categorieModel: Model<Categorie>,
    private readonly playersService: PlayersService,
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
    return await this.categorieModel.find().populate('players').exec();
  }

  async getCategorieByCategorie(categorie: string): Promise<Categorie> {
    const categorieShared = await this.categorieModel
      .findOne({ categorie })
      .exec();

    if (!categorieShared) {
      throw new BadRequestException(`Categoria ${categorie} não encontrada`);
    }
    return categorieShared;
  }

  // update events categorie
  async updateCategorie(
    categorie: string,
    updateCategorieDto: UpdateCategorieDto,
  ): Promise<void> {
    const categorieShared = await this.categorieModel
      .findOne({ categorie })
      .exec();

    if (!categorie) {
      throw new BadRequestException(`Categoria ${categorie} não encontrada`);
    }

    await this.categorieModel
      .findByIdAndUpdate({ categorie }, { $set: updateCategorieDto })
      .exec();
  }

  async updateCategorieWithPlayer(params: String[]): Promise<void> {
    const categorie = params['categorie'];
    const playerId = params['playerId'];

    const categorieShared = await this.categorieModel
      .findOne({ categorie })
      .exec();

    const playerSharedInCategorie = await this.categorieModel
      .find({ categorie })
      .where('players')
      .in(playerId)
      .exec();

    const player = await this.playersService.getPlayersById(playerId);

    if (!categorieShared) {
      throw new BadRequestException(`Categoria ${categorie} não encontrada`);
    }

    if (playerSharedInCategorie.length > 0) {
      throw new BadRequestException(
        `Jogador ${player.name} já cadastrado na categoria ${categorie}`,
      );
    }

    categorieShared.players.push(playerId);
    await this.categorieModel
      .findByIdAndUpdate({ categorie }, { $set: categorieShared })
      .exec();
  }
}
