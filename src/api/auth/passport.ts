import { Passport } from 'passport';

import { strategies } from './strategies';

export const passport = new Passport();

for (const [name, strategy] of Object.entries(strategies)) {
  passport.use(name, strategy);
}
