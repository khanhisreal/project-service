import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from '@nestjs/class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description: string;

  //This gets appended later in the service layer
  @IsOptional()
  @IsString()
  ownerId: string;
}
