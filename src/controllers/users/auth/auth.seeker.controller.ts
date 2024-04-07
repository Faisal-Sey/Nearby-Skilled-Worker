import { SeekerAuthHelpers } from '../../../helpers/users/auth/auth.seeker.helpers';
import { User, UserExcludePassword, UserWithToken, UserLogin } from '../../../interfaces/users/user/users.interface';
import { ApiResponse } from '../../../utils/apiResponses';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '../../../interfaces/users/auth/auth.seeker.interface';
import { TokenData } from '../../../interfaces/users/common.interface';
import { AuthService } from '../../../services/auth.service';
import { ChangePasswordDto, DecodeTokenDto, ResetPasswordDto } from '../../../dtos/users.dto';

export class SeekerAuthController {
  public auth = Container.get(AuthService);
  public responses = Container.get(ApiResponse);
  public helpers = Container.get(SeekerAuthHelpers);

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const signUpUserData: User = await this.auth.signup(userData);
      const signUpUserDataWithoutPassword: UserExcludePassword = this.helpers.exclude(signUpUserData, ['password']);
      const userToken: TokenData = this.helpers.generateTokens(signUpUserDataWithoutPassword);
      const userDetailsWithToken: UserWithToken = { ...signUpUserDataWithoutPassword, ...userToken };
      this.responses.creationSuccessWithDataResponse(userDetailsWithToken, 'User created successfully', res);
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: UserLogin = req.body;
      const user: User = await this.auth.login(userData);
      const userToken: TokenData = this.helpers.generateTokens(user);
      const userWithToken: UserWithToken = { ...user, ...userToken };

      this.responses.successWithDataResponse(userWithToken, 'User logged in successfully', res);
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.auth.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email }: ResetPasswordDto = req.body;
      const status = await this.auth.resetPassword(email);

      if (status) {
        this.responses.successResponse('Email sent, Please check your email and follow the instructions to successfully reset your password', res);
      } else {
        this.responses.errorResponse('Email was not sent! Please try again shortly', res);
      }
    } catch (error) {
      next(error);
    }
  };

  public decodeResetPasswordToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token }: DecodeTokenDto = req.body;
      const { success, message, tokenData } = this.helpers.decodeToken('resetPassword', token);

      if (success) {
        this.responses.successWithDataResponse(tokenData, message, res);
      } else {
        this.responses.errorResponse(message, res);
      }
    } catch (error) {
      next(error);
    }
  };

  public changeUserPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId, password, confirmPassword }: ChangePasswordDto = req.body;
      if (password !== confirmPassword) {
        this.responses.errorResponse('Password must be the same', res);
      }

      const user: UserExcludePassword = await this.auth.changePassword(userId, password);
      this.responses.successWithDataResponse(user, 'Password changed successfully', res);
    } catch (error) {
      next(error);
    }
  };
}
