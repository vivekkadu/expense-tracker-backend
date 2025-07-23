import { User, UserRole } from '../models/User';
import { LoginDto, RegisterDto } from '../validators/auth.validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  async register(registerDto: RegisterDto) {
    const existingUser = await User.findOne({
      where: { email: registerDto.email }
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const user = await User.create({
      ...registerDto,
      password: hashedPassword
    });

    const { password, ...userWithoutPassword } = user.toJSON();
    const token = this.generateToken(user);

    return {
      user: userWithoutPassword,
      token
    };
  }

  async login(loginDto: LoginDto) {
    const user = await User.findOne({
      where: { email: loginDto.email }
    });

    if (!user || !user.isActive) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const { password, ...userWithoutPassword } = user.toJSON();
    const token = this.generateToken(user);

    return {
      user: userWithoutPassword,
      token
    };
  }

  async getProfile(userId: number) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "",
      { expiresIn: '24h' }
    );
  } 
}