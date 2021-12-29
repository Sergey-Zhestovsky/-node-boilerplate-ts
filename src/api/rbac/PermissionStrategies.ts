import { logger } from '@/libs/Logger';
import RbacController from './RbacController';

import { IAllowConfig, IRestrictConfig, TStrategyAlg } from './types';

export enum EStrategy {
  Waterfall = 'waterfall',
  GrandWaterfall = 'grandWaterfall',
  Restrict = 'restrict',
  FullyRestrict = 'fullyRestrict',
  Allow = 'allow',
  FullyAllow = 'fullyAllow',
}

export type TStrategyName = keyof typeof EStrategy;

class PermissionStrategies {
  static get Strategies() {
    return EStrategy;
  }

  private readonly rbacController: RbacController;

  constructor(rbacController: RbacController) {
    this.rbacController = rbacController;
  }

  private getRolePair(currentRole: string, targetRole: string, strategy?: TStrategyName) {
    const cRole = this.rbacController.getRole(currentRole);
    const tRole = this.rbacController.getRole(targetRole);

    if (!cRole || !tRole) {
      logger.warn(
        `RBAC${
          strategy ? ` ${strategy}` : ''
        }: didn't find '${currentRole}' or '${targetRole}' role.`
      );
      return null;
    }

    return { currentRole: cRole, targetRole: tRole };
  }

  getStrategy(strategyName: TStrategyName): TStrategyAlg;
  getStrategy(strategyName: 'Restrict'): TStrategyAlg<IRestrictConfig>;
  getStrategy(strategyName: 'Allow'): TStrategyAlg<IAllowConfig>;
  getStrategy(strategyName: TStrategyName) {
    const fnName = PermissionStrategies.Strategies[strategyName];
    return this[fnName].bind(this);
  }

  waterfall(currentRole: string, targetRole: string) {
    const polePair = this.getRolePair(currentRole, targetRole, 'Waterfall');
    if (!polePair) return false;
    return polePair.currentRole.contain(polePair.targetRole);
  }

  grandWaterfall(currentRole: string, targetRole: string) {
    const polePair = this.getRolePair(currentRole, targetRole, 'GrandWaterfall');
    if (!polePair) return false;
    return polePair.currentRole.include(polePair.targetRole);
  }

  restrict(currentRole: string, targetRole: string, { rolesRestriction = [] }: IRestrictConfig) {
    const polePair = this.getRolePair(currentRole, targetRole, 'Restrict');
    if (!polePair) return false;

    if (rolesRestriction.includes(polePair.currentRole.descriptor)) {
      return polePair.currentRole.descriptor === polePair.targetRole.descriptor;
    }

    return true;
  }

  fullyRestrict(currentRole: string, targetRole: string) {
    const polePair = this.getRolePair(currentRole, targetRole, 'FullyRestrict');
    if (!polePair) return false;
    return polePair.currentRole.descriptor === polePair.targetRole.descriptor;
  }

  allow(currentRole: string, targetRole: string, { rolesAllowance = [] }: IAllowConfig) {
    const polePair = this.getRolePair(currentRole, targetRole, 'Allow');
    if (!polePair) return false;

    if (rolesAllowance.includes(polePair.currentRole.descriptor)) {
      return true;
    }

    return polePair.currentRole.descriptor === polePair.targetRole.descriptor;
  }

  fullyAllow(currentRole: string, targetRole: string) {
    const polePair = this.getRolePair(currentRole, targetRole, 'FullyAllow');
    if (!polePair) return false;
    return true;
  }
}

export default PermissionStrategies;
