## Ripple Account Monitor

Use the Ripple Account Monitor to recieve
notifications about a particular ripple account
as they come in, beginning at a point
specified by you in the configuration.

The Account Monitor binds to a local tcp socket
and using ZeroMQ sends notifications to a client
process for handling. It obtains notifications
by polling the account notifications endpoint of
a Ripple REST server specified in the configuration.

When the client disconnects from the ZeroMQ socket
the Account Monitor halts its operation. Upon
reconnection of the client the Account Monitor
resumes polling Ripple REST.

