import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  constructor() {
    super({ header: 'api-key', prefix: '' }, true, async (apikey, done) => {
      const checkKey = process.env.API_KEY === apikey;
      return done(checkKey);
    });
  }
}
