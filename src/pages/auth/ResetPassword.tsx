import Header from '../components/home/Header';
import Footer from '../components/home/Footer';
import ResetForm from './form/ResetForm';

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <ResetForm />
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;