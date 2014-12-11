const RippleAccountMonitor = require('../src/ripple_account_monitor.js');

const monitor = new RippleAccountMonitor({
  rippleRestUrl: 'https://api.ripple.com/',
  account: 'r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk',
  lastHash: 'EF5D38031A961C32D4170A1E7A888D57F553D36F40796C94D27C2497F6722E62',
  timeout: 1000,
  onTransaction: function(transaction, next) {
    console.log('new transaction', transaction.TransactionType);
    next();
  },
  onPayment: function(transaction, next) {
    console.log('new payment', transaction.hash);
    next();
  },
  onTrustSet: function(transaction, next) {
    console.log('new trust set', transaction.hash);
    next();
  },
  onAccountSet: function(transaction, next) {
    console.log('new account setting', transaction.hash);
    next();
  },
  onOfferCreate: function(transaction, next) {
    console.log('new offer created', transaction.hash);
    next();
  },
  onOfferCancel: function(transaction, next) {
    console.log('offer cancelled', transaction.hash);
    next();
  },
  onSetRegularKey: function(transaction, next) {
    console.log('regular key set', transaction.hash);
    next();
  },
  onError: function(error) {
    console.log('RippleAccountMonitor::Error', error);
  }
});

monitor.start();

