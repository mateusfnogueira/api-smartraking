import { Module } from '@nestjs/common';
import { JogadoresController } from './jogadores.controller';
import { PlayersService } from './jogadores.service';

@Module({
  controllers: [JogadoresController],
  providers: [PlayersService],
})
export class JogadoresModule {}
