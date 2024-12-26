import { UserContext } from './user-context';

export class RefreshJwtContext extends UserContext {
  deviceId: string;
  iat: number;
  exp: number;
}
