import { Gem } from "lucide-react";
import { Link } from "react-router-dom";

export type UserRole = 'ADMIN' | 'VENDOR' | 'SUBADMIN' | 'SUPERADMIN';
export type VendorType = 'VENDOR' | 'RENTAL' | 'SALES';
export type Roles = 'Approval' | 'Create' | 'Editing' | 'Deletion'; 
export type Routes = '/admin/create-user' | '/admin/packages' | '/admin/promos' | '/admin/users'; 
export interface Zipcode {
    id: number;
    zipcode: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
}

export interface Package {
    id: number;
    name: string;
    zipcodes: number;
    price: number;
    description: string;
}

export interface  User {
  id: number;
  email: string;
  name: string;
  phone: string;
  utype: UserRole;
  status: string;
  company?: string;
  businessName?: string;
  state?: string;
  city?: string;
  address?: string;
  country?: string;
  companyLogo?: string;
  fb?: string;
  ln?: string;
  in?: string;
  yt?: string;
  webUrl?: string;
  totalzipcodes?: number;
  addedzipcodes?: number;
  about?: string;
  createdAt: Date;
  packageActive: string;
  vendorType?: VendorType;
  package?: Package;
  gallery?: Gallery[];
  permissions?:Permission[];
  routes?:Route[];
  subscribe_packages?: SubscribePackage[];
}

export interface SubscribePackage {
  id: number;
  name: string;
  price: number;
  description: string;
  zipCodes: Zipcode[];
  status: string;
  startDate: string;
  endDate: string;
  packageId: number;
  userId: number;
  stripeSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Gallery {
  id: number;
  image: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface Permission {
  id: number;
  userId: number;
  name: Roles;
  createdAt: Date;
  updatedAt: Date;
}
export interface Route {
  id: number;
  userId: number;
  name: Routes;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: User, token: string) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    initialize: () => void;
  }

  export interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
  }
  interface PromoLinkProps {
    user: User | null;
    isActiveRoute: (path: string) => boolean;
  }

  const PromoLink: React.FC<PromoLinkProps> = ({ user, isActiveRoute }) => {
    // Check if user has permission
    const hasPermission = (permissionName: Roles): boolean => {
      if (!user?.permissions) return false;
      return user.permissions.some(permission => permission.name === permissionName);
    };
  
    // Check if user can access promo section
    const canAccessPromo = (): boolean => {
      if (!user) return false;
      
      // ADMIN and SUPERADMIN have full access
      if (user.utype === 'SUPERADMIN') {
        return true;
      }
      
      // SUBADMIN needs specific permissions
      if (user.utype === 'ADMIN' || user.utype === 'SUBADMIN') {
        return hasPermission('Approval') && hasPermission('Create') && 
               hasPermission('Editing') && 
               hasPermission('Deletion');
      }
      
      return false;
    };
  
    return (
      <>
        {canAccessPromo() && (
          <Link
            to="/admin/promos"
            className={`flex items-center w-full px-4 py-2 rounded-md ${
              isActiveRoute("/admin/promos")
                ? "bg-[#a0b830] text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <Gem className="mr-2 h-4 w-4" />
            Promo
          </Link>
        )}
      </>
    );
  };
  
  export default PromoLink;
  