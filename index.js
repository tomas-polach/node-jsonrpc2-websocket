// configs
var PORT = 5000
process.env.TZ = 'Europe/Zurich'

// dependencies
var http = require('http')
var ws = require('ws')
var handleWebsocketUpgrade = require('express-websocket')
var cors = require('cors')
var timeout = require('connect-timeout')
var morgan = require('morgan')
var getClientIp = require('./middleware/client-ip')

// init express
var app = require('express')()
// debugging
if (process.env.NODE_ENV !== 'production') {
  app.set('showStackError', true)
  app.use(morgan('dev'))
}
// set timeout
app.use(timeout('30s'))
// get client ip
app.use(getClientIp)
// configure CORS (cross domain availability)
app.use(cors({
  credentials: true,
  origin: function(origin, callback) {
    // allow any origin
    callback(null, origin)
  }
}))
// bootstrap routers
require('./routers/api-router')(app)
require('./routers/page-router')(app)

// init http server
var httpServer = http.createServer(app)
httpServer.listen(PORT, function () {
  // init websocket server
  var websocketServer = new ws.Server({ noServer: true })
  httpServer.on('upgrade', handleWebsocketUpgrade(app, websocketServer))
  // ready to go ;)
  console.log('Server listening on port: ' + PORT)
})
