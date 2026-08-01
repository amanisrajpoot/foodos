import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { getAuth } from './auth';

@Controller('api/auth')
export class AuthController {
  @All('*')
  async handleAuth(@Req() req: any, @Res() res: any) {
    const auth = await getAuth();
    const { toNodeHandler } = await import('better-auth/node');
    const handler = toNodeHandler(auth);
    return handler(req, res);
  }
}
