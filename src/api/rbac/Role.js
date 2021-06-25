const Action = require('./Action');
const Tree = require('../classes/Tree');

class Role extends Tree {
  /**
   * @param {string} [id]
   * @param {string} descriptor
   * @param {string} name
   * @param {Role} [inherits]
   * @param {Action[]} [actions]
   */
  constructor(id, descriptor, name, inherits = [], actions = []) {
    super(inherits);

    /** @type {string | null} */
    this.id = id ?? null;
    /** @type {string} */
    this.descriptor = descriptor;
    /** @type {string} */
    this.name = name;
    /** @type {Role[]} @readonly */
    this.inherits = inherits;
    /** @type {Action[]} */
    this.actions = actions;
  }

  get Synchronized() {
    return this.id !== null;
  }

  synchronize({ id }) {
    this.id = id;
  }

  /**
   * Find and return provided role in the tree
   * @param {Role | string} role
   * @returns {Role | null}
   */
  find(role) {
    const descriptor = typeof role === 'string' ? role : role.descriptor;
    if (this.descriptor === descriptor) return this;
    return this.inherits.find((r) => r.find(descriptor)) ?? null;
  }

  /**
   * If current role contains provided role in the tree (without current)
   * @param {Role | string} role
   * @returns {boolean}
   */
  contain(role) {
    const descriptor = typeof role === 'string' ? role : role.descriptor;
    if (this.descriptor === descriptor) return false;
    return !!this.find(role);
  }

  /**
   * If current role equals or contains provided role in the tree (with current)
   * @param {Role | string} role
   * @returns {boolean}
   */
  include(role) {
    return !!this.find(role);
  }

  getAllActions() {
    const actions = new Set();
    this.actions.forEach((a) => actions.add(a));
    this.inherits.forEach((r) => {
      r.getAllActions().forEach((a) => actions.add(a));
    });
    return [...actions.values()];
  }

  /**
   * Does current role have particular action
   * @param {Action | string} action
   * @returns {boolean}
   */
  hasAction(action) {
    const actionName = typeof role === 'string' ? action : action.name;
    return !!this.actions.find((a) => a.name === actionName);
  }

  /**
   * Check if role has permissions for particular action
   * @param {Action | string} action
   * @returns {boolean}
   */
  can(action) {
    const ownAction = this.hasAction(action);
    if (ownAction) return true;
    return !!this.inherits.find((r) => r.can(action));
  }

  /**
   * Allies to `can` method
   * @param {Action | string} action
   * @returns {boolean}
   */
  hasPrivilege(action) {
    return this.can(action);
  }
}

module.exports = Role;
