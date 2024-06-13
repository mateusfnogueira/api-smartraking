import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/jogador.interface';

import * as uuid from 'uuid';

@Injectable()
export class PlayersService {
  private players: Player[] = [];
  private readonly logger = new Logger(PlayersService.name);
  async createAndUpdatePlayer(createPlayerDto: CreatePlayerDto) {
    const { email } = createPlayerDto;

    const playerShared = await this.players.find(
      (item) => item.email === email,
    );

    if (playerShared) {
      await this.update(createPlayerDto, playerShared);
    } else {
      await this.create(createPlayerDto);
    }
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.players;
  }

  async getPlayersByEmail(email: string): Promise<Player> {
    const playerShared = await this.players.find(
      (item) => item.email === email,
    );
    if (!playerShared) {
      throw new NotFoundException(`Player ${email} was not found`);
    }
    return playerShared;
  }

  async deletePlayer(email: string): Promise<void> {
    const playerShared = await this.players.find(
      (item) => item.email === email,
    );
    if (!playerShared) {
      throw new NotFoundException(`Player ${email} was not found`);
    }

    this.players = this.players.filter((item) => item.email !== email);
  }

  private create(createPlayerDto: CreatePlayerDto): void {
    const { name, email, telephone } = createPlayerDto;

    const player = {
      _id: uuid(),
      ranking: 'A',
      positionRanking: 0,
      urlPhotoPlayer: '',
      email,
      name,
      telephone,
    };
    this.logger.log(`create player:${player}`);
    this.players.push(player);
  }

  private update(createPlayerDto: CreatePlayerDto, playerShared: Player): void {
    const { name } = createPlayerDto;

    playerShared.name = name;
  }
}
