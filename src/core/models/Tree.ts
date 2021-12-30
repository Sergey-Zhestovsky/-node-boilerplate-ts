export class Tree {
  protected readonly nodes: Tree[];

  constructor(nodes?: Tree[]) {
    this.nodes = nodes ?? [];
  }

  preOrderWalk<T extends this = this>(callback: (node: T) => void) {
    callback(this as T);
    this.nodes.forEach((node) => node.preOrderWalk(callback));
  }

  postOrderWalk<T extends this = this>(callback: (node: T) => void) {
    this.nodes.forEach((node) => node.postOrderWalk(callback));
    callback(this as T);
  }
}
