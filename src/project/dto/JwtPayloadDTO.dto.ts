/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString } from '@nestjs/class-validator';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { AccountType, Roles, Status } from 'src/enums/role.enum';

export class JwtPayloadDTO {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsEnum(Status)
  status: Status;

  @IsEnum(AccountType)
  accountType: AccountType;

  @IsEnum(Roles)
  role: Roles;
}
