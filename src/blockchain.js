class Block {
  constructor(index, hash, previousHash, timestamp, data) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
  }
}

const genesisBlock = new Block(
  0,
  "1d0314bbcd2c6ed7dc73a070b048493d9061614a5a8109d6d438669f1bc77392",
  null,
  1558864199886,
  "This is the 🧔genesis!!"
);

let Blockchain = genesisBlock;

console.log(Blockchain);
