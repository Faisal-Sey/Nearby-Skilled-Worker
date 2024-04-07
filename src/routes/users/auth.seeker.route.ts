import { LoginUserDto, CreateUserDto, ResetPasswordDto, DecodeTokenDto, ChangePasswordDto } from '../../dtos/users.dto';
import { Router } from 'express';
import { SeekerAuthController } from '../../controllers/users/auth/auth.seeker.controller';
import { Routes } from '../../interfaces/routes.interface';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { ValidationMiddleware } from '../../middlewares/validation.middleware';

export class SeekerAuthRoute implements Routes {
  public path = '/auth/seeker/';
  public router = Router();
  public auth = new SeekerAuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}signup`, ValidationMiddleware(CreateUserDto, false), this.auth.signUp);
    this.router.post(`${this.path}login`, ValidationMiddleware(LoginUserDto, false), this.auth.logIn);
    this.router.post(`${this.path}reset-password`, ValidationMiddleware(ResetPasswordDto, false), this.auth.resetPassword);
    this.router.post(`${this.path}decode-reset-password-token`, ValidationMiddleware(DecodeTokenDto, false), this.auth.decodeResetPasswordToken);
    this.router.post(`${this.path}change-password`, ValidationMiddleware(ChangePasswordDto, false), this.auth.changeUserPassword);
    this.router.post(`${this.path}logout`, AuthMiddleware, this.auth.logOut);
  }
}
