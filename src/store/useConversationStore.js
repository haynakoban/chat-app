import { create } from 'zustand';

import { db } from '../config/firebaseConfig';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';

const useConversationStore = create((set) => ({
  conversations: [],
  conversation: {},

  fetchConversation: async ({ self, uid }) => {
    set({ conversation: {} });
    try {
      const convoRef = collection(db, 'conversations');

      const convoQuery = query(
        convoRef,
        where('participants', 'array-contains', self)
      );

      const docs = await getDocs(convoQuery);

      let conversationData;

      if (docs.size > 0) {
        const filteredDocs = docs.docs.filter((doc) => {
          const data = { ...doc.data(), id: doc.id };
          return data.participants.includes(uid);
        });

        if (filteredDocs.length > 0) {
          const doc = filteredDocs[0];
          conversationData = { ...doc.data(), id: doc.id };
        }
      }

      if (!conversationData) {
        const result = await addDoc(convoRef, {
          type: 'individual',
          participants: [self, uid],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        const convoDoc = doc(db, 'conversations', result.id);
        const convoDocSnapshot = await getDoc(convoDoc);
        conversationData = {
          ...convoDocSnapshot.data(),
          id: result.id,
        };
      }

      set({ conversation: { ...conversationData, currentId: uid } });
      return conversationData.id;
    } catch (err) {
      console.error(err);
    }
  },

  fetchRecentConvo: async ({ self }) => {
    try {
      const convoRef = collection(db, 'conversations');
      const userRef = collection(db, 'users');
      const messageRef = collection(db, 'messages');

      const convoQuery = query(
        convoRef,
        where('participants', 'array-contains', self)
      );

      const docs = await getDocs(convoQuery);

      if (docs.size > 0) {
        const listOfConvos = [];

        for (const doc of docs.docs) {
          const data = { ...doc.data(), id: doc.id };
          const userId = data.participants.filter((doc) => doc !== self);

          const userQuery = query(userRef, where('uid', '==', userId[0]));
          const userDocs = await getDocs(userQuery);

          let userData = {};

          if (userDocs.size > 0) {
            const userDoc = userDocs.docs[0];
            userData = { ...userDoc.data(), id: userDoc.id };
          }

          const messageQuery = query(
            messageRef,
            where('conversationId', '==', data.id),
            orderBy('createdAt', 'asc')
          );

          onSnapshot(messageQuery, (snapshot) => {
            let messageData = {};

            if (snapshot.size > 0) {
              const messageDoc = snapshot.docs[snapshot.size - 1];
              messageData = { ...messageDoc.data(), id: messageDoc.id };
            }

            const convoData = {
              ...data,
              user: { ...userData },
              message: { ...messageData },
              self,
            };

            // Update or add the conversation in the list
            const index = listOfConvos.findIndex((c) => c.id === convoData.id);

            if (index !== -1) {
              listOfConvos[index] = convoData;
            } else {
              listOfConvos.push(convoData);
            }

            set({ conversations: listOfConvos });
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  },

  fetchConvoUsers: async ({ id }) => {
    try {
      const docRef = doc(db, 'conversations', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data().participants;
      } else {
        return null;
      }
    } catch (err) {
      console.error(err);
    }
  },
}));

export default useConversationStore;
