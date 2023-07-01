import { LoginUserDto, CreateUserDto } from './../dtos/users.dto';
import { PrismaClient } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '../exceptions/httpException';
import { User } from '../interfaces/users/user/users.interface';

@Service()
export class AuthService {
  public users = new PrismaClient().user;

  public async signup(userData: CreateUserDto): Promise<User> {
    const findUser: User = await this.users.findFirst({ where: { username: userData?.username, deleted: 0 } });
    if (findUser) throw new HttpException(401, `This username ${userData.username} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const findDeletedUser: User = await this.users.findFirst({ where: { username: userData?.username, deleted: 1 } });
    if (findDeletedUser) {
      await this.users.update({ where: { id: String(findDeletedUser.id) }, data: { ...userData, password: hashedPassword, deleted: 0 } });
      return await this.users.findUnique({ where: { id: String(findDeletedUser.id) } });
    }

    const createUserData: Promise<User> = this.users.create({ data: { ...userData, password: hashedPassword } });
    return createUserData;
  }

  public async login(userData: LoginUserDto): Promise<User> {
    const findUser: User = await this.users.findFirst({ where: { username: userData?.username } });
    if (!findUser) throw new HttpException(401, `This username ${userData.username} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(401, 'Password is not matching');

    delete findUser.password;
    return findUser;
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User = await this.users.findFirst({ where: { username: userData.username, password: userData.password } });
    if (!findUser) throw new HttpException(401, "User doesn't exist");

    return findUser;
  }
}
