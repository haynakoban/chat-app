import { useNavigate } from 'react-router-dom';

const CreateNewConversation = () => {
  const navigate = useNavigate();

  return (
    <div className='flex justify-between items-center p-5'>
      <p className='block text-md font-medium text-white'>Chat</p>

      {/* create new conversation */}
      <button
        className='z-0'
        type='button'
        onClick={() => navigate('/compose')}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-6 h-6 text-gray-300 cursor-pointer '
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
          />
        </svg>
      </button>
    </div>
  );
};
export default CreateNewConversation;