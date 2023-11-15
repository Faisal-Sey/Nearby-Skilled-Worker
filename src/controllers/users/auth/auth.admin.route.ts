// import { ApiResponse } from '../../../utils/apiResponses';
// import { NextFunction, Request, Response } from 'express';
// import { Container } from 'typedi';
// import { RequestWithUser } from '../../../interfaces/users/auth/auth.seeker.interface';
// import { TokenData } from '../../../interfaces/users/common.interface';
// import { User } from '../../../interfaces/users/user/users.interface';
// import { AuthService } from '../../../services/auth.service';
// import { Admin, AdminLogin, AdminWithToken } from '../../../interfaces/users/admin/admin.interface';
// import { AdminAuthHelpers } from '../../..//helpers/users/auth/auth.admin.helpers';
//
// export class SeekerAuthController {
//   public auth = Container.get(AuthService);
//   public responses = Container.get(ApiResponse);
//   public helpers = Container.get(AdminAuthHelpers);
//
//   public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const adminData: AdminLogin = req.body;
//       const admin: Admin = await this.auth.login(adminData);
//       const adminToken: TokenData = this.helpers.generateTokens(admin);
//       const adminWithToken: AdminWithToken = { ...admin, ...adminToken };
//
//       this.responses.successWithDataResponse(adminWithToken, 'Admin logged in successfully', res);
//     } catch (error) {
//       next(error);
//     }
//   };
//
//   public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const userData: User = req.user;
//       const logOutUserData: User = await this.auth.logout(userData);
//
//       res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
//       res.status(200).json({ data: logOutUserData, message: 'logout' });
//     } catch (error) {
//       next(error);
//     }
//   };
// }
