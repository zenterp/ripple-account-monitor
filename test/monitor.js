var RippleAccountMonitor = require('../src/ripple_account_monitor.js');

describe('Ripple Account Monitor', function() {

  before(function() {
    monitor = new RippleAccountMonitor({
      rippleRestUrl: 'http://127.0.0.1:5990',
      account: 'r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk',
      onTransaction: function(transaction, next) {
        console.log('new transaction', transaction);
        next();
      }
    });
  });

  it('should get transactions made to a ripple address', function(done) {
    monitor.start();
  });

  describe('optionally accepting a starting hash', function() {
    beforeEach(function() {
      monitor = new RippleAccountMonitor({
        rippleRestUrl: 'http://127.0.0.1:5990',
        account: 'r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk',
        startHash: 'EF5D38031A961C32D4170A1E7A888D57F553D36F40796C94D27C2497F6722E62',
        onTransaction: function(transaction, next) {
          console.log('new transaction', transaction);
          next();
        }
      });
    });

    it('should get transactions after the start hash', function(done) {
      monitor.start();
    });

    it('should be able to stop monitoring', function(done) {
      var i = 1;
      monitor.onTransaction = function(transaction, next) {
        if (i > 3) {
          monitor.stop();
          console.log('stopped');
          done();
        } else {
          i += 1;
          console.log('new transaction', i, transaction);
          next();
        }
      }
      monitor.start();
    });
  });
});

