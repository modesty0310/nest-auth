import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ description: 'id' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'pw' })
  @IsString()
  @IsNotEmpty()
  pw: string;
}
