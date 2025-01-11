import { OmitType } from '@nestjs/swagger';
import { CreatePostInputDto } from './create-post-input.dto';

export class UpdatePostDto extends OmitType(CreatePostInputDto, ['blogId'] as const) {}
