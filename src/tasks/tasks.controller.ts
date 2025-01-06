import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskAssignamentDto } from './dto/update-taskAssignament.dto';
import { TaskFiltersDto } from './dto/task-filter.dto';
import { TaskKeywordsDto } from './dto/task-keywords.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern({ cmd: 'create_task' })
  create(@Payload() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @MessagePattern({ cmd: 'find_task' })
  findAll() {
    return this.tasksService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_task' })
  findOne(@Payload() id: number) {
    return this.tasksService.findOne(id);
  }

  @MessagePattern({ cmd: 'find_taskt_by_project' })
  findByProjectId(@Payload() id: number) {
    return this.tasksService.findByProjectId(id);
  }

  @MessagePattern({ cmd: 'find_task_by_keywords' })
  searchTasksByKeywords(@Payload() filter: TaskKeywordsDto) {
    return this.tasksService.searchTasksByKeywords(filter);
  }

  @MessagePattern({ cmd: 'find_task_by_filters' })
  filterTasks(@Payload() filters: TaskFiltersDto) {
    return this.tasksService.filterTasks(filters);
  }

  @MessagePattern({ cmd: 'find_task_comments_user' })
  findTasksByUserWithComments(@Payload() id: number) {
    return this.tasksService.findTasksByUserWithComments(id);
  }

  @MessagePattern({ cmd: 'update_task_user_assignament' })
  updateTaskAssignament(@Payload() updateTaskAssignamentDto: UpdateTaskAssignamentDto) {
    return this.tasksService.updateTaskAssignament(updateTaskAssignamentDto);
  }

  @MessagePattern({ cmd: 'update_task' })
  update(@Payload() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(updateTaskDto.id, updateTaskDto);
  }

  @MessagePattern({ cmd: 'remove_task' })
  remove(@Payload() id: number) {
    return this.tasksService.remove(id);
  }
}
