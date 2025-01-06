import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CommentsService extends PrismaClient {
  private readonly logger = new Logger('CommentsService');

  async create(createCommentDto: CreateCommentDto) {
    this.logger.log('Creando comentario');
    try {
      const comment = await this.comment.create({
        data: createCommentDto,
      });
      return comment;
    } catch (error) {
      this.logger.error('Error creando comentario', error);
      throw new RpcException({
        message: 'Error creando comentario',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findAll() {
    this.logger.log('Obteniendo todos los comentarios');
    try {
      return await this.comment.findMany();
    } catch (error) {
      this.logger.error('Error obteniendo los comentarios', error);
      throw new RpcException({
        message: 'Error obteniendo los comentarios',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findOne(id: number) {
    this.logger.log(`Obteniendo comentario con ID: ${id}`);
    try {
      const comment = await this.comment.findFirst({
        where: { id },
      });
      if (!comment) {
        throw new RpcException({
          message: `Comentario con el ID: ${id} no encontrado`,
          status: HttpStatus.NOT_FOUND,
        });
      }
      return comment;
    } catch (error) {
      this.logger.error(`Error obteniendo el comentario con ID: ${id}`, error);
      throw new RpcException({
        message: `Error obteniendo el comentario con ID: ${id}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findByTaskId(id: number) {
    this.logger.log(`Obteniendo comentario con task ID: ${id}`);
    try {
      const comment = await this.comment.findMany({
        where: { task_id: id },
      });
      if (!comment) {
        throw new RpcException({
          message: `Tarea con el ID: ${id} no tiene comentarios`,
          status: HttpStatus.NOT_FOUND,
        });
      }
      return comment;
    } catch (error) {
      this.logger.error(`Error obteniendo el comentario con ID: ${id}`, error);
      throw new RpcException({
        message: `Error obteniendo el comentario con ID: ${id}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    this.logger.log(`Actualizando comentario con ID: ${id}`);
    try {
      const comment = await this.findOne(id); 
      return await this.comment.update({
        where: { id },
        data: updateCommentDto,
      });
    } catch (error) {
      this.logger.error(
        `Error actualizando el comentario con ID: ${id}`,
        error,
      );
      throw new RpcException({
        message: `Error actualizando el comentario con ID: ${id}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async remove(id: number) {
    this.logger.log(`Eliminando comentario con ID: ${id}`);
    try {
      const comment = await this.findOne(id);
      return await this.comment.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Error eliminando el comentario con ID: ${id}`, error);
      throw new RpcException({
        message: `Error eliminando el comentario con ID: ${id}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
