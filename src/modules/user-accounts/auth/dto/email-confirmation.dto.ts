import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';

export class EmailConfirmationDto {
  code: string | null = uuidv4();
  expDate: Date | null = add(new Date(), { minutes: 5 });
  isConfirmed: boolean = false;
}
