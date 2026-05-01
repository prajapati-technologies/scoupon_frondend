import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Loading } from "../../Loading";

const PaymentCancelHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [processing, setProcessing] = useState(true);
    
    useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      const orderId = searchParams.get('transactionId') || searchParams.get('orderId');
      if (!orderId) {
        toast.error('No transaction ID provided');
        navigate('/vendor/subscriptions');
        return;
      }
      
      if (orderId) {
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/transactions/payment-cancel`, {transactionId: orderId })
          .then(response => {
            navigate(response.data.redirectUrl || '/vendor/subscriptions');
          })
          .catch(() => {
            toast.error('Could not verify payment');
            navigate('/vendor/subscriptions');
          })
          .finally(() => {
            setProcessing(false);
          });
      } else {
        navigate('/vendor/dashboard');
      }
    }, []);
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        {processing && <Loading />}
        <ToastContainer />
      </div>
    );
  };
  export default PaymentCancelHandler;