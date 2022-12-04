// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');
dotenv.config();

export const jwtConstants = {
  secret: process.env.AUTH_SECRET_KEY,
};
