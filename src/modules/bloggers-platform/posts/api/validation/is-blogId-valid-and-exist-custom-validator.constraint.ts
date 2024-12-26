import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { isValidObjectId } from 'mongoose';
import { BlogsQueryRepository } from 'src/modules/bloggers-platform/blogs/infrastructure/blogs-query.repository';

@ValidatorConstraint({ name: 'blodId', async: true })
@Injectable()
export class IsBlogIdValidAndExist implements ValidatorConstraintInterface {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async validate(blogId: string, args: ValidationArguments): Promise<boolean> {
    if (!isValidObjectId(blogId)) {
      return false;
    }

    const blog = await this.blogsQueryRepository.getBlogById(blogId);

    if (!blog) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return `The field '${args.property}' must reference an existing blog.`;
  }
}
