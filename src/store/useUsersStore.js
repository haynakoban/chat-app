import { create } from 'zustand';
import bcryptjs from 'bcryptjs';

import { db } from '../config/firebaseConfig';
import {
  addDoc,
  collection,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';

const useUsersStore = create((set) => ({
  users: [],
  talkingTo: {},

  createUser: async ({ password = '', fullName, user }) => {
    try {
      const userRef = collection(db, 'users');

      const hashPassword = await bcryptjs.hash(password, 10);

      // store data in firestore
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: fullName,
        password: hashPassword,
        emailVerified: user.emailVerified,
        photoUrl: user.photoURL,
        refreshToken: user.refreshToken,
        status: 'online', // [online, offline, away]
        lastSeen: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(userRef, userData);
      // const result = await addDoc(userRef, userData);

      // const userDoc = doc(db, 'users', result.id);
      // const userDocSnapshot = await getDoc(userDoc);

      // const newUser = {
      //   ...userDocSnapshot.data(),
      //   id: result.id,
      // };

      // set({ user: newUser });
    } catch (err) {
      console.error(err);
    }
  },

  fetchUsers: async () => {
    try {
      const userRef = collection(db, 'users');
      const userQuery = query(userRef, limit(15));

      onSnapshot(userQuery, (snapshot) => {
        const users = [];
        snapshot.forEach((doc) => users.push({ ...doc.data(), id: doc.id }));

        set({ users });
      });
    } catch (err) {
      console.error(err);
    }
  },

  getUser: async (id) => {
    try {
      const userRef = collection(db, 'users');
      const userQuery = query(userRef, where('uid', '==', id));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const userData = { ...userDoc.data(), id: userDoc.id };

        set({ talkingTo: userData });
      }
    } catch (err) {
      console.error(err);
    }
  },
}));

export default useUsersStore;
