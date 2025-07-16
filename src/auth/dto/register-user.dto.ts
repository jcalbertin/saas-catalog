import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ description: 'Username do usuário' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Role do usuário', default: 'user' })
  @IsString()
  role?: string;

  @ApiProperty({ description: 'ID do tenant do usuário' })
  tenant_id: number;
}
