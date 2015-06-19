import RippleRestClient from 'ripple-rest-client'
import ArgumentError from './errors/argument_error'

export default class RippleAccountMonitor {

  constructor(options) {
    if (!options) {
      throw new ArgumentError('options must be an object');
    }

    const {
      rippleRestUrl,
      account,
      lastHash,
      timeout
    } = options

    if (!rippleRestUrl) {
      throw new ArgumentError('options.rippleRestUrl must be a url');
    }

    if (!account) {
      throw new ArgumentError('options.account must be a ripple Account');
    }

    this.rippleRestClient = new RippleRestClient({
      api: rippleRestUrl,
      account: account,
      secret: ''
    })

    this.lastHash = lastHash
    this.timeout = timeout || 5000
    this.stopped = true
  }

  onError() {
    console.log('RippleAccountMonitor::Error', error);
    console.log('RippleAccountMonitor::Error', error.message);
    console.log('RippleAccountMonitor::Error', error.stack);
  }

  start() {
    this.stopped = false
    if (this.lastHash) {
      this._processNextTransaction();
    } else {
      console.error('no transaction specified')
      process.exit(1)
      // get the most recent hash, then:
      // _this._processNextTransaction();
    }
  }

  stop() {
    this.stopped = true
  }

  _loop(timeout) {
    if (this.stopped) {
      return
    }

    let process = this._processNextTransaction.bind(this)
    if (timeout) {
      setTimeout(process, timeout);
    } else {
      setImmediate(process);
    }   
  }

  _getNotificationAsync(hash) {
    if (!hash) {
      throw new Error('no hash')
    }
    if (!this.__getNotificationAsync) {
      this.__getNotificationAsync = promisify(this.rippleRestClient.getNotification.bind(this.rippleRestClient))
    }

    return this.__getNotificationAsync(hash)
  }

  _getTransactionAsync(hash) {
    if (!hash) {
      throw new Error('no hash')
    }
    if (!this.__getTransactionAsync) {
      this.__getTransactionAsync = promisify(this.rippleRestClient.getTransaction.bind(this.rippleRestClient))
    }

    return this.__getTransactionAsync(hash)
  }

  async _getNextTransaction() {
    const notification = await this._getNotificationAsync(this.lastHash)
    if (!notification) {
      throw new Error('no notification')
    }

    if (notification.next_notification_hash) {
      const response = await this._getTransactionAsync(notification.next_notification_hash)

      if (!response.transaction) {
        throw new Error('no transaction')
      }

      return response.transaction
    }

    else {
      // this return is "caught" on line 142
      return
    }
  }

  async _processNextTransaction() {
    try {
      const transaction = await this._getNextTransaction() 

      // if not transaction, loop until there is one
      if (transaction) {

        let hook
        switch (transaction.TransactionType) {
        case 'Payment':
          if (typeof this.onPayment === 'function') { hook = this.onPayment }
          break;
        case 'TrustSet':
          if (typeof this.onTrustSet === 'function') { hook = this.onTrustSet }
          break;
        case 'AccountSet':
          if (typeof this.onAccountSet === 'function') { hook = this.onAccountSet }
          break;
        case 'OfferCreate':
          if (typeof this.onOfferCreate === 'function') { hook = this.onOfferCreate }
          break;
        case 'OfferCancel':
          if (typeof this.onOfferCancel === 'function') { hook = this.onOfferCancel }
          break;
        case 'SetRegularKey':
          if (typeof this.onSetRegularKey === 'function') { hook = this.onSetRegularKey }
          break;
        default:
          hook = this.onTransaction
        }

        const result = hook.call(this, transaction)
          
        // if hook asynchronous, wait for completion
        if (result instanceof Promise) {
          await result
        }
        // else hook was not asynchronous, can continue

        this.lastHash = transaction.hash

      }
    }
    catch (error) {
      this.onError(error)
    }

    this._loop(this.timeout)
  }
}

// helper function, see bluebird.promisify
// does not bind context, do this yourself
function promisify(boundMethod) {
  return function(param) {
    return new Promise((resolve, reject) => {
      boundMethod(param, (error, result) => {
        error? reject(error) : resolve(result)
      })
    })
  }
}

