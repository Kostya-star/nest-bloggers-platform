import { UserContext } from './user-context';

export class JwtContext extends UserContext {
  iat: number;
  exp: number;
}
