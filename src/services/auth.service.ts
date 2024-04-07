import { LoginUserDto, CreateUserDto } from '../dtos/users.dto';
import { PrismaClient } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { Container, Service } from 'typedi';
import { HttpException } from '../exceptions/httpException';
import { User, UserExcludePassword } from '../interfaces/users/user/users.interface';
import axios from 'axios';
import { EMAIL_BACKEND_API, EMAIL_BACKEND_API_USER, RESET_PASSWORD_PAGE_URL } from '../config';
import { SeekerAuthHelpers } from '../helpers/users/auth/auth.seeker.helpers';

@Service()
export class AuthService {
  public users = new PrismaClient().user;
  public authHelpers = Container.get(SeekerAuthHelpers);

  public async signup(userData: CreateUserDto): Promise<User> {
    const findUser: User = await this.users.findFirst({ where: { email: userData?.email, deleted: 0 } });
    if (findUser) throw new HttpException(401, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const findDeletedUser: User = await this.users.findFirst({ where: { email: userData?.email, deleted: 1 } });
    if (findDeletedUser) {
      await this.users.update({
        where: { id: String(findDeletedUser.id) },
        data: { ...userData, password: hashedPassword, deleted: 0 },
      });
      return this.users.findUnique({ where: { id: String(findDeletedUser.id) } });
    }

    return this.users.create({ data: { ...userData, password: hashedPassword } });
  }

  public async login(userData: LoginUserDto): Promise<User> {
    const findUser: User = await this.users.findFirst({ where: { email: userData?.email } });
    if (!findUser) throw new HttpException(401, `Incorrect email or password`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(401, 'Incorrect email or password');

    delete findUser.password;
    delete findUser.id;
    return findUser;
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User = await this.users.findFirst({
      where: {
        email: userData.email,
        password: userData.password,
      },
    });
    if (!findUser) throw new HttpException(401, "User doesn't exist");

    return findUser;
  }

  public async resetPassword(email: string): Promise<Boolean> {
    const findUser: User = await this.users.findFirst({ where: { email } });
    if (!findUser) throw new HttpException(401, `Incorrect email or password`);

    const tokenData = {
      userId: findUser.id as string,
      email: findUser.email,
    };

    const resetPasswordToken = this.authHelpers.generateResetPasswordToken(tokenData);

    const resetPasswordLink = RESET_PASSWORD_PAGE_URL + '?token=' + resetPasswordToken;

    let message = `<body> <p>Dear ${findUser.name},</p> `;
    message +=
      '<p>We received a request to reset your password for your account with Gigs Platform. To proceed with the password reset, please click on the link below:</p> ';
    message += `<p><a href="${resetPasswordLink}"><u>Reset Password</u></a></p>`;
    message +=
      '<p>If you did not request this password reset, you can safely ignore this email. Your account remains secure and no changes have been made.</p> ';
    message += `<p>Please note that this link will expire in 3 days. If you need further assistance, please contact our support team at <a href="mailto:${EMAIL_BACKEND_API_USER}">phaisalsey6@gmail.com</a>.</p> `;
    message += '<p>Thank you for using Gigs Platform.</p> <p>Best regards,</p> <p>Faisal Issaka<br> Creator <br> Gigs Platform</p></body>';

    const response = await axios.post(EMAIL_BACKEND_API, {
      email,
      subject: 'Gigs Platform - Password Reset Instructions',
      message,
      message_type: 'html',
    });

    return response.data.status === 'success';
  }

  public async changePassword(userId: string, password: string): Promise<UserExcludePassword> {
    const user = await this.users.findFirst({ where: { id: userId } });
    if (!user) throw new HttpException(401, `User does not exists`);
    const hashedPassword = await hash(password, 10);
    return this.users.update({ where: { id: userId }, data: { password: hashedPassword } });
  }
}
