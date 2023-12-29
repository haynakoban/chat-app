// assets
import DefaultPhotoUrl from '../../assets/default_user.png';

// helpers
import { messageDate } from '../../helpers/timeFormat';

const MessageList = ({ message, self, photoUrl, receiverName, senderName }) => {
  return (
    <div
      className={`${
        self === message.senderId ? 'justify-end' : 'justify-start'
      } flex items-start mt-8`}
    >
      {self !== message.senderId && (
        <img
          src={photoUrl || DefaultPhotoUrl}
          alt='Profile'
          className='w-10 h-10 object-cover rounded-full'
        />
      )}

      <div className='px-3'>
        <h4
          className={`${
            self === message.senderId ? 'text-right' : 'text-left'
          } mb-1.5 text-xs font-medium text-gray-700 p-1`}
        >
          {self === message.senderId ? senderName : receiverName}
        </h4>

        <div className='flex flex-col max-w-[280px] md:max-w-[300px] 2xl:max-w-[450px]'>
          {/* loop through messages */}
          <p
            className={`${
              self === message.senderId ? 'self-end' : 'self-start'
            }`}
          >
            <span className='inline-block mb-2.5 p-2.5 bg-gray-50 text-gray-700 rounded-md border-t shadow-md border-gray-200 text-sm font-normal'>
              {message.content}
            </span>
          </p>
        </div>

        {/* keep the last timestamp */}
        <span
          className={`${
            self === message.senderId ? 'text-right' : 'text-left'
          } block text-xs font-medium text-gray-500 px-1`}
        >
          {messageDate({ timestamp: message?.updatedAt })}
        </span>
      </div>
    </div>
  );
};
export default MessageList;
