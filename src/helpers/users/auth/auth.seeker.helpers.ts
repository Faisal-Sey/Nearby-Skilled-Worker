import { TokenData } from '../../../interfaces/users/common.interface';
import jwt from 'jsonwebtoken';
import { UserExcludePassword } from '../../../interfaces/users/user/users.interface';
import { Service } from 'typedi';
import { RESET_PASSWORD_TOKEN_KEY, TOKEN_KEY } from '../../../config';
import { ResetPasswordTokenData } from '../../../interfaces/users/auth/auth.seeker.interface';

@Service()
export class SeekerAuthHelpers {
  // Exclude a field from user data
  public exclude<User, Key extends keyof User>(user: User, keys: Key[]): Omit<User, Key> {
    for (const key of keys) {
      delete user[key];
    }
    return user;
  }

  // Generate a token for user
  public generateTokens(user: UserExcludePassword): TokenData {
    if (user) {
      const accessToken = jwt.sign({ ...user }, TOKEN_KEY, { expiresIn: '2d' });
      return { token: accessToken, expiresIn: 2 };
    }
    return { token: '', expiresIn: 0 };
  }

  public generateResetPasswordToken(resetTokenData: ResetPasswordTokenData): string {
    const { userId, email } = resetTokenData;
    if (userId && email) {
      return jwt.sign(resetTokenData, RESET_PASSWORD_TOKEN_KEY, { expiresIn: '2d' });
    }
    return '';
  }

  public decodeToken(tokenType: string, token: string) {
    const tokenKeys = {
      resetPassword: RESET_PASSWORD_TOKEN_KEY,
      login: TOKEN_KEY,
    };

    const tokenKey = tokenKeys[tokenType];

    try {
      return {
        success: true,
        message: 'Token verified successfully',
        tokenData: jwt.verify(token, tokenKey),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Verification token expired or malformed',
        tokenData: {},
      };
    }
  }
}
