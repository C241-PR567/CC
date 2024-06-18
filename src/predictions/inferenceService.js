import InputError from '../exceptions/InputError.js';
import getDiseaseDescription from './getDiseaseDescription.js'
import * as tf from '@tensorflow/tfjs-node';

class L2 {
  static className = 'L2';
  constructor(l2) { this.l2 = l2; }
  apply(w) { return tf.mul(tf.scalar(this.l2), tf.sum(tf.square(w))); }
  getConfig() { return { l2: this.l2 }; }
}
tf.serialization.registerClass(L2);

async function predictClassification(model, image) {
  try {
    if (!model || typeof model.predict !== 'function') {
      throw new InputError('Model is not valid or does not have a predict function');
    }

    console.log('Decoding image...');
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([150, 150])
      .expandDims()
      .toFloat()
      .div(tf.scalar(255.0));

    console.log(`Tensor shape: ${tensor.shape}`);

    if (tensor.shape.length !== 4 || tensor.shape[1] !== 150 || tensor.shape[2] !== 150 || tensor.shape[3] !== 3) {
      throw new InputError('Input image shape must be [-1, 150, 150, 3]');
    }

    console.log('Making prediction...');
    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const classes = ['acne', 'actinic', 'basal cell carcinoma', 'eczema', 'rosacea'];
    const classResult = tf.argMax(prediction, 1).dataSync()[0];
    const label = classes[classResult].toLowerCase(); // Ubah label menjadi huruf kecil

    console.log(`Predicted label: ${label}`);
    
    // Ambil deskripsi penyakit dari Firestore
    const description = await getDiseaseDescription(label);
    console.log(`Deskripsi yang diambil: ${description}`);

    return { confidenceScore, label, description };
  } catch (error) {
    console.error(`Error during prediction: ${error.message}`);
    throw new InputError(`Input error: ${error.message}`);
  }
}

export default predictClassification;
