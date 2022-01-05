import { Passport } from 'passport';

import { strategies } from './strategies';

export const passport = new Passport();

Object.entries(strategies).forEach(([name, strategy]) => {
  passport.use(name, strategy);
});
