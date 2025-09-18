import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';

@Module({
  controllers: [],
  providers: [TagsService],
})
export class TagsModule {}
