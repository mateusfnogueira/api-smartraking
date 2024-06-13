import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JogadoresModule } from './jogadores/jogadores.module';

@Module({
  imports: [JogadoresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
