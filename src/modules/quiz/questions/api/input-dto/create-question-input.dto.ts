import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, Length } from 'class-validator';
import { CheckIsStringAndTrim } from 'src/core/decorators/check-is-string-and-trim.decorator';
import { questionBodyConstraints } from '../../domain/question.schema';

export class CreateQuestionInputDto {
  @CheckIsStringAndTrim()
  @Length(questionBodyConstraints.minLength, questionBodyConstraints.maxLength)
  @IsNotEmpty()
  body: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  correctAnswers: string[];
}
