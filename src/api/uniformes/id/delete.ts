import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../config/firebase";

export const deleteUniforme = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "uniformes", id));
};
