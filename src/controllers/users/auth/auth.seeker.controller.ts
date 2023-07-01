import { SeekerAuthHelpers } from '../../../helpers/users/auth/auth.seeker.helpers';
import { User, UserExcludePassword, UserWithToken, UserLogin } from '../../../interfaces/users/user/users.interface';
import { ApiResponse } from '../../../utils/apiResponses';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '../../../interfaces/users/auth/auth.seeker.interface';
import { TokenData } from '../../../interfaces/users/common.interface';
import { AuthService } from '../../../services/auth.service';

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
}
