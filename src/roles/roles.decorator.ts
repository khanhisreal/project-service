import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/enums/role.enum';

export const ROLES_KEY = 'roles';
//RolesDecorator is a function that takes a list of Roles/a single Roles enum object
export const RolesDecorator = (...roles: [Roles, ...Roles[]]) =>
  SetMetadata(ROLES_KEY, roles);
