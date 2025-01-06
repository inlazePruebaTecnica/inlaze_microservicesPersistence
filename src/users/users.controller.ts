import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/common/dto/login.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'create_user' })
  async create(@Payload() createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.usersService.findByUserName(
        createUserDto.username,
      ).catch(() => false);
      if (existingUser) {
        throw new RpcException({
          message: 'Usuario ya existe',
          status: HttpStatus.CONFLICT,
        });
      }

      const hashPassword = await bcrypt.hash(createUserDto.password, 10);
      return this.usersService.create({
        ...createUserDto,
        password: hashPassword,
      });
    } catch (error) {
      throw new RpcException({
        message: 'Error durante la creacion: ' + error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @MessagePattern({ cmd: 'find_all_user' })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @MessagePattern({ cmd: 'find_one_user' })
  findOne(@Payload() id: number) {
    return this.usersService.findOne(id);
  }

  @MessagePattern({ cmd: 'find_user_username' })
  findByUsername(@Payload() username: string) {
    return this.usersService.findByUserName(username);
  }

  @MessagePattern({ cmd: 'veryfi_user_credentials' })
  async verifyCredentials(@Payload() credentials: LoginDto) {
    console.log(credentials)
    const user = await this.usersService.findByUserName(credentials.username, true);
    try {
      const isMatch = await bcrypt.compare(credentials.password, user.password);
      if (!isMatch)
        throw new RpcException({
          message: 'Error en las credenciales ',
          status: HttpStatus.UNAUTHORIZED,
        });
      return user;
    } catch (err) {
      throw new RpcException({
        message: 'Error en las credenciales ',
        status: HttpStatus.UNAUTHORIZED,
      });
    }
  }

  @MessagePattern({ cmd: 'update_user' })
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern({ cmd: 'remove_user' })
  remove(@Payload('id') id: number) {
    return this.usersService.remove(id);
  }
}
