import { OAuthProvider } from 'firebase/auth';
import OAuthButtonBase from './OAuthButtonBase';
import yahooIcon from '../../img/yahoo.svg';

const provider = new OAuthProvider('yahoo.com');

const OAuthYahoo = () => {
  return (
    <OAuthButtonBase
      provider={provider}
      text="Continue with Yahoo"
      buttonStyles={{
        backgroundColor: '#7E1FFF',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#7E1FFF',
          color: '#FFFFFF',
        },
      }}
      logo={yahooIcon}
    />
  );
};

export default OAuthYahoo;
