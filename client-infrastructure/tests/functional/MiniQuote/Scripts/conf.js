exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['SearchHomeOwnerEU.js'],
  capabilities: {'browserName' : 'chrome'},
  jasmineNodeOpts: {defaultTimeoutInterval: 300000},
  allScriptsTimeout: 400000,
};