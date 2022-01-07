import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Post('/signup')
  signup() {}

  @Post('/login')
  login() {}

  @Post('/logout')
  logout() {}

  @Post('/check/email')
  checkEmail() {}

  @Post('/check/nickname')
  checkNickname() {}

  @Get('/:id')
  getUserInfo(@Param('id', ParseIntPipe) id: number) {}

  @Get('/me')
  getMyInfo() {}

  @Patch('/me')
  updateMyInfo() {}

  @Delete('/me')
  deleteMyAccount() {}

  @Post('/password')
  findMyPassword() {}

  @Patch('/password')
  updateMyPassword() {}
}
