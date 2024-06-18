import { Controller, Post, Body, Get, Query, Delete } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './jogadores.service';
import { Player } from './interfaces/player.interface';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly playersService: PlayersService) {}
  @Post()
  async createUpdatePlayer(@Body() createPlayerDto: CreatePlayerDto) {
    await this.playersService.createAndUpdatePlayer(createPlayerDto);
  }

  @Get()
  async getPlayers(@Query('email') email: string): Promise<Player[] | Player> {
    if (email) return this.playersService.getPlayersByEmail(email);
    return this.playersService.getAllPlayers();
  }

  @Delete()
  async deletePlayer(@Query('email') email: string): Promise<void> {
    this.playersService.deletePlayer(email);
  }
}
