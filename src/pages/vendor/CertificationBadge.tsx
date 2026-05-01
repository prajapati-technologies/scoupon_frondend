import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Copy,Settings } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { useAuth } from '../../useAuth';
import { DashboardLayout } from './DashboardLayout';
import BadgePreview from '../../components/BadgePreview';

interface BadgeSettings {
  position: 'BOTTOM_RIGHT' | 'BOTTOM_LEFT' | 'TOP_RIGHT' | 'TOP_LEFT' | 'BOTTOM_CENTER';
  size: 'SMALL' | 'MEDIUM' | 'LARGE';
  showLogo: boolean;
  showAppreciationStatus: boolean;
}

interface BadgeResponse {
  data: {
    script: string;
    badgeData: {
      badgeHtml: string;
      imageHtml: string;
      previewUrl: string;
      badgeType: string;
    };
    badgeInstructions: {
      title: string;
      steps: string[];
      notes: string[];
    };
    instructions: {
      title: string;
      steps: string[];
      notes: string[];
    };
  };
}

const CertificationBadge = () => {
  const { user } = useAuth();
  const [badgeScript, setBadgeScript] = useState<string>('');
  const [instructions, setInstructions] = useState<{
    title: string;
    steps: string[];
    notes: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<BadgeSettings>({
    position: 'BOTTOM_RIGHT',
    size: 'MEDIUM',
    showLogo: true,
    showAppreciationStatus: true
  });
  const [badgeData, setBadgeData] = useState<{
    badgeHtml?: string;
    imageHtml?: string;
    previewUrl?: string;
    badgeType?: string;
    badgeInstructions?: {
      title: string;
      steps: string[];
      notes: string[];
    };
  } | null>(null);

  const generateBadge = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get<BadgeResponse>(`${import.meta.env.VITE_BACKEND_URL}/vendor/badge/script`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("first data",response.data);
      
      setBadgeScript(response.data.data.script);
      setBadgeData(response.data.data.badgeData);
      setInstructions(response.data.data.instructions);
      toast.success('Certified Vendor Badge script generated successfully!');
    } catch (error) {
      console.error('Error generating badge:', error);
      toast.error('Failed to generate badge script');
    } finally {
      setLoading(false);
    }
  };

  const customizeBadge = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post<BadgeResponse>(
        `${import.meta.env.VITE_BACKEND_URL}/vendor/badge/customize`,
        settings,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      setBadgeData(response.data.data.badgeData);
      setBadgeScript(response.data.data.script);
      setInstructions(response.data.data.instructions);
      toast.success('Badge customized successfully!');
    } catch (error) {
      console.error('Error customizing badge:', error);
      toast.error('Failed to customize badge');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  // const downloadScript = () => {
  //   const blob = new Blob([badgeScript], { type: 'text/javascript' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'certified-vendor-badge.js';
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   URL.revokeObjectURL(url);
  //   toast.success('Script downloaded!');
  // };



  useEffect(() => {
    // Generate initial badge on component mount
    generateBadge();
  }, []);

  return (
    <DashboardLayout title="Certified Vendor Badge" user={user}>
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Certified Vendor Badge</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Display your certified vendor status on your website with our professional badge. 
            This badge shows visitors that you are a verified and trusted vendor partner.
          </p>
        </div>

        {/* Customization Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Badge Customization
            </CardTitle>
            <CardDescription>
              Customize the appearance and position of your certified vendor badge
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Position</label>
                <Select
                  value={settings.position}
                  onValueChange={(value: BadgeSettings['position']) =>
                    setSettings({ ...settings, position: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BOTTOM_RIGHT">Bottom Right</SelectItem>
                    <SelectItem value="BOTTOM_LEFT">Bottom Left</SelectItem>
                    <SelectItem value="BOTTOM_CENTER">Bottom Center</SelectItem>
                    <SelectItem value="TOP_RIGHT">Top Right</SelectItem>
                    <SelectItem value="TOP_LEFT">Top Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Size</label>
                <Select
                  value={settings.size}
                  onValueChange={(value: BadgeSettings['size']) =>
                    setSettings({ ...settings, size: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SMALL">Small</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LARGE">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Show Logo</label>
              <Switch
                checked={settings.showLogo}
                onCheckedChange={(checked) => setSettings({ ...settings, showLogo: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Show Certification Status</label>
              <Switch
                checked={settings.showAppreciationStatus}
                onCheckedChange={(checked) => setSettings({ ...settings, showAppreciationStatus: checked })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={customizeBadge} disabled={loading} className="w-full">
                {loading ? 'Generating...' : 'Apply Settings'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Debug Section - Remove this in production */}
        {/* <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Debug Info (Remove in Production)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><strong>Badge Data:</strong> {badgeData ? 'Present' : 'Not present'}</div>
              <div><strong>Badge HTML:</strong> {badgeData?.badgeHtml ? 'Present' : 'Not present'}</div>
              <div><strong>Badge Script:</strong> {badgeScript ? 'Present' : 'Not present'}</div>
              <div><strong>Instructions:</strong> {instructions ? 'Present' : 'Not present'}</div>
              {badgeData && (
                <div className="mt-2 p-2 bg-white rounded border">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(badgeData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card> */}

        {/* Generated Script */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Generated Script</CardTitle>
            <CardDescription>
              Copy this script and paste it into your website's HTML
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {badgeScript ? (
              <>
                <div className="relative">
                  <textarea
                    value={badgeScript}
                    readOnly
                    className="w-full min-h-[200px] p-4 font-mono text-sm border rounded-md bg-gray-50"
                    placeholder="Badge script will appear here..."
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(badgeScript)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => copyToClipboard(badgeScript)}
                    className="flex items-center gap-2 flex-1"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Script
                  </Button>
                  <Button
                    variant="outline"
                    onClick={downloadScript}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Generate your certified vendor badge script to get started</p>
              </div>
            )}
          </CardContent>
        </Card> */}

        {/* Badge */}
        {badgeData?.badgeHtml && (
          <Card>
            <CardHeader>
              <CardTitle>Certified Vendor Badge</CardTitle>
              <CardDescription>
                Use this larger badge for main content areas or full-width displays
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Badge HTML Code:</h4>
                  <div className="relative">
                    <textarea
                      value={badgeData.badgeHtml}
                      readOnly
                      className="w-full min-h-[120px] p-3 font-mono text-sm border rounded-md bg-gray-50"
                      placeholder="Badge HTML will appear here..."
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(badgeData.badgeHtml!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(badgeData.badgeHtml!)}
                    className="mt-2 w-full"
                    variant="outline"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Badge Code
                  </Button>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Preview:</h4>
                  <div className="border rounded-md p-4 bg-gray-50 min-h-[120px] flex items-center justify-center">
                    {badgeData?.badgeType ? (
                      <BadgePreview
                        vendorType={
                          badgeData.badgeType === 'Equipment Rental' ? 'RENTAL' : 
                          badgeData.badgeType === 'Equipment Sales' ? 'SALES' : 
                          'VENDOR'
                        }
                        vendorId={user?.id || 0}
                        zipcode={(() => {
                          // Find the first active package that has at least one zipcode
                          const activePackageWithZipcodes = user?.subscribe_packages?.find(
                            pkg => pkg.status === 'ACTIVE' && pkg.zipCodes && pkg.zipCodes.length > 0
                          );
                          return activePackageWithZipcodes?.zipCodes?.[0]?.zipcode;
                        })()}
                      />
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-gray-600">
                          This is a placeholder for the certified vendor badge preview.
                          The actual badge will display your vendor status.
                        </p>
                        <p className="text-xs text-gray-500">
                          Click the "Apply Settings" button to generate the badge script.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-xs text-gray-600 mb-2">This is exactly how your badge will appear on your website</p>
                    <p className="text-xs text-gray-500">Click the badge to see the hover effect and redirect behavior</p>
                  </div>
                </div>
              </div>

              {/* Add a section to show the image HTML as well */}
              {badgeData.imageHtml && (
                <div className="mt-4 p-4 bg-green-50 rounded-md">
                  <h4 className="font-medium mb-2 text-green-900">Direct Image HTML (Alternative)</h4>
                  <p className="text-sm text-green-700 mb-2">
                    You can also use this direct image HTML instead of the badge for more control over styling.
                  </p>
                  <div className="relative">
                    <textarea
                      value={badgeData.imageHtml}
                      readOnly
                      className="w-full min-h-[80px] p-3 font-mono text-sm border rounded-md bg-gray-50"
                      placeholder="Image HTML will appear here..."
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(badgeData.imageHtml!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(badgeData.imageHtml!)}
                    className="mt-2"
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Image HTML
                  </Button>
                </div>
              )}

              {/* Instructions section */}
              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <h4 className="font-medium mb-2 text-blue-900">How to Use Your Certified Vendor Badge</h4>
                <div className="space-y-2">
                  <div>
                    <h5 className="font-medium text-sm text-blue-800 mb-1">Steps:</h5>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                      <li>Copy the badge HTML code above</li>
                      <li>Paste it anywhere in your website HTML where you want the badge to appear</li>
                      <li>The badge will display as a large, professional certification badge</li>
                      <li>Visitors can click the badge to view your vendor profile</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm text-blue-800 mb-1">Notes:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                      <li>The badge is larger in height and perfect for main content areas</li>
                      <li>Shows your certified vendor status with professional design</li>
                      <li>Automatically updates when your certification status changes</li>
                      <li>You can also use the direct image HTML for more control</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Installation Instructions */}
        {(instructions || badgeScript) && (
          <Card>
            <CardHeader>
              <CardTitle>Installation Instructions</CardTitle>
              <CardDescription>
                Follow these steps to add the certified vendor badge to your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              {instructions ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Steps:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                      {instructions.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Notes:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {instructions.notes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Steps:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                      <li>Copy the JavaScript code above</li>
                      <li>Paste it before the closing &lt;/body&gt; tag in your website HTML</li>
                      <li>The certified vendor badge will automatically appear in the selected position</li>
                      <li>Visitors can click the badge to view your vendor profile</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Notes:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      <li>The badge is responsive and will work on all devices</li>
                      <li>Shows your certified vendor status</li>
                      <li>The badge design matches your company branding</li>
                    </ul>
                  </div>
                </div>
              )}
              <Button
                variant="outline"
                onClick={() => copyToClipboard(instructions ? JSON.stringify(instructions, null, 2) : 'Installation instructions for certified vendor badge')}
                className="mt-4 flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Instructions
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CertificationBadge;