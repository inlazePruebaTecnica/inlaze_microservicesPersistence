import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @MessagePattern({ cmd: 'create_comment' })
  create(@Payload() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @MessagePattern({ cmd: 'find_comments' })
  findAll() {
    return this.commentsService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_comment' })
  findOne(@Payload() id: number) {
    return this.commentsService.findOne(id);
  }

  @MessagePattern({ cmd: 'find_comment_by_task' })
  findByTaskId(@Payload() id: number) {
    return this.commentsService.findByTaskId(id);
  }

  @MessagePattern({ cmd: 'update_comment' })
  update(@Payload() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(updateCommentDto.id, updateCommentDto);
  }

  @MessagePattern({ cmd: 'remove_comment' })
  remove(@Payload() id: number) {
    return this.commentsService.remove(id);
  }
}
