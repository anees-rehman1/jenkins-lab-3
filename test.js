const assert = require('assert');
const http = require('http');

// 🔥 KEY FIX: Use PORT from environment
const PORT = process.env.PORT || 3000;

describe('Application Tests', function() {
  this.timeout(10000);
  
  it('should return 200 status code', function(done) {
    http.get(`http://localhost:${PORT}`, (res) => {
      assert.strictEqual(res.statusCode, 200);
      done();
    }).on('error', (err) => {
      done(err);
    });
  });
  
  it('should return HTML content', function(done) {
    http.get(`http://localhost:${PORT}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        assert(data.includes('Hello'));
        done();
      });
    }).on('error', (err) => {
      done(err);
    });
  });
});
