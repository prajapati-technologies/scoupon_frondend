import Header from '../components/home/Header';
import Footer from '../components/home/Footer';
import ForgetForm from './form/ForgetForm';

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <ForgetForm />

      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;