import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { User } from '../../../interfaces/users/user/users.interface';
import { UserService } from '../../../services/users.service';
import { ApiResponse } from '../../../utils/apiResponses';
import { ForgetPassword, ResetPassword } from '../../../interfaces/users/auth/auth.seeker.interface';

export class UserController {
  public user = Container.get(UserService);
  public responses = Container.get(ApiResponse);

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: User[] = await this.user.findAllUser();

      this.responses.successWithDataResponse(findAllUsersData, 'Users fetched successfully', res);
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.params.id;
      const findOneUserData: User = await this.user.findUserById(userId);

      this.responses.successWithDataResponse(findOneUserData, 'User fetched successfully', res);
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const createUserData: User = await this.user.createUser(userData);

      this.responses.creationSuccessWithDataResponse(createUserData, 'User created successfully', res);
    } catch (error) {
      next(error);
    }
  };

  // TODO!: Find how to make the class fields optional then uncomment this
  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.params.id;
      const userData: User = req.body;
      const updateUserData: User = await this.user.updateUserData(userId, userData);
      delete updateUserData.password;

      this.responses.successWithDataResponse(updateUserData, 'User updated successfully', res);
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.params.id;
      const deleteUserData: User = await this.user.deleteUser(userId);

      this.responses.successWithDataResponse(deleteUserData, 'User deleted successfully', res);
    } catch (error) {
      next(error);
    }
  };

  // TODO: Email functionality to be implemented
  public forgetUserPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: ForgetPassword = req.body;
      const user: User = await this.user.findUserByUniqueProperty('email', userData.email);

      this.responses.successWithDataResponse(user, 'User retrieved successfully', res);
    } catch (error) {
      next(error);
    }
  };

  public resetUserPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: ResetPassword = req.body;
      if (userData.confirmPassword && userData.confirmPassword !== userData.password) {
        this.responses.errorResponse('Passwords do not match', res);
      }

      const user: User = await this.user.updatePassword(userData.id, { password: userData.password });
      this.responses.successWithDataResponse(user, 'User retrieved successfully', res);
    } catch (error) {
      next(error);
    }
  };
}
