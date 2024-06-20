// References:
// - https://learnmeabitcoin.com/technical/keys/hd-wallets/derivation-paths/
// - https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/test/integration/addresses.spec.ts
// - https://www.npmjs.com/package/bip39

const bip32 = require('bip32')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')
const qrcode = require('qrcode-terminal')

const words = process.argv.slice(2)

const mnemonic = words.length ? words.slice(0, 12).join(' ') : bip39.generateMnemonic()

const passphrase = words.length ? words.slice(12, 1).toString() : ''

const seed = bip39.mnemonicToSeedSync(mnemonic, passphrase)

const root = bip32.fromSeed(seed)

// P2PKH (Legacy)
const wallet1 = bitcoin.payments.p2pkh({
  pubkey: root.derivePath(`m/44'/0'/0'/0/0`).publicKey
})

// P2SH (SegWit compatible)
const wallet2 = bitcoin.payments.p2sh({ redeem: bitcoin.payments.p2wpkh({ 
  pubkey: root.derivePath(`m/49'/0'/0'/0/0`).publicKey
})})

// Bech32 (SegWit native)
const wallet3 = bitcoin.payments.p2wpkh({ 
  pubkey: root.derivePath(`m/84'/0'/0'/0/0`).publicKey
})

const secret = root.derivePath(`m/84'/0'/0'/0/0`).toWIF() // TODO: 1-of-3

qrcode.generate(secret, {small: false}, function (qrcode) {
    console.log(qrcode)
    console.log(`
    BTC:
    - Address  : ${wallet1.address}
               : ${wallet2.address}
               : ${wallet3.address}
    - WIF      : ${secret}
    - Mnemonic : ${mnemonic}
    `)
})
