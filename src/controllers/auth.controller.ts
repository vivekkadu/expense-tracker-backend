import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { validate } from 'class-validator';
import { LoginDto, RegisterDto } from '../validators/auth.validator';

export class AuthController {
  private authService = new AuthService();

  async register(req: Request, res: Response) {
    try {
      const registerDto = Object.assign(new RegisterDto(), req.body);
      const errors = await validate(registerDto);
      
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const result = await this.authService.register(registerDto);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  async login(req: Request, res: Response) {
    try {
      const loginDto = Object.assign(new LoginDto(), req.body);
      const errors = await validate(loginDto);
      
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const result = await this.authService.login(loginDto);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(401).json({ message: 'An unexpected error occurred' });
      }
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const user = await this.authService.getProfile(userId);
      res.json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(404).json({ message: 'An unexpected error occurred' });
      }
    }
  }
}