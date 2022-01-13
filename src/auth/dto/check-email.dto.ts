import { PickType } from '@nestjs/swagger';
import { Users } from '../../entities/Users';

export class CheckEmailDto extends PickType(Users, ['email'] as const) {}
