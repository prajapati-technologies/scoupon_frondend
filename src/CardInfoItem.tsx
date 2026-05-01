import { Building2 } from "lucide-react";

const CardInfoItem = ({ 
    label, 
    value, 
    icon: Icon = Building2 
  }: { 
    label: string; 
    value?: string | null; 
    icon?: any;
  }) => {
    if (!value) return null;
    
    return (
      <div className="space-y-1">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-800 font-medium flex items-center">
          <Icon className="w-4 h-4 mr-2 text-gray-400" />
          {value}
        </p>
      </div>
    );
  };

  export default CardInfoItem;