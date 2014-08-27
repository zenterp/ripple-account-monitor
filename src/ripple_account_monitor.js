const RippleRestClient = require('ripple-rest-client');

function RippleAccountMonitor(options) {
  console.log('OPTIONS', options);
  this.rippleRestClient = new RippleRestClient({
    api: options.rippleRestUrl,
    account: options.account,
    secret: ''
  });
  this.lastHash = options.lastHash;
  this.timeout = options.timeout || 5000;
}

RippleAccountMonitor.prototype = {

  start: function(onTransaction) {
    var _this = this;
    if (_this.lastHash) {
      _this._processNextTransaction();
    } else {
      // get the most recent hash, then:
      // _this._processNextTransaction();
    }
  },

  stop: function() {
  },
  
  _loop: function(timeout) {
    var _this = this;
    if (timeout) {
      setTimeout(_this._processNextTransaction.bind(_this), timeout);
    } else {
      setImmediate(_this._processNextTransaction.bind(_this));
    }   
  },

  _getNextTransaction: function(callback) {
    var _this = this;
    _this.rippleRestClient.getNotification(_this.lastHash, function(error, notification) {
      if (error || !notification) {
        return callback(error);
      }
      _this.rippleRestClient.getNotification(_this.lastHash, function(error, notification) {
        if (error || !notification) {
          return callback(error);
        }
        if (notification.next_notification_hash) {
          console.log(notification.next_notification_hash);
          return _this.rippleRestClient.getTransaction(notification.next_notification_hash, function(error, transaction) {
            console.log('got transaction error!', error);
            console.log('got transaction!', transaction);
            callback(error, transaction);
          });
        } else {
          return callback();
        }
      });
    });
  },
  
  _processNextTransaction: function() {
    console.log('_processNextTransaction');
    var _this = this;
    _this._getNextTransaction(function(error, transaction) {
      if (error || !transaction) {
        return _this._loop(_this.timeout);
      } 
      self.onTransaction(transaction, self._loop.bind(self));
    }.bind(_this));
  }
}

module.exports = RippleAccountMonitor;

