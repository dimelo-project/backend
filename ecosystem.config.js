module.exports = [
  {
    script: 'dist/main.js',
    name: 'nest-app',
    exec_mode: 'cluster',
    instances: 2,
  },
];
