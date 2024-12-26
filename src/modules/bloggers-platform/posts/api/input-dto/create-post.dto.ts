import { CreatePostInputDto } from './create-post-input.dto';

export class CreatePostDto extends CreatePostInputDto {
  blogName: string;
}
