import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProyectsService } from './proyects.service';
import { CreateProyectDto } from './dto/create-proyect.dto';
import { UpdateProyectDto } from './dto/update-proyect.dto';

@Controller('projects')
export class ProyectsController {
  constructor(private readonly proyectsService: ProyectsService) {}

  @MessagePattern({ cmd: 'create_proyect' })
  create(@Payload() createProyectDto: CreateProyectDto) {
    return this.proyectsService.create(createProyectDto);
  }

  @MessagePattern({ cmd: 'find_proyect' })
  findAll() {
    return this.proyectsService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_proyect' })
  findOne(@Payload() id: number) {
    return this.proyectsService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_proyect' })
  update(@Payload() updateProyectDto: UpdateProyectDto) {
    return this.proyectsService.update(updateProyectDto.id, updateProyectDto);
  }

  @MessagePattern({ cmd: 'remove_proyect' })
  remove(@Payload() id: number) {
    return this.proyectsService.remove(id);
  }
}
