const CryptoJS = require("crypto-js");

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

let blockchain = genesisBlock;

const getLastBlock = () => blockchain[blockchain.length - 1];

const getTimestamp = () => new Date().getTime() / 1000;

const createHash = (index, previousHash, timestamp, data) =>
  CryptoJS.SHA256(index + previousHash, timestamp + data).toString;

const createNewBlock = data => {
  const previousBlock = getLastBlock();
  const newBlockIndex = previousBlock.index + 1;
  const newTimestamp = getTimestamp();
  const newHash = createHash(
    newBlockIndex,
    previousBlock.hash,
    newTimestamp,
    data
  );
  const newBlock = new Block(
    newBlockIndex,
    newHash,
    previousBlock.hash,
    newTimestamp,
    data
  );
  return newBlock;
};

const getBlocksHash = block =>
  createHash(block.index, block.previousBlock, block.timestamp, block.data);

const isNewBlockValid = (candidateBlock, latestBlock) => {
  if (latestBlock.index + 1 !== candidateBlock.index) {
    console.error("The candidate block doesn't have a valid index");
    return false;
  } else if (latestBlock.hash !== candidateBlock.previousHash) {
    console.error(
      "The previousHash of the candidate block is not the hash of the latest block"
    );
    return false;
  } else if (getBlocksHash(candidateBlock) !== candidateBlock.hash) {
    console.error("The hash of this block is invalid");
    return false;
  }
  return true;
};

const isNewStructureValid = block =>
  typeof block.index === "number" &&
  typeof block.hash === "string" &&
  typeof block.previousHash === "string" &&
  typeof block.timestamp === "number" &&
  typeof block.data === "string";
