export type TStrategyAlg<T = never> = (
  currentRole: string,
  targetRole: string,
  config: T
) => boolean;

export interface IRestrictConfig {
  rolesRestriction: string[];
}

export interface IAllowConfig {
  rolesAllowance: string[];
}

type TRoleDescriptor = string;

type TRoleAction = string;

export interface IRoleSchema {
  descriptor: TRoleDescriptor;
  name: string;
  inherits: TRoleDescriptor[] | null;
  actions: TRoleAction[];
}
