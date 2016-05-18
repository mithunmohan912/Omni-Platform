exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['SearchVerifyAsiaQuote.js'],
  capabilities: {'browserName' : 'chrome'},
  jasmineNodeOpts: {defaultTimeoutInterval: 300000},
  allScriptsTimeout: 400000,
};