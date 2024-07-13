import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Player } from '../../jogadores/interfaces/player.interface';
import { IEvent } from '../interfaces/categories.interface';

export class UpdateCategorieDto {
  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: Array<IEvent>;
}
