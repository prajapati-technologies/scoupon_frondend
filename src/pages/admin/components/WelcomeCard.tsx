
interface WelcomeCardProps {
  user: any;
}

export const WelcomeCard = ({ user }: WelcomeCardProps) => {
    const isAdmin = user?.utype === 'ADMIN';
  return (
    <div className="w-full bg-[#a0b830] rounded-lg shadow-lg p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name}</h2>
        {isAdmin ? (
          <div className="bg-white/10 rounded-md p-4 mt-4">
            <p className="text-white/90">
              Welcome to your admin dashboard. Here you can manage vendors, packages, and monitor platform activities.
            </p>
          </div>
        ) : (
          <p className="text-white/90">Here's what's happening with your store today.</p>
        )}
      </div>
    </div>
  );
};