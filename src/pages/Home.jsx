import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';

// config
import { auth, db } from '../config/firebaseConfig';

// components
import ConversationCard from '../components/general/ConversationCard';
import CreateNewConversation from '../components/general/CreateNewConversation';
import Search from '../components/general/Search';

// store
import useConversationStore from '../store/useConversationStore';

const Home = () => {
  const navigate = useNavigate();
  const { conversations, fetchRecentConvo } = useConversationStore();

  const [isLoading, setIsLoading] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsLoading(true);
      try {
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
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    });

    return () => unsubscribe();
  }, [authUser?.uid, fetchRecentConvo]);

  return (
    <>
      <div className='flex flex-row'>
        {/* conversations */}
        <div className='w-full md:w-80 border border-gray-400 flex-shrink-0 h-screen md:h-[calc(100vh_-_5.05rem)]'>
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

        {/* welcome message */}
        <div className='flex-grow hidden md:flex justify-center items-start flex-col text-white border border-white p-10'>
          <h1 className='text-2xl font-bold'>Select a message</h1>
          <p className='text-md my-3'>
            Select from your ongoing chats, initiate a fresh conversation, or
            simply go with the flow.
          </p>
          <button
            onClick={() => navigate('/compose')}
            className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2'
          >
            New message
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
