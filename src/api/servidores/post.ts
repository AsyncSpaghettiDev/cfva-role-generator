import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebase";

export const createServidor = async (name: string): Promise<string> => {
  const docRef = await addDoc(collection(db, "servidores"), {
    name: name.trim().toUpperCase(),
  });
  return docRef.id;
};
