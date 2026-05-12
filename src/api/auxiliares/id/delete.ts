import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../config/firebase";

export const deleteAuxiliar = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "auxiliares", id));
};
