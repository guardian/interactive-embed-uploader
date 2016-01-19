var program = require('commander');
var www = require('./');

program
  .option('-H, --host <host>', 'specify the host [0.0.0.0]', '0.0.0.0')
  .option('-p, --port <port>', 'specify the port [4000]', '4006')
  .option('-b, --backlog <size>', 'specify the backlog size [511]', '511')
  .parse(process.argv);

var app = www();

app.listen(program.port, program.host, ~~program.backlog);
console.log('Listening on %s:%s', program.host, program.port);
