import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto';

/** Đăng ký công khai: không cho phép tự chọn role */
export class RegisterDto extends OmitType(CreateUserDto, ['role'] as const) {}
