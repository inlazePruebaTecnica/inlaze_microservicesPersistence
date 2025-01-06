import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('UserService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('CONEXION CON BASE DE DATOS');
  }

  create(createUserDto: CreateUserDto) {
    this.logger.log('CREACION DE USUARIO');
    return this.user.create({
      data: createUserDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalpage = await this.user.count({
      where: { available: true },
    });
    const lastPage = Math.ceil(+totalpage / limit);

    return {
      data: await this.user.findMany({
        where: { available: true },
        take: limit,
        skip: (page - 1) * limit,
        select: {
          ...Object.fromEntries(
            Object.keys(this.user.fields).map((key) => [
              key,
              key !== 'password',
            ]),
          ),
        },
      }),
      meta: {
        total: totalpage,
        page,
        lastPage: lastPage,
      },
    };
  }

  async findOne(id: number) {
    const user = await this.user.findFirst({
      where: {
        id,
        available: true,
      },
      select: {
        ...Object.fromEntries(
          Object.keys(this.user.fields).map((key) => [key, key !== 'password']),
        ),
      },
    });
    if (!user)
      throw new RpcException({
        message: `Usuario con el ID: ${id} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    return user;
  }

  async findByUserName(username: string, isLogin: boolean = false) {
    let user;
    if (isLogin)
      user = await this.user.findFirst({
        where: {
          username,
          available: true,
        },
      });
    else
      user = await this.user.findFirst({
        where: {
          username,
          available: true,
        },
        select: {
          ...Object.fromEntries(
            Object.keys(this.user.fields).map((key) => [
              key,
              key !== 'password',
            ]),
          ),
        },
      });
    if (!user && !isLogin)
      throw new RpcException({
        message: `Usuario con el ID: ${username} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    if (!user && isLogin)
      throw new RpcException({
        message: `Error de credenciales`,
        status: HttpStatus.UNAUTHORIZED,
      });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { id: __, ...data } = updateUserDto;
    await this.findOne(id);
    return this.user.update({
      where: {
        id,
      },
      select: {
        ...Object.fromEntries(
          Object.keys(this.user.fields).map((key) => [key, key !== 'password']),
        ),
      },
      data: data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    const user = await this.user.update({
      where: { id },
      data: {
        available: false,
      },
    });

    return user;
  }
}
