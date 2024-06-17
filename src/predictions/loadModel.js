import * as tf from '@tensorflow/tfjs-node';

async function loadModel() {
    try {
        const model = await tf.loadLayersModel(process.env.MODEL_URL);
        return model;
    } catch (error) {
        console.error('Error loading model:', error);
        throw error;
    }
}

export default loadModel;
