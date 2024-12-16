import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
  transform(objId: string, metadata: ArgumentMetadata): string {
    if (!isValidObjectId(objId)) {
      throw new BadRequestException(`Invalid ObjectId: ${objId}`);
    }

    return objId;
  }
}
