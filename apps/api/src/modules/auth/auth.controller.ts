import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { auth } from './auth';
import { toNodeHandler } from 'better-auth/node';

@Controller('api/auth')
export class AuthController {
  @All('*')
  async handleAuth(@Req() req: any, @Res() res: any) {
    const handler = toNodeHandler(auth);
    return handler(req, res);
  }
}
