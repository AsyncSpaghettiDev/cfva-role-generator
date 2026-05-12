import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebase";

export const createUniforme = async (description: string): Promise<string> => {
  const docRef = await addDoc(collection(db, "uniformes"), {
    description: description.trim().toUpperCase(),
  });
  return docRef.id;
};
