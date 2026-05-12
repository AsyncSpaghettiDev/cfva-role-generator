import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebase";
import type { Rol } from "../../types";

export const createRol = async (rol: Omit<Rol, "id">): Promise<string> => {
  // Firestore throws an error if any property is `undefined`.
  // JSON stringify/parse cleanly strips out all undefined keys recursively.
  const cleanRol = JSON.parse(JSON.stringify(rol));
  
  const docRef = await addDoc(collection(db, "roles"), {
    ...cleanRol,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
};
