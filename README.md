# Ripple Account Monitor

## INSTALLATION

    npm install --save ripple-account-monitor

## USAGE

    const RippleAccountMonitor = require('ripple-account-monitor');

    const monitor = new RippleAccountMonitor({
      rippleRestUrl: 'http://127.0.0.1:5990',
      account: 'r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk',
      lastHash: 'EF5D38031A961C32D4170A1E7A888D57F553D36F40796C94D27C2497F6722E62',
      onTransaction: function(transaction, next) {
        console.log('new transaction', transaction);
        next();
      },
      onError: function(error) {
        console.log('RippleAccountMonitor::Error', error);
      }
    });

    monitor.start();


The above will listen forever to the ripple account and call the function `onTransaction` whenever there is a new transaction to process.

