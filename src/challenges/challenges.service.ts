import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IChallenge, IMatch } from './interfaces/challenge.interface';
import { PlayersService } from 'src/jogadores/jogadores.service';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge')
    private readonly challengeModel: Model<IChallenge>,
    @InjectModel('Match') private readonly matchModel: Model<IMatch>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private readonly logger = new Logger(ChallengesService.name);

  async createChallenge(
    createChallengeDto: CreateChallengeDto,
  ): Promise<IChallenge> {
    const players = await this.playersService.getAllPlayers();

    createChallengeDto.players.map((playerDto) => {
      const playerFiltered = players.filter(
        (player) => player._id === playerDto._id,
      );

      if (!playerFiltered.length) {
        throw new BadRequestException(
          `O id ${playerDto._id} não é um jogador!`,
        );
      }
    });

    const requestingIsMatchPlayer = await createChallengeDto.players.filter(
      (player) => player._id == createChallengeDto.requesting._id,
    );

    this.logger.log(
      `O Jogador ${createChallengeDto.requesting.name} é um jogador da partida`,
    );

    if (!requestingIsMatchPlayer.length) {
      throw new BadRequestException(
        `O solicitante deve ser um jogador da partida!`,
      );
    }

    const playerCategorie = await this.categoriesService.getCategorieByPlayer(
      createChallengeDto.requesting._id,
    );

    if (!playerCategorie) {
      throw new BadRequestException(
        `O solicitante precisa estar registrado em uma categoria!`,
      );
    }

    const createdChallenge = new this.challengeModel(createChallengeDto);
    createdChallenge.category = playerCategorie.categorie;
    createdChallenge.requestDate = new Date();

    createdChallenge.status = ChallengeStatus.PEDING;
    return await createdChallenge.save();
  }

  async getAllChallenges(): Promise<Array<IChallenge>> {
    return await this.challengeModel
      .find()
      .populate('requesting')
      .populate('players')
      .populate('matchs')
      .exec();
  }

  async getChallengById(_id: any): Promise<Array<IChallenge>> {
    const player = await this.playersService.getPlayersById(_id);

    if (!player) {
      throw new BadRequestException(`O id ${_id} não é um jogador`);
    }

    return await this.challengeModel
      .find()
      .where('players')
      .in(_id)
      .populate('requesting')
      .populate('players')
      .populate('matchs')
      .exec();
  }

  async updateChallenge(
    _id: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<void> {
    const challengeShared = await this.challengeModel.findById(_id);

    if (!challengeShared) {
      throw new BadRequestException(`Desafio ${_id} não cadastrado`);
    }

    if (updateChallengeDto.status) {
      challengeShared.responseDate = new Date();
      challengeShared.status = updateChallengeDto.status;
    }

    challengeShared.challengeDate = updateChallengeDto.challengeDate;

    await this.challengeModel.findByIdAndUpdate(
      { _id },
      { $set: challengeShared },
    );
  }
}
