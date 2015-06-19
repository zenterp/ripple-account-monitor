'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _rippleRestClient = require('ripple-rest-client');

var _rippleRestClient2 = _interopRequireDefault(_rippleRestClient);

var _errorsArgument_error = require('./errors/argument_error');

var _errorsArgument_error2 = _interopRequireDefault(_errorsArgument_error);

var RippleAccountMonitor = (function () {
  function RippleAccountMonitor(options) {
    _classCallCheck(this, RippleAccountMonitor);

    if (!options) {
      throw new _errorsArgument_error2['default']('options must be an object');
    }

    var rippleRestUrl = options.rippleRestUrl;
    var account = options.account;
    var lastHash = options.lastHash;
    var timeout = options.timeout;

    if (!rippleRestUrl) {
      throw new _errorsArgument_error2['default']('options.rippleRestUrl must be a url');
    }

    if (!account) {
      throw new _errorsArgument_error2['default']('options.account must be a ripple Account');
    }

    this.rippleRestClient = new _rippleRestClient2['default']({
      api: rippleRestUrl,
      account: account,
      secret: ''
    });

    this.lastHash = lastHash;
    this.timeout = timeout || 5000;
    this.stopped = true;
  }

  _createClass(RippleAccountMonitor, [{
    key: 'onError',
    value: function onError() {
      console.log('RippleAccountMonitor::Error', error);
      console.log('RippleAccountMonitor::Error', error.message);
      console.log('RippleAccountMonitor::Error', error.stack);
    }
  }, {
    key: 'start',
    value: function start() {
      this.stopped = false;
      if (this.lastHash) {
        this._processNextTransaction();
      } else {
        console.error('no transaction specified');
        process.exit(1);
      }
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.stopped = true;
    }
  }, {
    key: '_loop',
    value: function _loop(timeout) {
      if (this.stopped) {
        return;
      }

      var process = this._processNextTransaction.bind(this);
      if (timeout) {
        setTimeout(process, timeout);
      } else {
        setImmediate(process);
      }
    }
  }, {
    key: '_getNotificationAsync',
    value: function _getNotificationAsync(hash) {
      if (!hash) {
        throw new Error('no hash');
      }
      if (!this.__getNotificationAsync) {
        this.__getNotificationAsync = promisify(this.rippleRestClient.getNotification.bind(this.rippleRestClient));
      }

      return this.__getNotificationAsync(hash);
    }
  }, {
    key: '_getTransactionAsync',
    value: function _getTransactionAsync(hash) {
      if (!hash) {
        throw new Error('no hash');
      }
      if (!this.__getTransactionAsync) {
        this.__getTransactionAsync = promisify(this.rippleRestClient.getTransaction.bind(this.rippleRestClient));
      }

      return this.__getTransactionAsync(hash);
    }
  }, {
    key: '_getNextTransaction',
    value: function _getNextTransaction() {
      var notification, response;
      return regeneratorRuntime.async(function _getNextTransaction$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return regeneratorRuntime.awrap(this._getNotificationAsync(this.lastHash));

          case 2:
            notification = context$2$0.sent;

            if (notification) {
              context$2$0.next = 5;
              break;
            }

            throw new Error('no notification');

          case 5:
            if (!notification.next_notification_hash) {
              context$2$0.next = 14;
              break;
            }

            context$2$0.next = 8;
            return regeneratorRuntime.awrap(this._getTransactionAsync(notification.next_notification_hash));

          case 8:
            response = context$2$0.sent;

            if (response.transaction) {
              context$2$0.next = 11;
              break;
            }

            throw new Error('no transaction');

          case 11:
            return context$2$0.abrupt('return', response.transaction);

          case 14:
            return context$2$0.abrupt('return');

          case 15:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: '_processNextTransaction',
    value: function _processNextTransaction() {
      var transaction, hook, result;
      return regeneratorRuntime.async(function _processNextTransaction$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.prev = 0;
            context$2$0.next = 3;
            return regeneratorRuntime.awrap(this._getNextTransaction());

          case 3:
            transaction = context$2$0.sent;

            if (!transaction) {
              context$2$0.next = 27;
              break;
            }

            hook = undefined;
            context$2$0.t0 = transaction.TransactionType;
            context$2$0.next = context$2$0.t0 === 'Payment' ? 9 : context$2$0.t0 === 'TrustSet' ? 11 : context$2$0.t0 === 'AccountSet' ? 13 : context$2$0.t0 === 'OfferCreate' ? 15 : context$2$0.t0 === 'OfferCancel' ? 17 : context$2$0.t0 === 'SetRegularKey' ? 19 : 21;
            break;

          case 9:
            if (typeof this.onPayment === 'function') {
              hook = this.onPayment;
            }
            return context$2$0.abrupt('break', 22);

          case 11:
            if (typeof this.onTrustSet === 'function') {
              hook = this.onTrustSet;
            }
            return context$2$0.abrupt('break', 22);

          case 13:
            if (typeof this.onAccountSet === 'function') {
              hook = this.onAccountSet;
            }
            return context$2$0.abrupt('break', 22);

          case 15:
            if (typeof this.onOfferCreate === 'function') {
              hook = this.onOfferCreate;
            }
            return context$2$0.abrupt('break', 22);

          case 17:
            if (typeof this.onOfferCancel === 'function') {
              hook = this.onOfferCancel;
            }
            return context$2$0.abrupt('break', 22);

          case 19:
            if (typeof this.onSetRegularKey === 'function') {
              hook = this.onSetRegularKey;
            }
            return context$2$0.abrupt('break', 22);

          case 21:
            hook = this.onTransaction;

          case 22:
            result = hook.call(this, transaction);

            if (!(result instanceof Promise)) {
              context$2$0.next = 26;
              break;
            }

            context$2$0.next = 26;
            return regeneratorRuntime.awrap(result);

          case 26:
            // else hook was not asynchronous, can continue

            this.lastHash = transaction.hash;

          case 27:
            context$2$0.next = 32;
            break;

          case 29:
            context$2$0.prev = 29;
            context$2$0.t1 = context$2$0['catch'](0);

            this.onError(context$2$0.t1);

          case 32:

            this._loop(this.timeout);

          case 33:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[0, 29]]);
    }
  }]);

  return RippleAccountMonitor;
})();

exports['default'] = RippleAccountMonitor;

// helper function, see bluebird.promisify
// does not bind context, do this yourself
function promisify(boundMethod) {
  return function (param) {
    return new Promise(function (resolve, reject) {
      boundMethod(param, function (error, result) {
        error ? reject(error) : resolve(result);
      });
    });
  };
}
module.exports = exports['default'];
// get the most recent hash, then:
// _this._processNextTransaction();

// this return is "caught" on line 142

// if not transaction, loop until there is one

// if hook asynchronous, wait for completion