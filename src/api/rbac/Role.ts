import { Tree } from '@/core/models/Tree';
import { Action } from './Action';

type TSynchronizePayload = { id: string } | string;

export class Role extends Tree {
  constructor(
    private id: string | null | undefined,
    public readonly descriptor: string,
    public readonly name: string,
    public readonly inherits: Role[] = [],
    public readonly actions: Action[] = []
  ) {
    super(inherits);
  }

  get Synchronized() {
    return this.id !== null;
  }

  synchronize(id: TSynchronizePayload) {
    if (id instanceof Object) this.id = id.id;
    else this.id = id;
  }

  find(role: Role | string): Role | null {
    const descriptor = typeof role === 'string' ? role : role.descriptor;
    if (this.descriptor === descriptor) return this;
    return this.inherits.find((r) => r.find(descriptor)) ?? null;
  }

  contain(role: Role | string) {
    const descriptor = typeof role === 'string' ? role : role.descriptor;
    if (this.descriptor === descriptor) return false;
    return !!this.find(role);
  }

  include(role: Role | string) {
    return !!this.find(role);
  }

  getAllActions() {
    const actions = new Set<Action>();
    this.actions.forEach((a) => actions.add(a));
    this.inherits.forEach((r) => {
      r.getAllActions().forEach((a) => actions.add(a));
    });
    return [...actions.values()];
  }

  hasAction(action: Action | string) {
    const actionName = typeof action === 'string' ? action : action.name;
    return !!this.actions.find((a) => a.name === actionName);
  }

  can(action: Action | string): boolean {
    const ownAction = this.hasAction(action);
    if (ownAction) return true;
    return !!this.inherits.find((r) => r.can(action));
  }

  hasPrivilege(action: Action | string) {
    return this.can(action);
  }
}
