const RippleRestClient = require('ripple-rest-client');

function RippleAccountMonitor(options) {
  this.rippleRestClient = new RippleRestClient({
    api: options.rippleRestUrl,
    account: options.account,
    secret: ''
  });
  this.timeout = options.timeout || 5000;
}

RippleAccountMonitor.prototype = {

  start: function(onTransaction) {
    var _this = this;
    _this._processNextTransaction();
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
    _this.rippleRestClient.getNotification(hash, function(error, notification) {
      if (error || !notification) {
        return callback(error);
      }
      _this.rippleRestClient.getNotification(hash, function(error, notification) {
        if (error || !notification) {
          return callback(error);
        }
        if (notification.next_notification_hash) {
          return _this.rippleRestClient.getPayment(notification.next_notification_hash, callback);
        } else {
          return callback();
        }
      });
    });
  },
  
  _processNextTransaction: function() {
    var _this = this;
    _this._getNextTransaction(function(error, transaction) {
      if (error || !transaction) {
        return _this._loop(_this._timeout);
      } 
      self.onTransaction(transaction, self._loop.bind(self));
    }).bind(_this);
  }
}

module.exports = RippleAccountMonitor;

