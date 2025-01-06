import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { CreateProyectDto } from './dto/create-proyect.dto';
import { UpdateProyectDto } from './dto/update-proyect.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProyectsService extends PrismaClient {
  private readonly logger = new Logger('ProyectsService');

  // Crear proyecto
  async create(createProyectDto: CreateProyectDto) {
    this.logger.log('Creando nuevo proyecto');
    try {
      return await this.proyect.create({
        data: createProyectDto,
      });
    } catch (error) {
      this.logger.error('Error creando proyecto', error);
      throw new RpcException({
        message: 'Error creando proyecto',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
  
  async findAll() {
    this.logger.log('Obteniendo todos los proyectos');
    try {
      return await this.proyect.findMany();
    } catch (error) {
      this.logger.error('Error obteniendo proyectos', error);
      throw new RpcException({
        message: 'Error obteniendo proyectos',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findOne(id: number) {
    this.logger.log(`Obteniendo proyecto con ID: ${id}`);
    try {
      const proyect = await this.proyect.findUnique({
        where: { id },
      });

      if (!proyect) {
        throw new RpcException({
          message: `Proyecto con el ID: ${id} no existe`,
          status: HttpStatus.NOT_FOUND,
        });
      }

      return proyect;
    } catch (error) {
      this.logger.error('Error obteniendo proyecto', error);
      throw new RpcException({
        message: 'Error obteniendo proyecto',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async update(id: number, updateProyectDto: UpdateProyectDto) {
    this.logger.log(`Actualizando proyecto con ID: ${id}`);
    try {
      const proyect = await this.proyect.findUnique({ where: { id } });

      if (!proyect) {
        throw new RpcException({
          message: `Proyecto con el ID: ${id} no existe`,
          status: HttpStatus.NOT_FOUND,
        });
      }

      return await this.proyect.update({
        where: { id },
        data: updateProyectDto,
      });
    } catch (error) {
      this.logger.error('Error actualizando proyecto', error);
      throw new RpcException({
        message: 'Error actualizando proyecto',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async remove(id: number) {
    this.logger.log(`Eliminando proyecto con ID: ${id}`);
    try {
      const proyect = await this.proyect.findUnique({ where: { id } });

      if (!proyect) {
        throw new RpcException({
          message: `Proyecto con el ID: ${id} no existe`,
          status: HttpStatus.NOT_FOUND,
        });
      }

      return await this.proyect.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error('Error eliminando proyecto', error);
      throw new RpcException({
        message: 'Error eliminando proyecto',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
