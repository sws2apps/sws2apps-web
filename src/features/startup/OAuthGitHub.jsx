import { GithubAuthProvider } from 'firebase/auth';
import OAuthButtonBase from './OAuthButtonBase';
import githubIcon from '../../img/github.svg';

const provider = new GithubAuthProvider();

const OAuthGitHub = () => {
  return (
    <OAuthButtonBase
      provider={provider}
      text="Continue with GitHub"
      buttonStyles={{
        backgroundColor: '#2F2F2F',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#2F2F2F',
          color: '#FFFFFF',
        },
      }}
      logo={githubIcon}
    />
  );
};

export default OAuthGitHub;
