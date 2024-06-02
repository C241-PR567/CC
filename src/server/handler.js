const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const { storeData, storeImageHistory } = require('../services/storeData');

async function postPredictHandler(request, h) {
  try {
    const contentLength = request.headers['content-length'];
    if (contentLength > 1000000) {
      return h.response({
        status: 'fail',
        message: 'Payload content length greater than maximum allowed: 1000000'
      }).code(413);
    }

    const { image } = request.payload;
    const { model } = request.server.app;

    const { confidenceScore } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const resultLabel = confidenceScore > 0.5 ? 'cancer' : 'non-cancer';

    let explanation, suggestion;
    if (resultLabel === 'cancer') {
      explanation = "Ini adalah kasus kanker.";
      suggestion = "Segera periksa ke dokter!";
    } else {
      explanation = "Ini adalah kasus non-kanker.";
      suggestion = "Tidak ada saran khusus untuk kasus non-kanker.";
    }

    const data = {
      "id": id,
      "result": resultLabel,
      "explanation": explanation,
      "suggestion": suggestion,
      "confidenceScore": confidenceScore,
      "createdAt": createdAt
    };

    await storeData(id, data, image);

    const response = h.response({
      status: 'success',
      message: 'Model is predicted successfully',
      data
    });
    response.code(201);
    return response;
  } catch (error) {
    return h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi'
    }).code(400);
  }
}

module.exports = postPredictHandler;

// const predictClassification = require('../services/inferenceService');
// const crypto = require('crypto');
// const storeData = require('../services/storeData');

// async function postPredictHandler(request, h) {
//   try {
//     // Check image size
//     const contentLength = request.headers['content-length'];
//     if (contentLength > 1000000) {
//       return h.response({
//         status: 'fail',
//         message: 'Payload content length greater than maximum allowed: 1000000'
//       }).code(413);
//     }

//     const { image } = request.payload;
//     const { model } = request.server.app;

//     const { confidenceScore } = await predictClassification(model, image);
//     const id = crypto.randomUUID();
//     const createdAt = new Date().toISOString();

//     // Classification logic based on confidence score
//     const resultLabel = confidenceScore > 0.5 ? 'cancer' : 'non-cancer';

//     // Set explanation and suggestion based on resultLabel
//     let explanation, suggestion;
//     if (resultLabel === 'cancer') {
//       explanation = "Ini adalah kasus kanker.";
//       suggestion = "Segera periksa ke dokter!";
//     } else {
//       explanation = "Ini adalah kasus non-kanker.";
//       suggestion = "Tidak ada saran khusus untuk kasus non-kanker.";
//     }

//     const data = {
//       "id": id,
//       "result": resultLabel,
//       "explanation": explanation,
//       "suggestion": suggestion,
//       "confidenceScore": confidenceScore,
//       "createdAt": createdAt
//     };

//     await storeData(id, data);

//     const response = h.response({
//       status: 'success',
//       message: 'Model is predicted successfully',
//       data
//     });
//     response.code(201);
//     return response;
//   } catch (error) {
//     // Handling prediction errors
//     return h.response({
//       status: 'fail',
//       message: 'Terjadi kesalahan dalam melakukan prediksi'
//     }).code(400);
//   }
// }

// module.exports = postPredictHandler;
