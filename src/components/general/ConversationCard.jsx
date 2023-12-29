import { useNavigate } from 'react-router-dom';
import { messageDate } from '../../helpers/timeFormat';

// assets
import DefaultPhotoUrl from '../../assets/default_user.png';

const ConversationCard = ({
  id,
  displayName = 'John Doe',
  photoUrl,
  message,
  time,
  unreadCount,
}) => {
  const navigate = useNavigate();

  const handleConvo = () => {
    navigate(`/${id}`);
  };

  return (
    <div
      onClick={handleConvo}
      className='flex justify-center lg:justify-start items-center border-b border-gray-400 px-4 py-3 cursor-pointer'
    >
      <div className='flex justify-center items-center'>
        <img
          src={photoUrl || DefaultPhotoUrl}
          alt='Profile'
          className='w-12 h-12 object-cover rounded-full'
        />
      </div>
      <div className='flex flex-grow flex-col ml-3 relative'>
        <span className='text-xs font-medium text-gray-300 text-right leading-none'>
          {messageDate({ timestamp: time })}
        </span>
        <h4 className='max-w-[200px] text-md font-semibold text-gray-50 leading-none truncate'>
          {displayName}
        </h4>
        <p className='max-w-[200px] text-sm font-normal text-gray-300 leading-loose truncate'>
          {message || 'Say hi to your new buddy!'}
        </p>

        {/* change the hidden to flex if needed */}
        <div className='hidden absolute top-[60%] right-0 translate-y-[-60%] w-5 h-5 rounded-full bg-blue-500 justify-center items-center'>
          <span
            className='text-xs text-white font-medium'
            style={{ fontFamily: 'Montserrat' }}
          >
            10
          </span>
        </div>
      </div>
    </div>
  );
};
export default ConversationCard;
