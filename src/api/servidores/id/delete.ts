import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../config/firebase";

export const deleteServidor = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "servidores", id));
};
