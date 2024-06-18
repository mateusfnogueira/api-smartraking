import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';

import * as uuid from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  private players: Player[] = [];

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private readonly logger = new Logger(PlayersService.name);
  async createAndUpdatePlayer(createPlayerDto: CreatePlayerDto) {
    const { email } = createPlayerDto;

    // const playerShared = this.players.find((item) => item.email === email);
    const playerShared = await this.playerModel.findOne({ email }).exec();

    if (playerShared) {
      await this.update(createPlayerDto);
    } else {
      await this.create(createPlayerDto);
    }
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

  async deletePlayer(email: string): Promise<any> {
    // const playerShared = await this.players.find(
    //   (item) => item.email === email,
    // );
    // this.players = this.players.filter((item) => item.email !== email);
    return await this.playerModel.deleteOne({ email }).exec();
  }

  private async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    // const { name, email, telephone } = createPlayerDto;

    // const player = {
    //   _id: uuid(),
    //   ranking: 'A',
    //   positionRanking: 0,
    //   urlPhotoPlayer: '',
    //   email,
    //   name,
    //   telephone,
    // };
    // this.logger.log(`create player:${player}`);
    // this.players.push(player as Player);
    const playerCreated = new this.playerModel(createPlayerDto);
    return await playerCreated.save();
  }

  private async update(createPlayerDto: CreatePlayerDto): Promise<Player> {
    // const { name } = createPlayerDto;

    // playerShared.name = name;
    return await this.playerModel
      .findOneAndUpdate(
        { email: createPlayerDto.email },
        { $set: createPlayerDto },
      )
      .exec();
  }
}
