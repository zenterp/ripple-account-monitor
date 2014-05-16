var nconf = require("nconf");

nconf
  .file({ file: __dirname+'/config.json' })
  .env();

nconf.defaults({
  timeout: 1000,
  socket: "tcp://127.0.0.1:4321",
  account: "rsBxWbcdV8KwjzjFSCMUKue3pLJexaMF13",
  lastTransactionHash: "1229A2A54E3BFDE81D9F7983CB7863BB1C684D7B13E938836C19592D0D1F8CBB",
  rippleRestServerUrl: "http://localhost:5990/"
});

module.exports = nconf;