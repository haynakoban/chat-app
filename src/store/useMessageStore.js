import { create } from 'zustand';

import { db } from '../config/firebaseConfig';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';

const useMessageStore = create((set) => ({
  messages: [],

  createMessage: async ({
    conversationId,
    content,
    senderId,
    receiverId,
    receiverStatus,
  }) => {
    try {
      const messageRef = collection(db, 'messages');

      const messageData = {
        conversationId,
        senderId,
        receiverId,
        content,
        messageType: 'text',
        deliveryStatus: receiverStatus === 'online' ? 'delivered' : 'sent',
        attachementUrl: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(messageRef, messageData);
    } catch (err) {
      console.error(err);
    }
  },

  fetchMessages: async (conversationId) => {
    try {
      set({ messages: [] });
      const messageRef = collection(db, 'messages');
      const messageQuery = query(
        messageRef,
        where('conversationId', '==', conversationId),
        orderBy('createdAt', 'asc')
      );

      onSnapshot(messageQuery, (snapshot) => {
        const messages = [];

        snapshot.forEach((doc) => messages.push({ ...doc.data(), id: doc.id }));

        set({ messages });
      });
    } catch (err) {
      console.error(err);
    }
  },
}));

export default useMessageStore;
