module.exports = function (rpc) {

  // how to use:
  //
  // access params:
  // rpc.params.whater = something
  //
  // response:
  // rpc.sendResult({ whatever: 'some result' })
  //
  // error handling:
  // rpc.sendParamsError('pathUrl param not provided.')
  // rpc.sendError('Feedback Email has not been sent. Please check server logs for details.')
  // rawQuery(query,{ plain: true }).then(rpc.sendResult).catch(rpc.sendError)

  rpc.sendResult({
    message: 'pong'
  })

}