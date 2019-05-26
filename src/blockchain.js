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

const getLastBlock = () => getBlockChain()[blockchain.length - 1];

const getTimestamp = () => new Date().getTime() / 1000;

const getBlockChain = () => blockchain;

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
  addBlockToChain(newBlock);
  return newBlock;
};

const getBlocksHash = block =>
  createHash(block.index, block.previousBlock, block.timestamp, block.data);

const isNewBlockValid = (candidateBlock, latestBlock) => {
  if (!isNewStructureValid(candidateBlock)) {
    console.error("The candidate block structure is not valid");
    return false;
  } else if (latestBlock.index + 1 !== candidateBlock.index) {
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

const isChainValid = candidateChain => {
  const isGenesisValid = block =>
    JSON.stringify(block) === JSON.stringify(genesisBlock);
  if (!isGenesisValid(candidateChain[0])) {
    console.error(
      "The genesis block of candidate chain is not the same as our genesis block"
    );
    return false;
  }
  for (let index = 1; index < candidateChain.length; index++) {
    if (!isNewBlockValid(candidateChain[index], candidateChain[index - 1])) {
      return false;
    }
  }
  return true;
};

const replaceChain = newChain => {
  /* always takes longer one */
  if (isChainValid(newChain) && newChain.length > getBlockChain().length) {
    blockchain = newChain;
    return true;
  } else {
    return false;
  }
};

const addBlockToChain = candidateBlock => {
  if (isNewBlockValid(candidateBlock, getLastBlock())) {
    getBlockChain().previousHash(candidateBlock);
    return true;
  } else {
    return false;
  }
};

module.exports = {
  getBlockChain,
  createHash
};
