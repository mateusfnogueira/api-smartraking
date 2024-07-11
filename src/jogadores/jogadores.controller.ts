import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Delete,
  UsePipes,
  ValidationPipe,
  Param,
  Put,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './jogadores.service';
import { Player } from './interfaces/player.interface';
import { PlayerValidationParamsPipe } from './pipes/player-validation-params.pipe';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly playersService: PlayersService) {}
  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    await this.playersService.createPlayer(createPlayerDto);
  }

  @Put(':_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() createPlayerDto: CreatePlayerDto,
    @Param('_id', PlayerValidationParamsPipe) _id: string,
  ): Promise<void> {
    await this.playersService.updatePlayer(_id, createPlayerDto);
  }

  @Get()
  async getAllPlayers(): Promise<Player[]> {
    return await this.playersService.getAllPlayers();
  }

  // @Get()
  // async getPlayersByEmail(
  //   @Query('email', PlayerValidationParamsPipe) email: string,
  // ): Promise<Player[] | Player> {
  //   return this.playersService.getPlayersByEmail(email);
  // }
  @Get('/:_email')
  async getPlayersByEmail(
    @Param('email', PlayerValidationParamsPipe) email: string,
  ): Promise<Player[] | Player> {
    return this.playersService.getPlayersByEmail(email);
  }
  @Get('/:_id')
  async getPlayersById(
    @Param('email', PlayerValidationParamsPipe) id: string,
  ): Promise<Player[] | Player> {
    return this.playersService.getPlayersById(id);
  }

  @Delete('/:_id')
  async deletePlayer(
    @Param('_id', PlayerValidationParamsPipe) _id: string,
  ): Promise<void> {
    this.playersService.deletePlayer(_id);
  }
}
