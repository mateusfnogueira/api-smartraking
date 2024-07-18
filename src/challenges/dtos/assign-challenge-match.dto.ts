import { IsNotEmpty } from 'class-validator';
import { Player } from 'src/jogadores/interfaces/player.interface';
import { Result } from '../interfaces/challenge.interface';

export class AssignChallengeMatchDto {
  @IsNotEmpty()
  def: Player;

  @IsNotEmpty()
  result: Array<Result>;
}
