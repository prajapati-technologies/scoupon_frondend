import { useState, useEffect } from 'react';
import { Copy, Check, Calendar, MapPin, Gift, Sparkles } from 'lucide-react';
import Header from './components/home/Header';
import Footer from './components/home/Footer';

// Define the Promo type
interface Promo {
  id: string;
  title: string;
  description?: string;
  code: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  maxZipCode?: string;
}

// Promo Card Component
const PromoCard = ({ promo }: { promo: Promo }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promo.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const isActive = () => {
    if (typeof promo.isActive === 'boolean') {
      return promo.isActive;
    }

    const now = new Date();
    const start = new Date(promo.startDate);
    const end = new Date(promo.endDate);
    return now >= start && now <= end;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-lime-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Status badge */}
      <div className="absolute top-4 right-4 z-10">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            isActive()
              ? 'bg-lime-100 text-lime-800 border border-lime-200'
              : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}
        >
          {isActive() ? 'ACTIVE' : 'EXPIRED'}
        </span>
      </div>

      <div className="relative p-8">
        {/* Promo header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-500 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                {promo.title}
              </h3>
            </div>
          </div>
          {/* Description */}
          {promo.description && (
            <p className="text-gray-600 text-sm leading-relaxed">{promo.description}</p>
          )}
        </div>

        {/* Promo code */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border-2 border-dashed border-gray-200 group-hover:border-lime-300 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                  Promo Code
                </p>
                <p className="text-2xl font-mono font-bold text-gray-900 tracking-wider">
                  {promo.code}
                </p>
              </div>
              <button
                onClick={handleCopy}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  copied
                    ? 'bg-lime-100 text-lime-700 border border-lime-200'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span className="text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span className="text-sm">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-gray-600">
            <div className="w-8 h-8 rounded-lg bg-lime-100 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-lime-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                Coverage Area
              </p>
              <p className="text-sm font-medium">Up to ZIP {promo.maxZipCode}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-gray-600">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                Valid Period
              </p>
              <p className="text-sm font-medium">
                {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading component
const LoadingPromos = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(6)].map((_, index) => (
      <div
        key={index}
        className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden animate-pulse"
      >
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gray-200"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-2xl p-4 mb-6">
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const PromoPage = () => {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPromos = async () => {
    try {
      setLoading(true);
      setError(null);

      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        throw new Error('Backend URL not configured. Please set VITE_BACKEND_URL environment variable.');
      }

      const response = await fetch(`${backendUrl}/promos/active`);
      if (!response.ok) {
        throw new Error(`Failed to fetch promotions: ${response.status} ${response.statusText}`);
      }

      const data: Promo[] = await response.json();
      setPromos(data);
    } catch (err: any) {
      console.error('Error fetching promos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Available{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-lime-500">
                Promotions
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse our collection of exclusive promotional codes. Click copy to grab the code and use it during your
              next transaction.
            </p>
          </div>

          {loading && <LoadingPromos />}

          {!loading && error && (
            <div className="text-center py-12">
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          )}

          {!loading && !error && promos.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Promotions</h3>
              <p className="text-gray-600">Check back later for new promotional offers.</p>
            </div>
          )}

          {!loading && !error && promos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {promos.map((promo) => (
                <PromoCard key={promo.id} promo={promo} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PromoPage;