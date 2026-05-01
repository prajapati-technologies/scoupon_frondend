import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Loading } from "../../Loading";

const PaymentSuccessHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [processing, setProcessing] = useState(true);
    
    useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      const sessionId = searchParams.get('session_id');
      const orderId = searchParams.get('transactionId') || searchParams.get('orderId');
      
      console.log("Payment success params:", { sessionId, orderId });
      
      if (sessionId) {
        // Handle Stripe payment success
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/transactions/payment-success/stripe`, {session_id: sessionId })
          .then(response => {
            console.log("Stripe payment success response:", response);
            navigate(response.data.redirectUrl || '/vendor/subscriptions');
          })
          .catch(() => {
            console.log("Stripe payment verification failed");
            toast.error('Could not verify Stripe payment');
            navigate('/vendor/subscriptions');
          })
          .finally(() => {
            setProcessing(false);
          });
      } else if (orderId) {
        // Handle PayPal payment success
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/transactions/payment-success`, {transactionId: orderId })
          .then(response => {
            console.log("PayPal payment success response:", response);
            navigate(response.data.redirectUrl || '/vendor/subscriptions');
          })
          .catch(() => {
            console.log("PayPal payment verification failed");
            toast.error('Could not verify payment');
            navigate('/vendor/subscriptions');
          })
          .finally(() => {
            setProcessing(false);
          });
      } else {
        navigate('/vendor/subscriptions');
      }
    }, []);
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        {processing && <Loading />}
        <ToastContainer />
      </div>
    );
  };
  export default PaymentSuccessHandler;