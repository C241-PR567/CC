const postPredictHandler = require('../server/handler');
const getHistoryHandler = require('../server/getHistoryHandler');

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true
      }
    }
  },
  {
    path: '/history',
    method: 'GET',
    handler: getHistoryHandler
  }
]

module.exports = routes;
