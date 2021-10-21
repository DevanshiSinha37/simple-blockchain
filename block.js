const { GENESIS_DATA } = require('./block')
const cryptoHash = require('./utils/crypto-hash')

class Block {
  constructor ({ timestamp, lastHash, hash, data }) {
    this.timestamp = timestamp
    this.lastHash = lastHash
    this.hash = hash
    this.data = data
  }

  static genesis () {
    return new this(GENESIS_DATA)
  }

  static mineBlock ({ lastBlock, data }) {
    const lastHash = lastBlock.lastHash
    let { difficulty } = lastBlock
    let hash, timestamp
    let nonce = 0

    do {
      nonce++
      timestamp = Date.now()
      difficulty = Block.adjustDifficulty({
        originalBlock: lastBlock,
        timestamp
      })
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty)
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty))

    return new this({ timestamp, lastHash, data, difficulty, nonce, hash })
  }

  static adjustDifficulty ({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock
    if (difficulty < 1) return 1
    if (timestamp - originalBlock.timestamp > MINE_RATE) {
      return difficulty - 1
    }
    return difficulty + 1
  }
}

module.export = Block
