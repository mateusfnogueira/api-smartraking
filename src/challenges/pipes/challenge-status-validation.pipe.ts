import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ChallengeStatus } from '../interfaces/challenge-status.enum';

export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly permittedStatus = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELED,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.isValidedStatus(status)) {
      throw new BadRequestException(`${status} é um status inválido`);
    }
    return value;
  }

  private isValidedStatus(status: any) {
    const idx = this.permittedStatus.indexOf(status);
    return idx !== -1;
  }
}
