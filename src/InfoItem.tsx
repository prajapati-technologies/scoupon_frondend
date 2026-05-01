// Update the InfoItem component type definition
const InfoItem = ({ 
    icon: Icon, 
    label, 
    value, 
    isLink = false 
  }: { 
    icon: any; 
    label: string; 
    value: string | null | undefined; // Add undefined to the type
    isLink?: boolean;
  }) => {
    if (!value) return null;
    
    return (
      <div className="flex items-start space-x-3">
        <Icon className="w-5 h-5 text-gray-500 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          {isLink ? (
            <a 
              href={value.startsWith('http') ? value : `https://${value}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {value}
            </a>
          ) : (
            <p className="text-gray-800 break-words">{value}</p>
          )}
        </div>
      </div>
    );
  };

  export default InfoItem;