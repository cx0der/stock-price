/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    suite('GET /api/stock-prices => stockData object', () => {

      test('1 stock', (done) => {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.property(res.body.stockData, 'stock');
          assert.equal(res.body.stockData.stock, 'GOOG');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          assert.equal(res.body.stockData.likes, 0);
          done();
        });
      });

      test('1 stock with like', (done) => {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'amzn', like: true})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.property(res.body.stockData, 'stock');
          assert.equal(res.body.stockData.stock, 'AMZN');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          assert.equal(res.body.stockData.likes, 1);
          done();
        });
      });

      test('1 stock with like again (ensure likes arent double counted)', (done) => {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'amzn', like: true})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.property(res.body.stockData, 'stock');
          assert.equal(res.body.stockData.stock, 'AMZN');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          assert.equal(res.body.stockData.likes, 1);
          done();
        });
      });

      test('2 stocks', (done) => {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['amzn', 'msft']})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.isArray(res.body.stockData);
          assert.equal(res.body.stockData.length, 2);
          assert.property(res.body.stockData[0], 'stock');
          assert.equal(res.body.stockData[0].stock, 'AMZN');
          assert.property(res.body.stockData[0], 'price');
          assert.property(res.body.stockData[0], 'rel_likes');
          assert.equal(res.body.stockData[0].rel_likes, 1);
          assert.property(res.body.stockData[1], 'stock');
          assert.equal(res.body.stockData[1].stock, 'MSFT');
          assert.property(res.body.stockData[1], 'price');
          assert.property(res.body.stockData[1], 'rel_likes');
          assert.equal(res.body.stockData[1].rel_likes, -1);
          done();
        });
      });

      test('2 stocks with like',  (done) => {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['amzn', 'msft'], like: true})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.isArray(res.body.stockData);
          assert.equal(res.body.stockData.length, 2);
          assert.property(res.body.stockData[0], 'stock');
          assert.equal(res.body.stockData[0].stock, 'AMZN');
          assert.property(res.body.stockData[0], 'price');
          assert.property(res.body.stockData[0], 'rel_likes');
          assert.equal(res.body.stockData[0].rel_likes, 0);
          assert.property(res.body.stockData[1], 'stock');
          assert.equal(res.body.stockData[1].stock, 'MSFT');
          assert.property(res.body.stockData[1], 'price');
          assert.property(res.body.stockData[1], 'rel_likes');
          assert.equal(res.body.stockData[1].rel_likes, 0);
          done();
        });
      });
    });
});
