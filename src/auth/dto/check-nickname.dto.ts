import { PickType } from '@nestjs/swagger';
import { Users } from 'src/entities/Users';

export class CheckNicknameDto extends PickType(Users, ['nickname'] as const) {}
