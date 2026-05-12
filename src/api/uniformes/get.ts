import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../config/firebase";
import type { Uniforme } from "../../types";

export const getUniformes = async (): Promise<Uniforme[]> => {
  const q = query(collection(db, "uniformes"), orderBy("description"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    description: doc.data().description as string,
  }));
};
