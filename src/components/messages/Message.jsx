import { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

// assets
import DefaultPhotoUrl from '../../assets/default_user.png';

// config
import { auth, db } from '../../config/firebaseConfig';

// components
import MessageList from './MessageList';
import WelcomeMessage from './WelcomeMessage';

// store
import useConversationStore from '../../store/useConversationStore';
import useUsersStore from '../../store/useUsersStore';
import useMessageStore from '../../store/useMessageStore';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Message = () => {
  const messagesContainerRef = useRef(null);
  const { conversation, fetchRecentConvo } = useConversationStore();
  const { talkingTo, getUser } = useUsersStore();
  const { messages, createMessage, fetchMessages } = useMessageStore();

  const [message, setMessage] = useState('');
  const [me, setMe] = useState({});
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        const userRef = collection(db, 'users');
        const userQuery = query(userRef, where('uid', '==', currentUser.uid));

        const docs = await getDocs(userQuery);

        if (docs.size > 0) {
          const doc = docs.docs[0];
          const user = { ...doc.data(), id: doc.id };

          setMe(user);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setAuthUser(currentUser);
        fetchRecentConvo({ self: currentUser.uid });
      }
    });

    return () => unsubscribe();
  }, [authUser?.uid, fetchRecentConvo]);

  useEffect(() => {
    if (conversation?.id) {
      fetchMessages(conversation?.id);
    }
  }, [conversation?.id, fetchMessages]);

  useEffect(() => {
    if (conversation?.currentId) {
      getUser(conversation.currentId);
    }
  }, [conversation?.currentId, getUser]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const sendMessage = () => {
    try {
      createMessage({
        conversationId: conversation?.id,
        content: message,
        senderId: authUser?.uid,
        receiverId: talkingTo?.uid,
        receiverStatus: talkingTo?.status,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setMessage('');
    }
  };

  return (
    <div className='relative flex-grow hidden sm:block'>
      <div className='flex justify-between items-center p-5 h-20'>
        <div className='flex items-center'>
          <div className='flex justify-center items-center'>
            <img
              src={talkingTo?.photoUrl || DefaultPhotoUrl}
              alt='Profile'
              className='w-12 h-12 object-cover rounded-full'
            />
          </div>
          <div className='flex flex-grow flex-col ml-3 relative'>
            <h4 className='max-w-[200px] text-md font-semibold text-gray-900 leading-none truncate'>
              {talkingTo?.displayName || ''}
            </h4>
            <p
              className={`${
                talkingTo?.status === 'online'
                  ? 'text-green-600'
                  : 'text-gray-500'
              } max-w-[200px] text-sm font-semibold leading-normal truncate`}
            >
              {talkingTo?.status || 'offline'}
            </p>
          </div>
        </div>
        <div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-8 h-8 cursor-pointer'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
            />
          </svg>
        </div>
      </div>

      <hr className='w-full h-px bg-gray-400 border-0 shadow-lg' />

      {/* messages content */}
      <div
        ref={messagesContainerRef}
        id='scroll-message'
        className='flex flex-col justify-between h-[calc(100vh_-_5rem)] overflow-y-scroll'
      >
        <div className='px-5 mb-20'>
          {/* display profile if no conversation yet */}
          {talkingTo?.displayName && (
            <WelcomeMessage
              photoUrl={talkingTo?.photoUrl}
              displayName={talkingTo?.displayName}
            />
          )}

          {/* actual conversation messages */}
          <div className='flex flex-col pt-10'>
            {messages.map((message) => (
              <MessageList
                key={message.id}
                message={message}
                self={authUser?.uid}
                photoUrl={talkingTo?.photoUrl}
                receiverName={talkingTo?.displayName}
                senderName={me?.displayName}
              />
            ))}
          </div>
        </div>
      </div>

      <div className='absolute w-full bottom-0 left-0 flex items-center p-5 h-20 z-50 bg-[#f2f2f2]'>
        <div className='flex justify-center items-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6 text-gray-500 cursor-pointer'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244'
            />
          </svg>
        </div>
        <div className='flex-grow px-3'>
          <input
            type='email'
            className={`block bg-gray-200 text-black rounded-full text-md w-full px-4 py-2.5 focus:outline-none`}
            placeholder='Type message here...'
            value={message}
            onKeyDown={handleKeyDown}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div>
          <button type='button' onClick={sendMessage}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-6 h-6 cursor-pointer text-gray-500'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5'
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
export default Message;
