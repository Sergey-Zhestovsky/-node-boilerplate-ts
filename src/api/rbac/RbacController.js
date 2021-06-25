const Role = require('./Role');
const Action = require('./Action');
const PermissionStrategies = require('./PermissionStrategies');
const RbacConstructor = require('./RbacConstructor');
const roleSchemaConfig = require('../../config/roles.config');

class RbacController {
  constructor() {
    /** @type {Role | null} */
    this.root = null;
    /** @type {Role[]} */
    this.roles = [];
    /** @type {Action[]} */
    this.actions = [];

    this.permissionStrategies = new PermissionStrategies(this);

    this.initiated = false;
    this.synchronized = false;
  }

  /**
   * @typedef {Object} RoleSchema
   *   @property {string} descriptor
   *   @property {string} name
   *   @property {string[] | null} inherits
   *   @property {string[]} actions
   *
   * @param {Object<string, RoleSchema>} roleSchemasObj
   */
  initialize(roleSchemasObj = roleSchemaConfig) {
    const rbacConstructor = new RbacConstructor(roleSchemasObj);
    const { rootRole, roles, actions } = rbacConstructor.buildRoleTree();

    this.root = rootRole;
    this.roles = roles;
    this.actions = actions;
    this.initialize = true;
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

  /**
   * Pre-order walk through Role tree
   * @param {(role: Role) => void} callback
   */
  preOrderWalkTrough(callback) {
    this.root.preOrderWalk(callback);
  }

  /**
   * Post-order walk through Role tree
   * @param {(role: Role) => void} callback
   */
  postOrderWalkTrough(callback) {
    this.root.postOrderWalk(callback);
  }

  /**
   * Get action by name
   * @param {string} actinName
   * @returns {Action | null}
   */
  getAction(actinName) {
    return this.actions.find((a) => a.name === actinName) ?? null;
  }

  /**
   * Get role by name
   * @param {string} roleDescriptor
   * @returns {Role | null}
   */
  getRole(roleDescriptor) {
    return this.roles.find((r) => r.descriptor === roleDescriptor) ?? null;
  }

  /**
   * Check for permission of `current role` relative to `target role` based of inheritance tree.
   * For example, if `current role` inherits `target role` then permission accepted.
   * Otherwise, if `target role` inherits `current role` then `current role` stays lover in tree and
   *  permission will be denied.
   * @param {Role | string} currentRole
   * @param {Role | string} targetRole
   * @returns {boolean}
   */
  permitByRole(currentRole, targetRole) {
    const cRole = typeof currentRole === 'string' ? this.getRole(currentRole) : currentRole;
    const tRole = typeof targetRole === 'string' ? this.getRole(targetRole) : targetRole;
    if (!cRole || !tRole) return false;
    return cRole.include(tRole);
  }

  /**
   * Can `current role` access particular action.
   * @param {Role | string} currentRole
   * @param {Action | string} action
   * @returns {boolean}
   */
  permitByAction(currentRole, action) {
    const cRole = typeof currentRole === 'string' ? this.getRole(currentRole) : currentRole;
    const cAction = typeof action === 'string' ? this.getAction(action) : action;
    if (!cRole || !cAction) return false;
    return cRole.can(cAction);
  }

  /**
   * Check for user permission based on permission strategies.
   * @param {string} strategy
   * @param {Role | string} currentRole
   * @param {Role | string} targetRole
   * @param {any} options
   */
  permitByStrategy(strategy, currentRole, targetRole, options) {
    const cRole = typeof currentRole === 'string' ? currentRole : currentRole.descriptor;
    const tRole = typeof targetRole === 'string' ? targetRole : targetRole.descriptor;
    return this.permissionStrategies.getStrategy(strategy)(cRole, tRole, options);
  }
}

module.exports = RbacController;
