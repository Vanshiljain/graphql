import { Test, TestingModule } from '@nestjs/testing';
import { WebhookResolver } from './webhook.resolver';

describe('WebhookResolver', () => {
  let resolver: WebhookResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhookResolver],
    }).compile();

    resolver = module.get<WebhookResolver>(WebhookResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
