//Import dependencies
const bip32 = require('bip32')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')
const qrcode = require('qrcode-terminal')

//Derivation path
const path = `m/44'/0'/0'/0`

let mnemonic = bip39.generateMnemonic()

const seed = bip39.mnemonicToSeedSync(mnemonic)

let root = bip32.fromSeed(seed)

let node = root.derivePath(path).derive(0).derive(0) // TODO: root vs. node

let wallet = bitcoin.payments.p2pkh({
  pubkey: root.publicKey // TODO: root vs. node
})

let secret = root.toWIF() // TODO: root vs. node

qrcode.generate(secret, {small: false}, function (qrcode) {
    console.log(qrcode)
    console.log(`
    BTC:
    - Address  : ${wallet.address}
    - WIF      : ${secret}
    - Mnemonic : ${mnemonic}
    `)
})
