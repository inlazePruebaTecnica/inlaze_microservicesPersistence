import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { UpdateTaskAssignamentDto } from './dto/update-taskAssignament.dto';
import { TaskFiltersDto } from './dto/task-filter.dto';
import { TaskKeywordsDto } from './dto/task-keywords.dto';

@Injectable()
export class TasksService extends PrismaClient {
  private readonly logger = new Logger('TasksService');

  async create(createTaskDto: CreateTaskDto) {
    this.logger.log('Creando tarea');
    try {
      return await this.task.create({
        data: createTaskDto,
      });
    } catch (error) {
      this.logger.error('Error creando tarea', error);
      throw new RpcException({
        message: 'Error creando tarea',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Obtener todas las tareas
  async findAll() {
    this.logger.log('Obteniendo todas las tareas');
    try {
      return await this.task.findMany({
        include: {
          proyect: true,
          comments: true,
        },
      });
    } catch (error) {
      this.logger.error('Error obteniendo las tareas', error);
      throw new RpcException({
        message: 'Error obteniendo las tareas',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findOne(id: number) {
    this.logger.log(`Obteniendo tarea con ID: ${id}`);
    try {
      const task = await this.task.findFirst({
        where: { id },
        include: {
          assignedUsers: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
      });
      if (!task) {
        throw new RpcException({
          message: `Tarea con el ID: ${id} no encontrada`,
          status: HttpStatus.NOT_FOUND,
        });
      }
      return task;
    } catch (error) {
      this.logger.error(`Error obteniendo tarea con ID: ${id}`, error);
      throw new RpcException({
        message: `Error obteniendo tarea con ID: ${id}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findByProjectId(id: number) {
    this.logger.log(`Obteniendo tarea con ID: ${id}`);
    try {
      const task = await this.task.findMany({
        where: { proyectId: id },
        include: {
          assignedUsers: {
            include: {
              user: true,
            },
          },
        },
      });
      if (!task) {
        throw new RpcException({
          message: `Tareas con el ID: ${id} no encontrada`,
          status: HttpStatus.NOT_FOUND,
        });
      }
      return task;
    } catch (error) {
      this.logger.error(`Error obteniendo tarea con ID: ${id}`, error);
      throw new RpcException({
        message: `Error obteniendo tarea con ID: ${id}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    this.logger.log(`Actualizando tarea con ID: ${id}`);
    try {
      const task = await this.findOne(id);
      return await this.task.update({
        where: { id },
        data: updateTaskDto,
      });
    } catch (error) {
      this.logger.error(`Error actualizando la tarea con ID: ${id}`, error);
      throw new RpcException({
        message: `Error actualizando la tarea con ID: ${id}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateTaskAssignament(
    updateTaskAssignamentDto: UpdateTaskAssignamentDto,
  ) {
    this.logger.log(
      `Inicio de asigancion: ${updateTaskAssignamentDto.user_id}`,
    );
    try {
      const assignament = await this.assignedTask.findFirst({
        where: {
          userId: updateTaskAssignamentDto.user_id,
          taskId: updateTaskAssignamentDto.task_id,
        },
      });
      if (updateTaskAssignamentDto.isRemove) {
        return this.assignedTask.delete({
          where: {
            id: assignament.id,
          },
        });
      }
      if (assignament)
        return {
          message: 'Usuario ya existe en la tarea',
        };
      return this.assignedTask.create({
        data: {
          userId: updateTaskAssignamentDto.user_id,
          taskId: updateTaskAssignamentDto.task_id,
        },
      });
    } catch (error) {
      this.logger.error(`Error asignando`, error);
      throw new RpcException({
        message: `Error asignando`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async remove(id: number) {
    this.logger.log(`Eliminando tarea con ID: ${id}`);
    try {
      const task = await this.findOne(id);
      return await this.task.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Error eliminando tarea con ID: ${id}`, error);
      throw new RpcException({
        message: `Error eliminando tarea con ID: ${id}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async searchTasksByKeywords(filter: TaskKeywordsDto) {
    this.logger.log('Buscando tareas por palabras clave');
    try {
      const tasks = await this.task.findMany({
        where: {
          proyectId: +filter.project_id,
          AND: filter.keywords.map((keyword) => ({
            OR: [
              {
                title: {
                  contains: keyword.toLowerCase(), // Convertir la palabra clave a minúsculas
                },
              },
              {
                description: {
                  contains: keyword.toLowerCase(),
                },
              },
            ],
          })),
        },
        include: {
          assignedUsers: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!tasks || tasks.length === 0) {
        throw new RpcException({
          message:
            'No se encontraron tareas con las palabras clave proporcionadas.',
          status: HttpStatus.NOT_FOUND,
        });
      }

      return tasks;
    } catch (error) {
      this.logger.error('Error buscando tareas por palabras clave', error);
      throw new RpcException({
        message: 'Error buscando tareas por palabras clave',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async filterTasks(filters: TaskFiltersDto) {
    const { state, dateLimit, assignedTo } = filters;

    return await this.task.findMany({
      where: {
        proyectId: +filters.task_id,
        ...(state && { state }),
        ...(dateLimit && { dateLimit: new Date(dateLimit) }),
        ...(assignedTo && {
          assignedUsers: {
            some: {
              userId: assignedTo,
            },
          },
        }),
      },
      include: {
        assignedUsers: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findTasksByUserWithComments(userId: number) {
    const tasks = await this.task.findMany({
      where: {
        assignedUsers: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        comments: true,
        assignedUsers: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!tasks || tasks.length === 0) {
      throw new Error('No tasks found for this user');
    }

    return tasks;
  }
}
