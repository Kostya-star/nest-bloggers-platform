import { OmitType } from '@nestjs/swagger';
import { CreatePostInputDto } from 'src/modules/bloggers-platform/posts/api/input-dto/create-post-input.dto';

export class CreatePostForBlogInputDto extends OmitType(CreatePostInputDto, ['blogId'] as const) {}
// {
//   title: string;
//   shortDescription: string;
//   content: string;
// }
