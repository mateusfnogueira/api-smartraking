import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/jogador.interface';

import * as uuid from 'uuid';

@Injectable()
export class PlayersService {
  private players: Player[] = [];
  private readonly logger = new Logger(PlayersService.name);
  async createAndUpdatePlayer(createPlayerDto: CreatePlayerDto) {
    this.logger.log(`create player:${createPlayerDto}`);

    await this.create(createPlayerDto);
  }

  private create(createPlayerDto: CreatePlayerDto): Player {
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

    return player;
  }
}
