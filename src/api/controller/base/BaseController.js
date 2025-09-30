module.exports = class BaseController {
  constructor(name, version = "v1") {
    this.name = name;
    this.version = version;
  }

  getBasePath() {
    return `/api/${this.version}/${this.name}`;
  }

  getRoutes() {
    return [];
  }
}