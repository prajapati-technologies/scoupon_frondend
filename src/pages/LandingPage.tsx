import PublicLayout from '../components/layout/PublicLayout';
import BusinessCard from './components/home/BusinessCard';
import { useAuth } from '../useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import FAQ from './components/home/FAQ';

const LandingPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to hash section (e.g., #faq) when navigating from another page
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  // Only redirect if user is authenticated and this is their first visit
  // Allow users to stay on public pages if they want to
  useEffect(() => {
    // Check if user has explicitly chosen to stay on public pages
    const stayOnPublic = sessionStorage.getItem('stayOnPublic');
    
    if (isAuthenticated && user && !stayOnPublic) {
      switch (user.utype) {
        case 'SUPERADMIN':
        case 'ADMIN':
        case 'SUBADMIN':
          navigate('/admin/dashboard');
          break;
        case 'VENDOR':
          navigate('/vendor/dashboard');
          break;
        default:
          // Don't redirect, just stay on landing page
          break;
      }
    }
  }, [isAuthenticated, user, navigate]);
  
  return (
    <PublicLayout>
      <Helmet>
        <title>Find Lawn Care Companies, Rental Aerators &amp; Vendors Near You</title>
        <meta name="description" content="Where can I find a lawn care company, rental aerator, or vendor nearby? Our core aeration directory lists trusted sales and rental providers. Search by location and get a healthy lawn fast." />
      </Helmet>
      <FAQ />
      <BusinessCard />
    </PublicLayout>
  );
};

export default LandingPage;