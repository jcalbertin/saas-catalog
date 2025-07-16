import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ 
      where: { username },
      relations: ['tenant']
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { 
      username: user.username, 
      sub: user.id,
      role: user.role,
      tenant_id: user.tenant_id
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        tenant_id: user.tenant_id
      }
    };
  }

  async register(userData: RegisterUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [{ username: userData.username }, { email: userData.email }]
    });

    if (existingUser) {
      throw new UnauthorizedException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword
    });

    const savedUser = await this.userRepository.save(user);
    if (savedUser) {
      const { password, ...result } = savedUser;
      return result;
    }
    throw new UnauthorizedException('Failed to create user');
  }
}