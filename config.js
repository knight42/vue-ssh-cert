var path = require('path')

module.exports = {
  PASSPHRASE: process.env['PASSPHRASE'] || 'qwer1234',
  PRIKEY: process.env['CAPATH'] || path.resolve(__dirname, 'ssh_ca', 'ca')
}
