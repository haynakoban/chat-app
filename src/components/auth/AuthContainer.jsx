import login from '../../assets/login_ui.svg';
import chat from '../../assets/chat.svg';
import typing from '../../assets/typing.svg';
import solving from '../../assets/solving.svg';
import styled from 'styled-components';

const AuthStyle = styled.div`
  background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.25),
      rgba(0, 0, 0, 0.25)
    ),
    url(${solving}) top left / 50% 50% no-repeat,
    url(${chat}) top right / 50% 50% no-repeat,
    url(${login}) bottom left / 50% 50% no-repeat,
    url(${typing}) bottom right / 50% 50% no-repeat;

  @media (max-width: 768px) {
    background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.25),
        rgba(0, 0, 0, 0.25)
      ),
      url(${solving}) top left / 100% 40% no-repeat,
      url(${chat}) top right / 100% 0% no-repeat,
      url(${login}) bottom left / 100% 40% no-repeat,
      url(${typing}) bottom right / 100% 0% no-repeat;
  }
`;

const AuthContainer = ({ children }) => {
  return (
    <AuthStyle className='h-[calc(100vh_-_4rem)] sm:h-[calc(100vh_-_5rem)] flex justify-center items-center'>
      <div className='w-full sm:w-[500px] shadow-md shadow-gray-400 rounded-lg p-4 sm:p-8 border-t-2 bg-[#F2F2F2]'>
        {children}
      </div>
    </AuthStyle>
  );
};
export default AuthContainer;
