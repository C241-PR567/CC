const { Firestore } = require('@google-cloud/firestore');

async function getHistoryHandler(request, h) {
  const db = new Firestore();
  const predictCollection = db.collection('predictions');
  const snapshot = await predictCollection.orderBy('createdAt', 'desc').get();

  const history = snapshot.docs.map(doc => doc.data());

  return h.response({
    status: 'success',
    data: history
  }).code(200);
}

module.exports = getHistoryHandler;
