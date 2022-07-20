import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore"; 

export type OrderFirestoreDTO = {
  patrimony: string;
  description: string;
  status: 'open' | 'closed',
  soluction?: string;
  create_at: FirebaseFirestoreTypes.Timestamp;
  closed_at: FirebaseFirestoreTypes.Timestamp;
}