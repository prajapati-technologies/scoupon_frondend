import React, { useState } from 'react';
import { useAuth } from '../../../useAuth';
import { AdminDashboardLayout } from '../layout/AdminDashboardLayout';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Upload, Download, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

interface ImportResult {
  successful: Array<{
    row: any;
    user: any;
  }>;
  failed: Array<{
    row: any;
    error: string;
  }>;
  totalProcessed: number;
}

const ImportUsers = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showSampleFormat, setShowSampleFormat] = useState(false);

  // Check if user is SUPERADMIN
  if (user?.utype !== 'SUPERADMIN') {
    return (
      <AdminDashboardLayout title="Import Users" user={user}>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Access Denied</div>
          <p>Only super admins can access this page.</p>
        </div>
      </AdminDashboardLayout>
    );
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setImportResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a CSV file first');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('csvFile', selectedFile);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/admin/import-csv`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setImportResult(response.data.data);
      toast.success(response.data.message);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to import users';
      toast.error(errorMessage);
      console.error('Import error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadSampleCsv = () => {
    const sampleData = [
      'name,email,phone,password,utype,status,permissions,routes',
      'John Admin,john@example.com,1234567890,password123,ADMIN,ACTIVE,"Approval,Create,Editing","/admin/create-user,/admin/packages"',
      'Jane SubAdmin,jane@example.com,0987654321,password456,SUBADMIN,PENDING,"Approval,Editing","/admin/users,/admin/tickets"'
    ].join('\n');

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-users-import.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminDashboardLayout title="Import Users" user={user}>
      <div className="space-y-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <h1 className="text-2xl font-bold">Import Users from CSV</h1>
            <p className="text-gray-600">Bulk create admin and sub-admin users with their permissions and routes</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sample Format Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">CSV Format Requirements</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowSampleFormat(!showSampleFormat)}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  {showSampleFormat ? 'Hide' : 'Show'} Format
                </Button>
              </div>

              {showSampleFormat && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p><strong>Required columns:</strong> name, email, password, utype</p>
                      <p><strong>Optional columns:</strong> phone, status, permissions, routes</p>
                      <p><strong>User types:</strong> ADMIN, SUBADMIN</p>
                      <p><strong>Status options:</strong> PENDING, ACTIVE, SUSPENDED, BLOCKED</p>
                      <p><strong>Permissions:</strong> Approval, Create, Editing, Deletion (comma-separated)</p>
                      <p><strong>Routes:</strong> /admin/create-user, /admin/packages, /admin/users, /admin/promos, /admin/tickets (comma-separated)</p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                variant="outline"
                onClick={downloadSampleCsv}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Sample CSV
              </Button>
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="csvFile" className="block text-sm font-medium text-gray-700 mb-2">
                  Select CSV File
                </Label>
                <Input
                  id="csvFile"
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="block w-full"
                  disabled={isUploading}
                />
              </div>

              {selectedFile && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{selectedFile.name}</span>
                  <span className="text-xs text-gray-500">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {isUploading ? 'Importing...' : 'Import Users'}
              </Button>
            </div>

            {/* Import Results */}
            {importResult && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Import Results</h3>
                
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{importResult.totalProcessed}</div>
                    <div className="text-sm text-blue-600">Total Processed</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{importResult.successful.length}</div>
                    <div className="text-sm text-green-600">Successful</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{importResult.failed.length}</div>
                    <div className="text-sm text-red-600">Failed</div>
                  </div>
                </div>

                {/* Successful Imports */}
                {importResult.successful.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-600 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Successfully Created Users ({importResult.successful.length})
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {importResult.successful.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">
                            {item.user.name} ({item.user.email}) - {item.user.utype}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Failed Imports */}
                {importResult.failed.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-red-600 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Failed Imports ({importResult.failed.length})
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {importResult.failed.map((item, index) => (
                        <div key={index} className="p-2 bg-red-50 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm font-medium">
                              {item.row.name || 'Unknown'} ({item.row.email || 'No email'})
                            </span>
                          </div>
                          <div className="text-xs text-red-600 ml-6">{item.error}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
};

export default ImportUsers;