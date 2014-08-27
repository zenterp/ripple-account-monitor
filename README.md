# Ripple Account Monitor

## INSTALLATION

    npm install --save ripple-account-monitor

## USAGE

    const RippleAccountMonitor = require('ripple-account-monitor');

    monitor = new RippleAccountMonitor({
      rippleRestUrl: 'http://127.0.0.1:5990',
      account: 'r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk',
      onTransaction: function(transaction, next) {
        console.log('new transaction', transaction);
        next();
      }   
    });


The above will listen forever to the ripple account and call the function `onTransaction` whenever there is a new transaction to process.

