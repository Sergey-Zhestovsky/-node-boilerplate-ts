class Action {
  /**
   * @param {string} [id]
   * @param {string} name
   */
  constructor(id, name) {
    /** @type {string | null} */
    this.id = id ?? null;
    /** @type {string} */
    this.name = name;
  }

  get Synchronized() {
    return this.id !== null;
  }

  synchronize({ id }) {
    this.id = id;
  }
}

module.exports = Action;
