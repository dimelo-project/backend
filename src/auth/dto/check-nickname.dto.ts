import { PickType } from '@nestjs/swagger';
import { Users } from '../../entities/Users';

export class CheckNicknameDto extends PickType(Users, ['nickname'] as const) {}
