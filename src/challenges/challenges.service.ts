import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IChallenge, IMatch } from './interfaces/challenge.interface';
import { PlayersService } from 'src/jogadores/jogadores.service';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { AssignChallengeMatchDto } from './dtos/assign-challenge-match.dto';

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

  async getChallengByPlayerId(_id: any): Promise<Array<IChallenge>> {
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
    const sharedChallenge = await this.challengeModel.findById(_id);

    if (!sharedChallenge) {
      throw new BadRequestException(`Desafio ${_id} não cadastrado`);
    }

    if (updateChallengeDto.status) {
      sharedChallenge.responseDate = new Date();
      sharedChallenge.status = updateChallengeDto.status;
    }

    sharedChallenge.challengeDate = updateChallengeDto.challengeDate;

    await this.challengeModel.findByIdAndUpdate(
      { _id },
      { $set: sharedChallenge },
    );
  }

  async assignChallengeMatch(
    _id: string,
    assignChallengeMatchDto: AssignChallengeMatchDto,
  ): Promise<void> {
    const sharedChallenge = await this.challengeModel.findById(_id).exec();

    if (!sharedChallenge) {
      throw new BadRequestException(`Desafio ${_id} não cadastrada`);
    }

    const filteredPlayer = sharedChallenge.players.filter(
      (player) => player._id == assignChallengeMatchDto.def._id,
    );

    if (!filteredPlayer.length) {
      throw new BadRequestException(
        `O jogador vencedor não faz parte do desafio!`,
      );
    }

    this.logger.log(`desafioEncontrado: ${sharedChallenge}`);
    this.logger.log(`jogadorFilter: ${filteredPlayer}`);

    const createdMatch = new this.matchModel(assignChallengeMatchDto);

    createdMatch.category = sharedChallenge.category;
    createdMatch.players = sharedChallenge.players;

    const result = await createdMatch.save();

    sharedChallenge.status = ChallengeStatus.HELD;
    sharedChallenge.match = result;

    try {
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: sharedChallenge })
        .exec();
    } catch (error) {
      await this.challengeModel.deleteOne({ _id: result._id }).exec();
      throw new InternalServerErrorException();
    }
  }

  async deleteChallenge(_id: string): Promise<void> {
    const sharedChallenge = await this.challengeModel.findById(_id).exec();

    if (!sharedChallenge) {
      throw new BadRequestException(`Desafio ${_id} não cadastrado!`);
    }

    sharedChallenge.status = ChallengeStatus.CANCELED;
    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: sharedChallenge })
      .exec();
  }
}
