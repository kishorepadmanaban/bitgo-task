const axios = require('axios');
let transactions = require('./transactions.json');

// let transactions = [];
const getAllTransactions = async (skip) => {
  try{
    let response = await axios(`https://blockstream.info/api/block/00000000000000000005964f2d04cd6d1e0891478a3ce9d6b46065bffe5a3491/txs/${skip}`);
    console.log('', );
    console.log('response', response.data.length);
    if(response.data.length){
      transactions = [ ...transactions, ...response.data];
      skip += 25;
      getAllTransactions(skip);
    }
  }catch(error){
    console.log(error)
  }
};

// getAllTransactions(0);

let ancestorSet = [];
let ancestorTree = [];

findAncestorSet = (transactions) => {
  transactions.forEach(inputTransaction => {
    inputTransaction.vin.forEach(input => {
      transactions.forEach(transaction => {
        if(input.txid === transaction.txid) {
          let ancestorObj = {
            parent: transaction.txid,
            txid: inputTransaction.txid
          }
          ancestorSet.push(ancestorObj);
        }
      })
    })
  })
}

findAncestorSet(transactions);

const isParentExist = (parent, count = 1) => {
  ancestorSet.map(ancestor => {
    if(ancestor.txid === parent) {
      isParentExist(count++);
    }
  })
  return count
}

ancestorSet.forEach(i => {
  let transaction = {
    txid: i.txid,
    ancestorSetSize: isParentExist(i.parent)
  }
  ancestorTree.push(transaction);
})

let sortedAncestorSet = ancestorTree.sort((a,b) => (b.ancestorSetSize > a.ancestorSetSize) ? 1 : ((a.ancestorSetSize > b.ancestorSetSize) ? -1 : 0));

sortedAncestorSet.length = 10;

console.log('ancestorSet', ancestorSet);
console.log('ancestorTree', ancestorTree);
console.log('10 transaction with the largest ancestry sets', sortedAncestorSet);