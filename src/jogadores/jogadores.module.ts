import { Module } from '@nestjs/common';
import { JogadoresController } from './jogadores.controller';
import { PlayersService } from './jogadores.service';
import { PlayerSchema } from './interfaces/player.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Player', schema: PlayerSchema }]),
  ],
  controllers: [JogadoresController],
  providers: [PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {}
