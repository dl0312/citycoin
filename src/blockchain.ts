import * as CryptoJS from "crypto-js";

class Block {
  static calculateBlockHash = (
    index: number,
    previousHash: string,
    timestamp: number,
    data: string
  ): string =>
    CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

  static isBlockStructureValid = (block: Block): boolean => {
    return (
      typeof block.index === "number" &&
      typeof block.hash === "string" &&
      typeof block.previousHash === "string" &&
      typeof block.timestamp === "number" &&
      typeof block.data === "string"
    );
  };

  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  constructor(
    index: number,
    hash: string,
    previousHash: string,
    timestamp: number,
    data: string
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
  }
}
const genesisBlock: Block = new Block(
  0,
  "1d0314bbcd2c6ed7dc73a070b048493d9061614a5a8109d6d438669f1bc77392",
  null,
  1558864199886,
  "🧔 This is the genesis!"
);

let blockchain: Block[] = [genesisBlock];

const getBlockchain = (): Block[] => blockchain;

const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
  const previousBlock: Block = getLatestBlock();
  const newIndex: number = previousBlock.index + 1;
  const newTimestamp: number = getNewTimeStamp();
  const newHash: string = Block.calculateBlockHash(
    newIndex,
    previousBlock.hash,
    newTimestamp,
    data
  );
  const newBlock: Block = new Block(
    newIndex,
    newHash,
    previousBlock.hash,
    newTimestamp,
    data
  );
  addBlockToChain(newBlock);
  return newBlock;
};

const getHashforBlock = (aBlock: Block): string =>
  Block.calculateBlockHash(
    aBlock.index,
    aBlock.previousHash,
    aBlock.timestamp,
    aBlock.data
  );

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
  if (!Block.isBlockStructureValid(candidateBlock)) {
    return false;
  } else if (previousBlock.index + 1 !== candidateBlock.index) {
    return false;
  } else if (previousBlock.hash !== candidateBlock.previousHash) {
    return false;
  } else if (getHashforBlock(candidateBlock) !== candidateBlock.hash) {
    return false;
  }
  return true;
};

const isChainValid = (candidateChain: Block[]): boolean => {
  const isGenesisValid = (block: Block) => {
    return JSON.stringify(block) === JSON.stringify(genesisBlock);
  };
  if (!isGenesisValid(candidateChain[0])) {
    console.log(
      "The candidateChains's genesisBlock is not the same as our genesisBlock"
    );
    return false;
  }
  for (let i = 1; i < candidateChain.length; i++) {
    if (!isBlockValid(candidateChain[i], candidateChain[i - 1])) {
      return false;
    }
  }
  return true;
};

const replaceChain = (candidateChain: Block[]): boolean => {
  if (
    isChainValid(candidateChain) &&
    candidateChain.length > getBlockchain().length
  ) {
    blockchain = candidateChain;
    return true;
  } else {
    return false;
  }
};

const addBlockToChain = (candidateBlock: Block): boolean => {
  if (isBlockValid(candidateBlock, getLatestBlock())) {
    blockchain.push(candidateBlock);
    return true;
  } else {
    return false;
  }
};

export {
  Block,
  getBlockchain,
  createNewBlock,
  getLatestBlock,
  addBlockToChain,
  replaceChain
};
