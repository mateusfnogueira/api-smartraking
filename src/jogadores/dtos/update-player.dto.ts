import { IsNotEmpty } from 'class-validator';

export class UpdatePlayerDto {
  @IsNotEmpty()
  readonly telephone: string;
  @IsNotEmpty()
  readonly name: string;
}
