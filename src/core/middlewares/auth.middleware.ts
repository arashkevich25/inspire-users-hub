import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import * as passport from 'passport';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    passport.authenticate(
      'headerapikey',
      { session: false, failureRedirect: '/unauthorized' },
      (value) => {
        if (value) {
          next();
        } else {
          return res.status(HttpStatus.FORBIDDEN).send('unauthorized');
        }
      },
    )(req, res, next);
  }
}
