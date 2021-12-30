import { Role } from './Role';
import { Action } from './Action';
import { PermissionStrategies, TStrategyName } from './PermissionStrategies';
import { RbacConstructor } from './RbacConstructor';

import * as roleSchemaConfig from '@/config/roles.config';
import { IAllowConfig, IRestrictConfig, IRoleSchema } from './types';

export class RbacController {
  public root: Role | null;
  public roles: Role[];
  public actions: Action[];

  private readonly permissionStrategies: PermissionStrategies;

  public initialized: boolean;
  public synchronized: boolean;

  constructor() {
    this.root = null;
    this.roles = [];
    this.actions = [];

    this.permissionStrategies = new PermissionStrategies(this);

    this.initialized = false;
    this.synchronized = false;
  }

  initialize(roleSchemasObj: Record<string, IRoleSchema> = roleSchemaConfig) {
    const rbacConstructor = new RbacConstructor(roleSchemasObj);
    const { rootRole, roles, actions } = rbacConstructor.buildRoleTree();

    this.root = rootRole;
    this.roles = roles;
    this.actions = actions;
    this.initialized = true;
  }

  async synchronize() {
    if (!this.initialized) return;
    // TODO: connect and synchronize with db
    // Rules: if action changed, added or removed - synchronize;
    // if role added - synchronize;
    // if role changed or removed - if role did not used: accept otherwise reject.
    // Also, set `synchronized` for every role and action.
    this.synchronized = true;
  }

  preOrderWalkTrough(callback: (role: Role) => void) {
    if (!this.root) return;
    this.root.preOrderWalk(callback);
  }

  postOrderWalkTrough(callback: (role: Role) => void) {
    if (!this.root) return;
    this.root.postOrderWalk(callback);
  }

  /**
   * Get action by name
   */
  getAction(actinName: string) {
    return this.actions.find((a) => a.name === actinName) ?? null;
  }

  /**
   * Get role by name
   */
  getRole(roleDescriptor: string) {
    return this.roles.find((r) => r.descriptor === roleDescriptor) ?? null;
  }

  /**
   * Check for permission of `current role` relative to `target role` based of inheritance tree.
   * For example, if `current role` inherits `target role` then permission accepted.
   * Otherwise, if `target role` inherits `current role` then `current role` stays lover in tree and
   *  permission will be denied.
   */
  permitByRole(currentRole: Role | string, targetRole: Role | string) {
    const cRole = typeof currentRole === 'string' ? this.getRole(currentRole) : currentRole;
    const tRole = typeof targetRole === 'string' ? this.getRole(targetRole) : targetRole;
    if (!cRole || !tRole) return false;
    return cRole.include(tRole);
  }

  /**
   * Can `current role` access particular action.
   */
  permitByAction(currentRole: Role | string, action: Action | string) {
    const cRole = typeof currentRole === 'string' ? this.getRole(currentRole) : currentRole;
    const cAction = typeof action === 'string' ? this.getAction(action) : action;
    if (!cRole || !cAction) return false;
    return cRole.can(cAction);
  }

  /**
   * Check for user permission based on permission strategies.
   */
  permitByStrategy(
    strategyName: TStrategyName,
    currentRole: Role | string,
    targetRole: Role | string
  ): boolean;
  permitByStrategy(
    strategyName: 'Restrict',
    currentRole: Role | string,
    targetRole: Role | string,
    options: IRestrictConfig
  ): boolean;
  permitByStrategy(
    strategyName: 'Allow',
    currentRole: Role | string,
    targetRole: Role | string,
    options: IAllowConfig
  ): boolean;
  permitByStrategy(
    strategy: TStrategyName,
    currentRole: Role | string,
    targetRole: Role | string,
    options?: IRestrictConfig | IAllowConfig
  ) {
    const cRole = typeof currentRole === 'string' ? currentRole : currentRole.descriptor;
    const tRole = typeof targetRole === 'string' ? targetRole : targetRole.descriptor;
    return this.permissionStrategies.getStrategy(strategy)(cRole, tRole, options as never);
  }
}
