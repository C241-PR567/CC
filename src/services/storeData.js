// const { Firestore } = require('@google-cloud/firestore');

// async function storeData(id, data) {
//   const db = new Firestore();

//   const predictCollection = db.collection('predictions');
//   return predictCollection.doc(id).set(data);
// }

// module.exports = storeData;

const { Firestore } = require('@google-cloud/firestore');
const { Storage } = require('@google-cloud/storage');
const crypto = require('crypto');

const storage = new Storage();

async function storeData(id, data, image) {
  const db = new Firestore();
  const bucketName = process.env.GCLOUD_STORAGE_BUCKET;
  const bucket = storage.bucket(bucketName);
  const fileName = `images/${id}.jpg`;
  const file = bucket.file(fileName);

  // Upload the image to Google Cloud Storage
  await file.save(image);

  // Make the image publicly accessible
  await file.makePublic();

  const imageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

  const predictCollection = db.collection('predictions');
  return predictCollection.doc(id).set({ ...data, imageUrl });
}

module.exports = storeData;
