import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type TaskFirestoreDTO = {
    title: string;
    description: string;
    status: 'todo' | 'doing' | 'done';
    solution?: string;
    created_at: FirebaseFirestoreTypes.Timestamp;
    closed_at: FirebaseFirestoreTypes.Timestamp;
};