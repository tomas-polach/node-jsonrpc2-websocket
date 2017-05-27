var express = require('express')

// init router instance
var router = express.Router()
// bootstrap router
module.exports = function (app) {

  // robots
  router.get('/robots.txt', function (req, res) {
    res.set({ 'Content-Type': 'text/plain' })
    res.send("User-agent: *\nDisallow: /")
  })

  // static pages
  app.use(express.static('public'))

  // add router to app at root path level
  app.use('', router)

  // ERROR PAGES

  // log an error and return an error page
  app.use(function (err, req, res, next) {
    if (err.stack) {
      console.error(err.stack)
      res.status(500).send('500: '+err.stack)
    } else {
      var errorMessage = JSON.stringify(err)
      console.error(errorMessage)
      res.status(500).send('500 '+errorMessage)
    }
  })

  // assume 404 since no middleware responded
  app.use(function (req, res, next) {
    res.status(404).send('Page not found: '+req.originalUrl)
  })

}
