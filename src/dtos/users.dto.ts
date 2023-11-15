import { IsString, IsNotEmpty, MinLength, MaxLength, IsEmail, IsUrl, IsAlpha, IsInt } from 'class-validator';

export class BaseUserDto {
  @IsString()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  public password: string;
}

export class CreateUserDto extends BaseUserDto {
  @IsString()
  @MaxLength(100)
  public name: string;
}

export class LoginUserDto extends BaseUserDto {}

export class UpdateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public bio: string;

  @IsUrl()
  public profilePicture: string;

  @IsUrl()
  public coverPicture: string;

  @IsString()
  @IsAlpha()
  public name: string;
}

export class UpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}

export class DeleteUserDto {
  @IsInt()
  public deleted: number;
}
