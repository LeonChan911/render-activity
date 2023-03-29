class Repository {
  constructor() {
    this.modules = {};
  }

  add(name, module) {
    this.modules[name] = module;
  }

  get(name) {
    return this.modules[name] ?? null;
  }
}

export const repo = new Repository();

export function initializeRepo() {
  const modules = require('./module');

  Object.keys(modules).forEach(key => {
    repo.add(key, modules[key]);
  });
}
