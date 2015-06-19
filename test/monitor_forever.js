import RippleAccountMonitor from '../src/ripple_account_monitor'

class Monitor extends RippleAccountMonitor {
  onTransaction({TransactionType}, next) {
    console.log('new transaction', TransactionType)
  }

  onPayment({hash}) {
    console.log('new payment', hash)
  }

  onTrustSet({hash}) {
    console.log('new trust set', hash)
  }
  
  onAccountSet({hash}) {
    console.log('new account setting', transaction.hash)
  }

  onOfferCreate(transaction, next) {
    console.log('new offer created', transaction.hash)
    next()
  }

  onOfferCancel(transaction, next) {
    console.log('offer cancelled', transaction.hash)
    next()
  }

  onSetRegularKey(transaction, next) {
    console.log('regular key set', transaction.hash)
    next()
  }

  onError(error) {
    console.log('RippleAccountMonitor::Error', error,
                'RippleAccountMonitor::Error', error.message,
                'RippleAccountMonitor::Error', error.stack)
  }
}

const monitor = new Monitor({
  rippleRestUrl: 'http://127.0.0.1:5990/',
  account: 'r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk',
  lastHash: '07814E2CAF5677F4D513F1C49849F5974CCD9AFD725F65DEC30FB130CD59A3A9',
  timeout: 1000
})

monitor.start();

