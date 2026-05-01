import PublicLayout from '../../components/layout/PublicLayout';
import { Helmet } from 'react-helmet-async';
import RegisterForm from './form/RegisterForm';

const RegisterPage = () => {
  return (
    <PublicLayout>
      <Helmet>
        <title>Register Your Aeration Company | Core Aeration Directory</title>
        <meta name="description" content="Add your core aeration business to our growing USA directory. Reach homeowners actively searching for local aeration services and grow your customer base today." />
      </Helmet>
      <RegisterForm />
    </PublicLayout>
  );
};

export default RegisterPage;