import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../config/firebase";
import type { Servidor } from "../../types";

export const getServidores = async (): Promise<Servidor[]> => {
  const q = query(collection(db, "servidores"), orderBy("name"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name as string,
  }));
};
