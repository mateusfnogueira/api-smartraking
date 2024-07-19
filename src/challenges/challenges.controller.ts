import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { IChallenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { AssignChallengeMatchDto } from './dtos/assign-challenge-match.dto';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengeService: ChallengesService) {}

  private readonly logger = new Logger(ChallengesController.name);

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeDto: CreateChallengeDto,
  ): Promise<IChallenge> {
    this.logger.log(
      `createChallengeDto: ${JSON.stringify(createChallengeDto)}`,
    );
    return await this.challengeService.createChallenge(createChallengeDto);
  }

  @Get()
  async getChallenges(): Promise<Array<IChallenge>> {
    return await this.challengeService.getAllChallenges();
  }

  @Get('/:_playerId')
  async getChallengeById(
    @Param('_playerId') playerId: string,
  ): Promise<Array<IChallenge>> {
    return await this.challengeService.getChallengByPlayerId(playerId);
  }

  @Put('/:challenge')
  async updateChallenge(
    @Body(ChallengeStatusValidationPipe) updateChallengeDto: UpdateChallengeDto,
    @Param('challenge') _id: string,
  ): Promise<void> {
    return await this.challengeService.updateChallenge(_id, updateChallengeDto);
  }

  @Post('/:challenge/match')
  async assignChallengeWithMatch(
    @Body(ValidationPipe) assignChallengeWithMatchDto: AssignChallengeMatchDto,
    @Param('challenge') _id: string,
  ): Promise<void> {
    return await this.challengeService.assignChallengeMatch(
      _id,
      assignChallengeWithMatchDto,
    );
  }

  @Delete('/:_id')
  async deleteChallenge(@Param('_id') _id: string) {
    await this.challengeService.deleteChallenge(_id);
  }
}
