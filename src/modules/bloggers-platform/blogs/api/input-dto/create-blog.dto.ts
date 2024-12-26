import { IsNotEmpty, Matches, MaxLength } from 'class-validator';
import { CheckIsStringAndTrim } from 'src/core/decorators/check-is-string-and-trim.decorator';
import { blogDescriptionConstraints, blogNameConstraints, blogWebsiteUrlConstraints } from '../../domain/blogs.schema';

export class CreateBlogDto {
  @CheckIsStringAndTrim()
  @MaxLength(blogNameConstraints.maxLength)
  @IsNotEmpty()
  name: string;

  @CheckIsStringAndTrim()
  @MaxLength(blogDescriptionConstraints.maxLength)
  @IsNotEmpty()
  description: string;

  @CheckIsStringAndTrim()
  @Matches(blogWebsiteUrlConstraints.match)
  @MaxLength(blogWebsiteUrlConstraints.maxLength)
  @IsNotEmpty()
  websiteUrl: string;
}
