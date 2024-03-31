import { LoginUserDto, CreateUserDto } from '@dtos/users.dto';
import { PrismaClient } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { User } from '@interfaces/users/user/users.interface';

@Service()
export class AuthService {
  public users = new PrismaClient().user;

  public async signup(userData: CreateUserDto): Promise<User> {
    const findUser: User = await this.users.findFirst({ where: { email: userData?.email, deleted: 0 } });
    if (findUser) throw new HttpException(401, `This username ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const findDeletedUser: User = await this.users.findFirst({ where: { email: userData?.email, deleted: 1 } });
    if (findDeletedUser) {
      await this.users.update({ where: { id: String(findDeletedUser.id) }, data: { ...userData, password: hashedPassword, deleted: 0 } });
      return this.users.findUnique({ where: { id: String(findDeletedUser.id) } });
    }

    return this.users.create({ data: { ...userData, password: hashedPassword } });
  }

  public async login(userData: LoginUserDto): Promise<User> {
    const findUser: User = await this.users.findFirst({ where: { email: userData?.email } });
    if (!findUser) throw new HttpException(401, `Incorrect username or password`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(401, 'Incorrect user or password');

    delete findUser.password;
    delete findUser.id;
    return findUser;
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User = await this.users.findFirst({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(401, "User doesn't exist");

    return findUser;
  }
}
