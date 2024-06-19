// References:
// - https://learnmeabitcoin.com/technical/keys/hd-wallets/derivation-paths/
// - https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/test/integration/addresses.spec.ts
const bip32 = require('bip32')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')
const qrcode = require('qrcode-terminal')

const mnemonic = bip39.generateMnemonic()

const seed = bip39.mnemonicToSeedSync(mnemonic)

const root = bip32.fromSeed(seed)

// P2PKH (Legacy) - m/44'/0'/0'/0/0
const wallet1 = bitcoin.payments.p2pkh({
  pubkey: root.derivePath(`m/44'/0'/0'/0/0`).publicKey
})

// P2SH (SegWit compatible) - m/49'/0'/0'/0/0
const wallet2 = bitcoin.payments.p2sh({ redeem: bitcoin.payments.p2wpkh({ 
  pubkey: root.derivePath(`m/49'/0'/0'/0/0`).publicKey
})})

// Bech32 (SegWit native) - m/84'/0'/0'/0/0
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
