import { Min } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class PaginationDto {
  //number of records to skip
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  skip?: number;

  //maximum number of records to retrieve
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  query?: string;

  @IsString()
  @IsOptional()
  ownedBy?: string;
}
