/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const StockHandler = require('../controllers/stockHandler.js');

const stockHandler = new StockHandler ();

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = (app) => {

  app.route('/api/stock-prices')
    .get((req, res) => {
      let stock = req.query.stock;
      let like = req.query.like || false;
      let ip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.ip;
    
      const client = MongoClient(process.env.DB, { useNewUrlParser: true });
      client.connect((err) => {
        if(err) {
          res.status(503).send('Service unavailable');
          return;
        }
        const db = client.db();
        if (Array.isArray(stock)) {
          const stock1 = stock[0].toUpperCase();
          const stock2 = stock[1].toUpperCase();
          let stock1Data;
          let stock2Data;
          if(like) {
            // like both the stocks and then fetch the details
            stockHandler.addLike(stock1, ip, db).then(() => {
              stockHandler.addLike(stock2, ip, db);
            });
          }
          stockHandler.fetchStock(stock1, db).then((data) => {
            stock1Data = data;
            stockHandler.fetchStock(stock2, db).then((data2) => {
              stock2Data = data2;
              stock1Data.rel_likes = stock1Data.likes - stock2Data.likes;
              stock2Data.rel_likes = stock2Data.likes - stock1Data.likes;
              delete stock1Data.likes;
              delete stock2Data.likes;
              res.json({stockData: [stock1Data, stock2Data]});
            });
          });
        } else {
          stock = stock.toUpperCase();
          if(like) {
            stockHandler.addLike(stock, ip, db);
          }
          stockHandler.fetchStock(stock, db).then((s) => {
            res.json({stockData: s});
          });
        }
      });
    });
};
