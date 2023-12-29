import DefaultPhotoUrl from '../../assets/default_user.png';

const WelcomeMessage = ({ photoUrl, displayName = 'John Doe' }) => {
  return (
    <div className='flex flex-col justify-center items-center pt-20'>
      <img
        src={photoUrl || DefaultPhotoUrl}
        alt='Profile'
        className='w-32 h-32 object-cover rounded-full'
      />
      <h4 className='pt-2.5 text-lg font-semibold text-white text-center'>
        {displayName}
      </h4>
      <p className='text-sm font-normal text-gray-200'>
        Ready to connect and engage!
      </p>
      <p className='text-sm font-normal text-gray-200 text-center'>
        Take a moment to send a friendly message to{' '}
        <span className='font-semibold text-white'>{displayName}</span>.
      </p>
      <p className='text-sm font-normal text-gray-200 text-center'>
        Happy chatting and connecting!
      </p>
    </div>
  );
};
export default WelcomeMessage;
