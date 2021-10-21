const Block = require('./block')
const cryptoHash = require('./utils/crypto-hash')

class Blockchain {
  constructor () {
    this.chain = [Block.genesis()]
  }

  addBlock ({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data
    })

    this.chain.push(newBlock)
  }

  replaceChain (chain) {
    if (chain.length <= this.chain.length) {
      return
    }
    if (!Blockchain.isValidChange(chain)) {
      return
    }

    this.chain = chain
  }

  static isValidChange (chain) {
    // first block isn't genesis block
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false
    }

    // check all the other blocks
    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, data } = chain[i]

      const actualLastHash = chain[i - 1].hash
      if (lastHash !== actualLastHash) {
        return false
      }

      const validatedHash = cryptoHash(timestamp, lastHash, data)
      if (hash !== validatedHash) {
        return false
      }
    }

    return true
  }
}

module.exports = Blockchain
