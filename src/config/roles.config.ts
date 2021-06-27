import { IRoleSchema } from '../api/rbac/types';

export const superUser: IRoleSchema = {
  descriptor: 'SUPER_USER',
  name: 'admin',
  inherits: ['ADMIN', 'STUFF'],
  actions: ['admin_panel-bool'],
};

export const admin: IRoleSchema = {
  descriptor: 'ADMIN',
  name: 'admin',
  inherits: ['MODERATOR', 'STUFF'],
  actions: ['admin_panel-bool'],
};

export const moderator: IRoleSchema = {
  descriptor: 'MODERATOR',
  name: 'moderator',
  inherits: ['USER'],
  actions: ['moderator_panel-bool'],
};

export const stuff: IRoleSchema = {
  descriptor: 'STUFF',
  name: 'admin',
  inherits: ['PRE_STUFF'],
  actions: ['admin_panel-bool'],
};

export const user: IRoleSchema = {
  descriptor: 'USER',
  name: 'user',
  inherits: ['ANON_USER'],
  actions: ['user-panel_bool'],
};

export const anonUser: IRoleSchema = {
  descriptor: 'ANON_USER',
  name: 'user',
  inherits: null,
  actions: ['user-panel_bool'],
};

export const preStuff: IRoleSchema = {
  descriptor: 'PRE_STUFF',
  name: 'admin',
  inherits: ['PRE_PRE_STUFF', 'PRE_POST_STUFF'],
  actions: ['admin_panel-bool'],
};

export const prePreStuff: IRoleSchema = {
  descriptor: 'PRE_PRE_STUFF',
  name: 'admin',
  inherits: null,
  actions: ['admin_panel-bool'],
};

export const prePostStuff: IRoleSchema = {
  descriptor: 'PRE_POST_STUFF',
  name: 'admin',
  inherits: ['PRE_POST_POST_STUFF'],
  actions: ['admin_panel-bool'],
};

export const prePostPostStuff: IRoleSchema = {
  descriptor: 'PRE_POST_POST_STUFF',
  name: 'admin',
  inherits: null,
  actions: ['admin_panel-bool'],
};
