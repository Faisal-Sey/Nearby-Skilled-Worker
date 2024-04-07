import { IsString, IsNotEmpty, MinLength, MaxLength, IsEmail, IsUrl, IsAlpha, IsInt, Length, IsUUID } from 'class-validator';

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

export class ResetPasswordDto {
  @IsEmail()
  public email: string;
}

export class DecodeTokenDto {
  @IsString()
  @IsNotEmpty()
  public token: string;
}

export class ChangePasswordDto {
  @IsUUID()
  @IsNotEmpty()
  public userId: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255, { message: 'Password must be at least 8 characters long' })
  public password: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255, { message: 'Password must be at least 8 characters long' })
  public confirmPassword: string;
}
