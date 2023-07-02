import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { CreateUserDto, DeleteUserDto, UpdateUserDto, UpdateUserPasswordDto } from '../dtos/users.dto';
import { HttpException } from '../exceptions/httpException';
import { User } from '../interfaces/users/user/users.interface';

@Service()
export class UserService {
  public user = new PrismaClient().user;

  public async findAllUser(): Promise<User[]> {
    const allUser: User[] = await this.user.findMany({ where: { deleted: 0 } });
    return allUser;
  }

  public async findUserById(userId: string): Promise<User> {
    const findUser: User = await this.user.findFirst({ where: { id: userId, deleted: 0 } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async findUserByUniqueProperty(field: string | number | any, value: string): Promise<User> {
    const findUser: User = await this.user.findFirst({ where: { [field]: value, deleted: 0 } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    const findUser: User = await this.user.findFirst({ where: { username: userData.username, deleted: 0 } });
    if (findUser) throw new HttpException(409, `This username ${userData.username} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.user.create({ data: { ...userData, password: hashedPassword } });
    return createUserData;
  }

  public async updatePassword(userId: string, userData: UpdateUserPasswordDto): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const hashedPassword = await hash(userData.password, 10);
    const updateUserData = await this.user.update({ where: { id: userId }, data: { ...userData, password: hashedPassword } });
    return updateUserData;
  }

  // TODO!: Check how to make fields in UpdateUserDto optional
  public async updateUserData(userId: string, userData: any): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const updateUserData = await this.user.update({
      where: { id: userId },
      data: { ...userData },
    });
    return updateUserData;
  }

  public async deleteUser(userId: string): Promise<User> {
    const findUser: User = await this.user.findFirst({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const deleteStatus: DeleteUserDto = { deleted: 1 };
    const deleteUserData = await this.user.update({ where: { id: userId }, data: { ...deleteStatus } });
    return deleteUserData;
  }

  public async restoreUser(userId: string): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const deleteStatus: DeleteUserDto = { deleted: 0 };
    const deleteUserData = await this.user.update({ where: { id: userId }, data: { ...deleteStatus } });
    return deleteUserData;
  }
}
