export class Tree {
  protected readonly nodes: Tree[];

  constructor(nodes?: Tree[]) {
    this.nodes = nodes ?? [];
  }

  preOrderWalk<T extends this = this>(callback: (node: T) => void) {
    callback(this as T);

    for (const node of this.nodes) {
      node.preOrderWalk(callback);
    }
  }

  postOrderWalk<T extends this = this>(callback: (node: T) => void) {
    for (const node of this.nodes) {
      node.postOrderWalk(callback);
    }

    callback(this as T);
  }
}
