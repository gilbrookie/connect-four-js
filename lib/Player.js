class Player {
  constructor(name, tileBuilder) {
    this.name = name;
    this.tileBuilder = tileBuilder;
  }

  getTile(opts) {
    return this.tileBuilder.build(opts);
  }
}

export default { Player };