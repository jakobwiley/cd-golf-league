const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3007,
  path: '/schedule',
  method: 'GET'
};

console.log('Testing connection to schedule page on port 3007...');

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response received');
    console.log(`Body length: ${data.length} characters`);
    console.log('Schedule page is accessible!');
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end(); 