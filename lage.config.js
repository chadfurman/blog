module.exports = {
  pipeline: {
    build: {
      dependsOn: ["^build"],
    },
    dev: {
      cache: false,
    },
    lint: {},
  },
  npmClient: "npm",
  packages: ["frontend", "backend"],
};
