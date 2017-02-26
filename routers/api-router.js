"use strict";

// configs
var apiBaseUrl = '/api'
var apiBaseWsUrl = '/api'

// dependencies
var ws = require('ws')
var bodyParser = require('body-parser')
var JsonRpc2Server = require('../middleware/json-rpc2-server')

// create RPC server instance
var rpcServer = new JsonRpc2Server()
// expose API methods
rpcServer.exposeModule('ping', require('../api/ping'))
// create body parser middleware
var getRequestBody = bodyParser.text({ limit: '5000kb', type: '*/*' })
// bootstrap
module.exports = function (app) {

  // handle HTTP requests
  app.route(apiBaseUrl).post(getRequestBody, function (req, res) {
    rpcServer.handleRequest({
      message: req.body,
      request: req,
      response: res,
      user: req.user
    }, function (response) {
      // JSON RPC methods calls by specification have responses while notifications do not
      // http://www.jsonrpc.org/specification#notification
      response !== undefined ? res.json(response) : res.status(200).end()
    })
  })

  // handle websocket
  app.get(apiBaseWsUrl, function (req, res, next) {
    if (!res.websocket) {
      // not a websocket upgrade request
      next()
      return
    }
    res.websocket(function (ws) {
      // websocket connection successful. stop timeout prevention
      req.clearTimeout()
      // avoid timeouts by sending ping notifications. required on certain PaaS platforms like heroku
      // which close connections automatically after certain time (mostly 30s)
      /*
      var interval = setInterval(function(){
        ws.send(JSON.stringify({
          jsonrpc: '2.0',
          method: 'ping',
          params: {}
        }))
      }, 25 * 1000)
      ws.on('close', function(){
        clearInterval(interval)
      })
      */

      // handle messages
      ws.on('message', function (message) {
        rpcServer.handleRequest({
          message: message,
          request: req,
          response: res,
          user: req.user
        }, function (response) {
          if (response) {
            ws.send(JSON.stringify(response))
          }
        })
      })

    })
  })

}
