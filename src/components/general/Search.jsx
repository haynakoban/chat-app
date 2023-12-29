const Search = () => {
  return (
    <div className='relative border-gray-400 border-y'>
      <input
        type='text'
        className={`block bg-[#F2F2F2] text-gray-900 text-md w-full p-3.5 focus:outline-none`}
        placeholder='Search People, Messages...'
      />
      <div className='block absolute top-[50%] right-0 translate-y-[-50%]'>
        <button type='button' className='text-gray-500 px-5 py-2.5'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
export default Search;
