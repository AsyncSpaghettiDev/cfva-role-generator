import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../config/firebase";
import type { Rol } from "../../types";

export const getRoles = async (): Promise<Rol[]> => {
  const q = query(collection(db, "roles"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Rol, "id">),
  }));
};
