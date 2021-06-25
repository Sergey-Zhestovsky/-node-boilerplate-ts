const Action = require('./Action');
const Role = require('./Role');

const logger = require('../../libs/Logger');

class RbacConstructor {
  /**
   * @typedef {Object} RoleSchema
   *   @property {string} descriptor
   *   @property {string} name
   *   @property {string[] | null} inherits
   *   @property {string[]} actions
   *
   * @param {Object<string, RoleSchema>} roleSchemasObj
   */
  constructor(roleSchemasObj) {
    this.roleSchemasObj = roleSchemasObj;
  }

  /**
   * @private
   * @param {string[]} stringList
   * @param {Map<string, Action>} actionMap
   * @returns {Action[]}
   */
  getActionsByStringList(stringList, actionMap) {
    return stringList.map((a) => actionMap.get(a)).filter((v) => v);
  }

  /**
   * @private
   * @param {RoleSchema[]} roleSchemas
   * @returns {{ rolesGraph: Map<RoleSchema, RoleSchema[]>, actions: Map<string, Action> }}
   */
  getRoleGraphWithActionsFromRoles(roleSchemas) {
    /** @type {Map<RoleSchema, RoleSchema[]>} */
    const rolesGraph = new Map();
    /** @type {Map<string, Action>} */
    const actions = new Map();

    roleSchemas.forEach((roleSchema) => {
      if (rolesGraph.has(roleSchema)) return;

      roleSchema.actions.forEach((action) => {
        if (!actions.has(action)) actions.set(action, new Action(null, action));
      });

      const inheritance = roleSchema.inherits
        ?.map((descriptor) => roleSchemas.find((r) => r.descriptor === descriptor) ?? null)
        .filter((v) => v !== null);

      rolesGraph.set(roleSchema, inheritance ?? []);
    });

    return { rolesGraph, actions };
  }

  /**
   * For now only one root
   * @private
   * @param {Map<RoleSchema, RoleSchema[]>} rolesGraph
   * @param {RoleSchema[]} roleSchemas
   * @returns {RoleSchema}
   * @throws {Error}
   */
  extractRootElement(rolesGraph, roleSchemas) {
    let tempForRoot = [...roleSchemas];

    rolesGraph.forEach((val) => {
      tempForRoot = tempForRoot.filter((tRoom) => !val.includes(tRoom));
    });

    if (tempForRoot.length > 1) throw new Error('Role tree cannot be with more than one root');
    if (tempForRoot.length === 0) throw new Error('Role tree should have one root');
    return tempForRoot[0];
  }

  /**
   * @private
   * @param {RoleSchema[]} roleSchemas
   * @param {Map<RoleSchema, RoleSchema[]>} rolesGraph
   * @param {Map<string, Action>} actionMap
   * @param {RoleSchema} startRole
   * @returns {{ rootRole: Role, rolesMap: Map<string, Role> }}
   * @throws {Error}
   */
  createRoleTreeFromGraph(roleSchemas, rolesGraph, actionMap, startRole) {
    /** @type {Map<string, Role>} */
    const rolesMap = new Map();

    /**
     * @param {RoleSchema} role
     * @param {string[]} metNodes
     * @param {string[]} [unstackArray]
     * @returns {Role}
     */
    const walkToBuildRoles = (role, metNodes, unstackArray = []) => {
      if (metNodes.includes(role.descriptor)) {
        throw new Error(`Role tree cannot be recursive, element: '${role.descriptor}' found twice`);
      }

      metNodes.push(role.descriptor);
      unstackArray.push(role.descriptor);
      const inheritance = rolesGraph.get(role);
      let inherits = [];

      if (inheritance.length) {
        inherits = inheritance
          .map((roleSchema) => {
            if (rolesMap.has(roleSchema.descriptor)) return null;
            return walkToBuildRoles(roleSchema, metNodes, unstackArray);
          })
          .filter((v) => v !== null);
      }

      const index = unstackArray.indexOf(role.descriptor);
      unstackArray.splice(index, 1);
      const res = new Role(
        null,
        role.descriptor,
        role.name,
        inherits,
        this.getActionsByStringList(role.actions, actionMap)
      );
      rolesMap.set(res.descriptor, res);

      return res;
    };

    const metNodes = [];
    const rootRole = walkToBuildRoles(startRole, metNodes);

    if (metNodes.length !== roleSchemas.length) {
      logger.warn(
        `Looks like role tree has unresolved nodes. Resolved: ${
          metNodes.length
        }, unresolved: ${Math.abs(metNodes.length - roleSchemas.length)}`
      );
    }

    return { rootRole, rolesMap };
  }

  /**
   * @returns {{
   *   rootRole: Role,
   *   roles: Role[],
   *   actions: Action[],
   * }}
   * @throws
   */
  buildRoleTree() {
    const roleSchemas = Object.values(this.roleSchemasObj);

    const { rolesGraph, actions } = this.getRoleGraphWithActionsFromRoles(roleSchemas);
    const schemaRoot = this.extractRootElement(rolesGraph, roleSchemas);
    const { rootRole, rolesMap } = this.createRoleTreeFromGraph(
      roleSchemas,
      rolesGraph,
      actions,
      schemaRoot
    );

    return {
      rootRole: rootRole,
      roles: [...rolesMap.values()],
      actions: [...actions.values()],
    };
  }
}

module.exports = RbacConstructor;
