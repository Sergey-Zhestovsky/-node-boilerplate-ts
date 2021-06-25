const RbacController = require('./RbacController');
const logger = require('../../libs/Logger');

/**
 * @typedef {String} RoleDescriptor
 */

class PermissionStrategies {
  static get Strategies() {
    return {
      'waterfall': 'waterfall',
      'grand-waterfall': 'grandWaterfall',
      'restrict': 'restrict',
      'fully-restrict': 'fullyRestrict',
      'allow': 'allow',
      'fully-allow': 'fullyAllow',
    };
  }

  /**
   * @param {RbacController} rbacController
   */
  constructor(rbacController) {
    this.rbacController = rbacController;
  }

  /**
   *
   * @param {RoleDescriptor} currentRole
   * @param {RoleDescriptor} targetRole
   * @param {string} [strategy]
   */
  getRolePair(currentRole, targetRole, strategy) {
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

  /**
   *
   * @param {string} strategyName
   * @returns
   */
  getStrategy(strategyName) {
    const fnName = PermissionStrategies.Strategies[strategyName];
    if (!fnName) return () => false;
    return this[fnName].bind(this);
  }

  /**
   *
   * @param {RoleDescriptor} currentRole
   * @param {RoleDescriptor} targetRole
   * @returns {boolean}
   */
  waterfall(currentRole, targetRole) {
    const polePair = this.getRolePair(currentRole, targetRole, 'waterfall');
    if (!polePair) return false;
    return polePair.currentRole.contain(polePair.targetRole);
  }

  /**
   *
   * @param {RoleDescriptor} currentRole
   * @param {RoleDescriptor} targetRole
   * @returns {boolean}
   */
  grandWaterfall(currentRole, targetRole) {
    const polePair = this.getRolePair(currentRole, targetRole, 'grand-waterfall');
    if (!polePair) return false;
    return polePair.currentRole.include(polePair.targetRole);
  }

  /**
   *
   * @typedef {Object} RestrictOptions
   *  @property {RoleDescriptor[]} rolesRestriction
   *
   * @param {RoleDescriptor} currentRole
   * @param {RoleDescriptor} targetRole
   * @param {RestrictOptions} option
   */
  restrict(currentRole, targetRole, { rolesRestriction = [] }) {
    const polePair = this.getRolePair(currentRole, targetRole, 'restrict');
    if (!polePair) return false;

    if (rolesRestriction.includes(polePair.currentRole.descriptor)) {
      return polePair.currentRole.descriptor === polePair.targetRole.descriptor;
    }

    return true;
  }

  /**
   *
   * @param {RoleDescriptor} currentRole
   * @param {RoleDescriptor} targetRole
   */
  fullyRestrict(currentRole, targetRole) {
    const polePair = this.getRolePair(currentRole, targetRole, 'fully-restrict');
    if (!polePair) return false;
    return polePair.currentRole.descriptor === polePair.targetRole.descriptor;
  }

  /**
   *
   * @typedef {Object} AllowOptions
   *  @property {RoleDescriptor[]} rolesAllowance
   *
   * @param {RoleDescriptor} currentRole
   * @param {RoleDescriptor} targetRole
   * @param {AllowOptions} option
   */
  allow(currentRole, targetRole, { rolesAllowance = [] }) {
    const polePair = this.getRolePair(currentRole, targetRole, 'allow');
    if (!polePair) return false;

    if (rolesAllowance.includes(polePair.currentRole.descriptor)) {
      return true;
    }

    return polePair.currentRole.descriptor === polePair.targetRole.descriptor;
  }

  /**
   *
   * @param {RoleDescriptor} currentRole
   * @param {RoleDescriptor} targetRole
   */
  fullyAllow(currentRole, targetRole) {
    const polePair = this.getRolePair(currentRole, targetRole, 'fully-allow');
    if (!polePair) return false;
    return true;
  }
}

module.exports = PermissionStrategies;
