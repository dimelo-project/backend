import { PickType } from '@nestjs/swagger';
import { Users } from '../../entities/Users';

export class DeleteUserDto extends PickType(Users, ['password']) {}
