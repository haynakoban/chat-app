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
import { useFirebaseSearch } from '../store/useFirestoreSearch';

// assets
import DefaultPhotoUrl from '../assets/default_user.png';

const ComposeMessage = () => {
  const navigate = useNavigate();
  const { searchResults, handleSearch } = useFirebaseSearch();
  const { conversations, fetchConversation, fetchRecentConvo } =
    useConversationStore();

  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
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
      }
    });

    return () => unsubscribe();
  }, [authUser?.uid, fetchRecentConvo]);

  return (
    <>
      <div className='flex flex-row'>
        {/* conversations */}
        <div className='hidden md:block w-full md:w-80 border border-gray-400 flex-shrink-0 h-screen md:h-[calc(100vh_-_5.05rem)]'>
          <CreateNewConversation />

          <Search />

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
                  selfUid={_.self}
                  userUid={_.user.uid}
                />
              ))}
          </div>
        </div>

        {/* search people */}
        <div className='flex-grow flex flex-col text-white border border-white'>
          <div className='relative flex justify-start items-center p-5 h-20 border-b border-gray-400'>
            <p className='text-md font-medium tracking-widest'>To: </p>

            <div className='flex-grow'>
              <input
                type='text'
                className={`block bg-transparent text-gray-300 text-md w-full p-3.5 focus:outline-none`}
                placeholder='Search people, group...'
                onChange={handleSearch}
              />

              {searchResults && (
                <div className='absolute top-[100%] lg:top-[calc(100%_-_1.25rem)] left-0 lg:left-[2.75rem] w-full lg:w-96 h-[calc(100vh_-_9rem)] md:h-72 shadow-md border-gray-200 bg-gray-100 md:rounded-lg border-t overflow-y-auto p-1.5'>
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      className='w-full flex items-center gap-3 p-2.5 hover:bg-gray-200 cursor-pointer rounded-md'
                      onClick={async () => {
                        const id = await fetchConversation({
                          self: authUser?.uid,
                          uid: user.uid,
                        });
                        navigate(`/${id}`);
                      }}
                    >
                      <img
                        src={user.photoUrl || DefaultPhotoUrl}
                        alt='Profile'
                        className='w-10 h-10 object-cover rounded-full'
                      />
                      <h4 className='text-md font-medium text-gray-800 capitalize'>
                        {user.displayName}
                      </h4>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComposeMessage;
