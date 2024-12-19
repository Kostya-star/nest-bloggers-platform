import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

export const TrimString = () =>
  applyDecorators(Transform(({ value }: { value: string }) => (typeof value === 'string' ? value.trim() : value)));
