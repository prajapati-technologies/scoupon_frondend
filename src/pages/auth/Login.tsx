import PublicLayout from '../../components/layout/PublicLayout';
import { Helmet } from 'react-helmet-async';
import LoginForm from './form/LoginForm';

const LoginPage = () => {
  return (
    <PublicLayout>
      <Helmet>
        <title>Login to Your Account | CoreAeration</title>
        <meta name="description" content="Sign in to your CoreAeration.com vendor account to manage your listing, edit your business details, and track your presence in the USA aeration directory." />
      </Helmet>
      <LoginForm />
    </PublicLayout>
  );
};

export default LoginPage;