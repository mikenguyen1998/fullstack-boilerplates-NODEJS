import { Role } from '../enums';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

/** Object được gắn vào `request.user` sau khi xác thực */
export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}
