import { logger } from '@/libs/Logger';
import { Action } from './Action';
import { Role } from './Role';

import { IRoleSchema } from './types';

interface IConstructedTree {
  rootRole: Role;
  roles: Role[];
  actions: Action[];
}

export class RbacConstructor {
  private readonly roleSchemasObj: Record<string, IRoleSchema>;

  constructor(roleSchemasObj: Record<string, IRoleSchema>) {
    this.roleSchemasObj = roleSchemasObj;
  }

  private getActionsByStringList(stringList: string[], actionMap: Map<string, Action>): Action[] {
    return stringList.map((a) => actionMap.get(a)).filter((v) => v) as Action[];
  }

  private getRoleGraphWithActionsFromRoles(roleSchemas: IRoleSchema[]) {
    const rolesGraph = new Map<IRoleSchema, IRoleSchema[]>();
    const actions = new Map<string, Action>();

    roleSchemas.forEach((roleSchema) => {
      if (rolesGraph.has(roleSchema)) return;

      roleSchema.actions.forEach((action) => {
        if (!actions.has(action)) actions.set(action, new Action(null, action));
      });

      const inheritance = roleSchema.inherits
        ?.map((descriptor) => roleSchemas.find((r) => r.descriptor === descriptor) ?? null)
        .filter<IRoleSchema>((v): v is IRoleSchema => v !== null);

      rolesGraph.set(roleSchema, inheritance ?? []);
    });

    return { rolesGraph, actions };
  }

  /**
   * For now only one root
   * @throws {Error}
   */
  private extractRootElement(
    rolesGraph: Map<IRoleSchema, IRoleSchema[]>,
    roleSchemas: IRoleSchema[]
  ) {
    let tempForRoot = [...roleSchemas];

    rolesGraph.forEach((val) => {
      tempForRoot = tempForRoot.filter((tRoom) => !val.includes(tRoom));
    });

    if (tempForRoot.length > 1) throw new Error('Role tree cannot be with more than one root');
    if (tempForRoot.length === 0) throw new Error('Role tree should have one root');
    return tempForRoot[0];
  }

  /**
   * @throws {Error}
   */
  private createRoleTreeFromGraph(
    roleSchemas: IRoleSchema[],
    rolesGraph: Map<IRoleSchema, IRoleSchema[]>,
    actionMap: Map<string, Action>,
    startRole: IRoleSchema
  ) {
    const rolesMap = new Map<string, Role>();

    const walkToBuildRoles = (
      role: IRoleSchema,
      metNodes: string[],
      unstackArray: string[] = []
    ) => {
      if (metNodes.includes(role.descriptor)) {
        throw new Error(`Role tree cannot be recursive, element: '${role.descriptor}' found twice`);
      }

      metNodes.push(role.descriptor);
      unstackArray.push(role.descriptor);
      const inheritance = rolesGraph.get(role);
      let inherits: Role[] = [];

      if (inheritance?.length) {
        inherits = inheritance
          .map((roleSchema) => {
            if (rolesMap.has(roleSchema.descriptor)) return null;
            return walkToBuildRoles(roleSchema, metNodes, unstackArray);
          })
          .filter<Role>((v): v is Role => v !== null);
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

    const metNodes: string[] = [];
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
   * @throws
   */
  buildRoleTree(): IConstructedTree {
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
