import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Player } from './interfaces/player.interface';
import { UpdatePlayerDto, CreatePlayerDto } from './dtos';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  private players: Player[] = [];

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;
    const playerShared = await this.playerModel.findOne({ email }).exec();

    if (playerShared) {
      throw new BadRequestException(`Jogador ${email} já cadastrado`);
    }
    const playerCreated = new this.playerModel(createPlayerDto);
    return await playerCreated.save();
  }

  async updatePlayer(
    _id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<void> {
    const playerShared = await this.playerModel.findOne({ _id }).exec();

    if (!playerShared) {
      throw new NotFoundException(`Jogador ${_id} não encontrado`);
    }

    await this.playerModel
      .findOneAndUpdate({ _id }, { $set: updatePlayerDto })
      .exec();
  }

  async getAllPlayers(): Promise<Player[]> {
    // return await this.players;
    return await this.playerModel.find().exec();
  }

  async getPlayersByEmail(email: string): Promise<Player> {
    // const playerShared = await this.players.find(
    //   (item) => item.email === email,
    // );
    const playerShared = await this.playerModel.findOne({ email }).exec();
    if (!playerShared) {
      throw new NotFoundException(`Player ${email} was not found`);
    }
    return playerShared;
  }

  async getPlayersById(id: string): Promise<Player> {
    // const playerShared = await this.players.find(
    //   (item) => item.email === email,
    // );
    const playerShared = await this.playerModel.findOne({ id }).exec();
    if (!playerShared) {
      throw new NotFoundException(`Player ${id} was not found`);
    }
    return playerShared;
  }

  async deletePlayer(id: string): Promise<any> {
    // const playerShared = await this.players.find(
    //   (item) => item.email === email,
    // );
    // this.players = this.players.filter((item) => item.email !== email);
    return await this.playerModel.deleteOne({ id }).exec();
  }
}
