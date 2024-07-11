import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { IEvent } from '../interfaces/categories.interface';

export class CreateCategorieDto {
  @IsString()
  @IsNotEmpty()
  readonly categorie: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: Array<IEvent>;
}
