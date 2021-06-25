class Tree {
  /**
   * @param {Tree[]} [nodes]
   */
  constructor(nodes) {
    /** @protected */
    this.nodes = nodes ?? [];
  }

  preOrderWalk(callback) {
    callback(this);
    this.nodes.forEach((node) => node.preOrderWalk(callback));
  }

  postOrderWalk(callback) {
    this.nodes.forEach((node) => node.postOrderWalk(callback));
    callback(this);
  }
}

module.exports = Tree;
