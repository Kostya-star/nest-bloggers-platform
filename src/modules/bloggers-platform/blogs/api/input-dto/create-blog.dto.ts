import { Matches, MaxLength } from 'class-validator';
import { CheckIsStringAndTrim } from 'src/core/decorators/check-is-string-and-trim.decorator';
import { blogDescriptionConstraints, blogNameConstraints, blogWebsiteUrlConstraints } from '../../domain/blogs.schema';

export class CreateBlogDto {
  @CheckIsStringAndTrim()
  @MaxLength(blogNameConstraints.maxLength)
  name: string;

  @CheckIsStringAndTrim()
  @MaxLength(blogDescriptionConstraints.maxLength)
  description: string;

  @CheckIsStringAndTrim()
  @Matches(blogWebsiteUrlConstraints.match)
  @MaxLength(blogWebsiteUrlConstraints.maxLength)
  websiteUrl: string;
}
