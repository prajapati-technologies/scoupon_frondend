import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';
import { AdminDashboardLayout } from '../layout/AdminDashboardLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';

interface CreatePackageForm {
  name: string;
  price: number;
  duration: number;
  status: 'ACTIVE' | 'INACTIVE';
  profiles: number;
  description: string;
}

const CreatePackage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreatePackageForm>({
    name: '',
    price: 0,
    duration: 1,
    status: 'ACTIVE',
    profiles: 0,
    description: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'duration' || name === 'profiles' 
        ? Number(value) 
        : value
    }));
  };

  const handleStatusChange = (value: 'ACTIVE' | 'INACTIVE') => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const token = localStorage.getItem('token');
        console.log("object Token",token);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/packages`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success('Package created successfully');
      navigate('/admin/packages');
    } catch (error) {
      toast.error('Failed to create package');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminDashboardLayout title="Create Package" user={user}>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create New Package</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Package Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter package name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profiles">Zipcodes</Label>
                <Input
                  id="profiles"
                  name="profiles"
                  type="number"
                  min="1"
                  value={formData.profiles}
                  onChange={handleChange}
                  placeholder="Enter number of zipcodes"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Year)</Label>
                  <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Enter duration in Year"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/packages')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#a0b830] hover:bg-[#8fa029]"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Package'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <ToastContainer />
      </div>
    </AdminDashboardLayout>
  );
};

export default CreatePackage;