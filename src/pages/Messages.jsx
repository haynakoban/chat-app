import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';

// config
import { auth, db } from '../config/firebaseConfig';

// components
import ConversationCard from '../components/general/ConversationCard';
import CreateNewConversation from '../components/general/CreateNewConversation';
import Search from '../components/general/Search';
import WelcomeMessage from '../components/general/WelcomeMessage';

// store
import useConversationStore from '../store/useConversationStore';
import useUsersStore from '../store/useUsersStore';
import useMessageStore from '../store/useMessageStore';

// assets
import DefaultPhotoUrl from '../assets/default_user.png';

// helpers
import { messageDate } from '../helpers/timeFormat';

const Messages = () => {
  const { id } = useParams();
  const { talkingTo, getUser } = useUsersStore();
  const { messages, createMessage, fetchMessages } = useMessageStore();
  const {
    conversation,
    conversations,
    fetchRecentConvo,
    fetchConversation,
    fetchConvoUsers,
  } = useConversationStore();

  const messagesContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsLoading(true);
      try {
        const uids = await fetchConvoUsers({ id });
        const selfId = uids.filter((id) => id === currentUser.uid);
        const userId = uids.filter((id) => id !== currentUser.uid);

        await fetchConversation({
          self: selfId[0],
          uid: userId[0],
        });

        const userRef = collection(db, 'users');
        const userQuery = query(userRef, where('uid', '==', currentUser.uid));

        const docs = await getDocs(userQuery);

        if (docs.size > 0) {
          const doc = docs.docs[0];
          const user = { ...doc.data(), id: doc.id };

          setAuthUser(user);
        }
      } catch (error) {
        console.error(error);
      } finally {
        fetchRecentConvo({ self: currentUser.uid });
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [id, authUser?.uid, fetchRecentConvo, fetchConversation, fetchConvoUsers]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    try {
      if (conversation?.id) {
        setIsMessageLoading(true);
        fetchMessages(conversation?.id).then(() => {
          setIsMessageLoading(false);
        });
      }
    } catch (error) {
      console.error(error);
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

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  return (
    <>
      <div className='flex flex-row'>
        {/* conversations */}
        <div className='hidden md:block w-full md:w-80 border border-gray-400 flex-shrink-0 h-screen md:h-[calc(100vh_-_5.05rem)]'>
          <CreateNewConversation />

          <Search />

          {isLoading ? (
            <div className='flex justify-start pt-5 items-center flex-col h-screen md:h-[calc(100vh_-_5.05rem)]'>
              <span className='text-md text-medium text-white'>Loading...</span>
            </div>
          ) : (
            <div
              id='scroll-conversation'
              className='flex flex-col h-screen md:h-[calc(100vh_-_5.05rem)] overflow-y-auto'
            >
              {conversations &&
                conversations.map((_) => (
                  <ConversationCard
                    key={_?.id}
                    id={_?.id}
                    displayName={_.user.displayName}
                    photoUrl={_.user.photoUrl}
                    message={_.message.content}
                    time={_.message.createdAt}
                    unreadCount={0}
                  />
                ))}
            </div>
          )}
        </div>

        <div className='flex-grow flex flex-col text-white border border-white relative'>
          {/* top corner of the actual message */}
          <div className='flex justify-between items-center p-5 border-b border-white'>
            <div className='flex items-center'>
              <div className='flex justify-center items-center'>
                <img
                  src={talkingTo.photoUrl || DefaultPhotoUrl}
                  alt='Profile'
                  className='w-12 h-12 object-cover rounded-full'
                />
              </div>
              <div className='flex flex-grow flex-col ml-3 relative'>
                <h4 className='max-w-[200px] text-md font-semibold text-white leading-none truncate'>
                  {talkingTo.displayName || 'John Doe'}
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

          {/* message content */}
          <div
            ref={messagesContainerRef}
            id='scroll-message'
            className='flex flex-col justify-between h-[calc(100vh_-_9.6rem)] sm:h-[calc(100vh_-_11rem)] overflow-y-auto'
          >
            {isMessageLoading ? (
              <div className='pt-5 text-center'>
                <span className='text-md text-medium text-white'>
                  Messages Loading...
                </span>
              </div>
            ) : (
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
                    <div
                      key={message.id}
                      className={`
                      ${
                        authUser?.uid === message.senderId
                          ? 'justify-end'
                          : 'justify-start'
                      }
                     flex-start flex items-start mt-8`}
                    >
                      {authUser?.uid !== message.senderId && (
                        <img
                          src={talkingTo?.photoUrl || DefaultPhotoUrl}
                          alt='Profile'
                          className='w-10 h-10 object-cover rounded-full'
                        />
                      )}

                      <div className='px-3'>
                        <h4
                          className={`
                          ${
                            authUser?.uid === message.senderId
                              ? 'text-right'
                              : 'text-left'
                          }
                         text-left mb-1.5 text-xs font-medium text-gray-100 p-1`}
                        >
                          {authUser?.uid === message.senderId
                            ? authUser?.displayName
                            : talkingTo?.displayName}
                        </h4>

                        <div className='flex flex-col max-w-[280px] md:max-w-[300px] 2xl:max-w-[450px]'>
                          {/* loop through messages */}
                          <p
                            className={`${
                              authUser?.uid === message.senderId
                                ? 'self-end'
                                : 'self-start'
                            }`}
                          >
                            <span className='inline-block mb-2.5 p-2.5 bg-gray-50 text-black rounded-md border-t shadow-md border-gray-200 text-sm font-normal'>
                              {message.content}
                            </span>
                          </p>
                        </div>

                        {/* keep the last timestamp */}
                        <span
                          className={`
                          ${
                            authUser?.uid === message.senderId
                              ? 'text-right'
                              : 'text-left'
                          }
                        text-left block text-xs font-medium text-gray-300 px-1`}
                        >
                          {messageDate({ timestamp: message?.updatedAt })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* send message */}
          <div className='absolute w-full bottom-0 left-0 flex items-center p-5 h-20 z-30 bg-[#202128]'>
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
      </div>
    </>
  );
};

export default Messages;
