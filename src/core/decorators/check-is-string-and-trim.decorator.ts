import { applyDecorators } from '@nestjs/common';
import { TrimString } from './trim-string.decorator';
import { IsString } from 'class-validator';

export const CheckIsStringAndTrim = () => applyDecorators(IsString(), TrimString());
