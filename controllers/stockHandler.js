'use strict';

const fetch = require('node-fetch')

function StockHandler() {
  this.fetchStock = async (stock, db) => {
    let url = `https://api.iextrading.com/1.0/stock/${stock}/quote`;
    let response = await fetch(url);
    let data = await response.json();
    
    if (data) {
      try {
        let doc = await db.collection('stocks').findOne({symbol: stock});
        if (doc) {
          // stock was already present, return the data
          return {
            stock: data.symbol,
            price: data.open,
            likes: doc.ips.length
          };
        } else {
          // stock was not found in the db, add it
          doc = await db.collection('stocks').insertOne({symbol: stock, ips: []});
          if (doc.insertedCount == 1) {
            return {
            stock: data.symbol,
            price: data.open,
            likes: 0
            };
          }
        }
      } catch(err){
        console.log(err);
      }
    }
  };
  this.addLike = async (stock, ip, db) => {
    const doc = await db.collection('stocks')
    .findOneAndUpdate({symbol: stock}, {$addToSet: {ips: ip}}, {upsert: true, returnOriginal: false});
    if(doc) {
      return doc;
    }
  };
}

module.exports = StockHandler;
