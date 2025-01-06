import { Module } from '@nestjs/common';
import { ProyectsService } from './proyects.service';
import { ProyectsController } from './proyects.controller';

@Module({
  controllers: [ProyectsController],
  providers: [ProyectsService],
})
export class ProyectsModule {}
