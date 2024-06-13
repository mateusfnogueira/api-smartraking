import { Test, TestingModule } from '@nestjs/testing';
import { JogadoresService } from './jogadores.service';

describe('JogadoresService', () => {
  let service: JogadoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JogadoresService],
    }).compile();

    service = module.get<JogadoresService>(JogadoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
