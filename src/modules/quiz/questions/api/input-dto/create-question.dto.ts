import { CreateQuestionInputDto } from './create-question-input.dto';

export class CreateQuestionDto extends CreateQuestionInputDto {
  published: boolean;
}
