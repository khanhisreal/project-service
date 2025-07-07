import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from '@nestjs/class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
