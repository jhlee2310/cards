const express = require('express')
const path = require('path')
var history = require('connect-history-api-fallback');
const staticFileMiddleware = express.static(`${path.join(__dirname)}/dist`)
app = express();

app.use(history())
app.use(staticFileMiddleware)
app.listen(7001)

console.log('server started '+ 7001);

