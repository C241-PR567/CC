import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../db-config/firebase-config.js'; // Ensure this path is correct

async function getDiseaseDescription(label) {
  try {
    console.log(`Fetching description for label: ${label.toLowerCase()}`);
    const docRef = doc(db, 'db-diseases', label.toLowerCase());
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log(`Document data: ${JSON.stringify(data)}`);
      return data.description;
    } else {
      console.error(`No document found for label: ${label}`);
      throw new Error(`No description found for disease: ${label}`);
    }
  } catch (error) {
    console.error(`Error fetching disease description: ${error.message}`);
    throw new Error(`Database error: ${error.message}`);
  }
}

export default getDiseaseDescription;

// // Test the function
// (async () => {
//   const label = 'acne'; // Replace with the label you want to test
//   try {
//     const description = await getDiseaseDescription(label);
//     console.log(`Description for ${label}: ${description}`);
//   } catch (error) {
//     console.error(`Test failed: ${error.message}`);
//   }
// })();
