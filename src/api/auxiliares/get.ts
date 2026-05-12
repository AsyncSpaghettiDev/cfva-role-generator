import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../config/firebase";
import type { Auxiliar } from "../../types";

export const getAuxiliares = async (): Promise<Auxiliar[]> => {
  const q = query(collection(db, "auxiliares"), orderBy("name"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name as string,
  }));
};
