const assert = require('assert');
const http = require('http');
const app = require('./app.js');

describe('Application Tests', function() {
  this.timeout(10000); // Modern timeout setting
  
  it('should return 200 status code', function(done) {
    http.get('http://localhost:3000', (res) => {
      assert.strictEqual(res.statusCode, 200);
      done();
    }).on('error', done);
  });
  
  it('should return HTML content', function(done) {
    http.get('http://localhost:3000', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        assert.ok(data.includes('Hello from Modern Jenkins'));
        done();
      });
    }).on('error', done);
  });
});
