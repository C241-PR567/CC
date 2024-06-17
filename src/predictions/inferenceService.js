import * as tf from '@tensorflow/tfjs-node';
import InputError from '../exceptions/InputError.js';

// Definisi regularizer L2
class L2 {
  static className = 'L2';
  constructor(l2) { this.l2 = l2; }
  apply(w) { return tf.mul(tf.scalar(this.l2), tf.sum(tf.square(w))); }
  getConfig() { return {l2: this.l2}; }
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

    const classes = ['acne', 'actinic', 'Basal Cell Carcinoma', 'Eczemaa', 'Rosacea'];
    const classResult = tf.argMax(prediction, 1).dataSync()[0];
    const label = classes[classResult];

    return { confidenceScore, label };
  } catch (error) {
    console.error(`Error during prediction: ${error.message}`);
    throw new InputError(`Input error: ${error.message}`);
  }
}

export default predictClassification;
