import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebase";

export const createAuxiliar = async (name: string): Promise<string> => {
  const docRef = await addDoc(collection(db, "auxiliares"), {
    name: name.trim().toUpperCase(),
  });
  return docRef.id;
};
