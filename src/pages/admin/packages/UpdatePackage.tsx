import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';
import { AdminDashboardLayout } from '../layout/AdminDashboardLayout';
import { Textarea } from '../../../components/ui/textarea';

interface UpdatePackageForm {
  name: string;
  price: number;
  duration: number;
  status: 'ACTIVE' | 'INACTIVE';
  description: string;
  profiles: number;
}

const UpdatePackage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdatePackageForm>({
    name: '',
    price: 0,
    duration: 1,
    status: 'ACTIVE',
    description: '',
    profiles: 3
  });

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/packages/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log("object response",response.data);
        const packageData = response.data;
        setFormData({
          name: packageData.name,
          price: packageData.price,
          duration: packageData.duration,
          status: packageData.status,
          description: packageData.description,
          profiles: packageData.profiles
        });
      } catch (error) {
        toast.error('Failed to fetch package details');
        navigate('/admin/packages');
      }
    };

    fetchPackage();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'duration' || name === 'profiles' ? Number(value) : value
    }));
  };

  const handleStatusChange = (value: 'ACTIVE' | 'INACTIVE') => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/packages/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Package updated successfully');
      navigate('/admin/packages');
    } catch (error: any) {
      console.error('Update error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to update package');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminDashboardLayout title="Update Package" user={user}>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Update Package</CardTitle>
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
              <div className='space-y-2'>
                <Label htmlFor='profiles'>Profiles</Label>
                <Input
                  id='profiles'
                  name='profiles'
                  type='number'
                  min='3'
                  value={formData.profiles}
                  onChange={handleChange}
                  placeholder='Enter number of profiles'
                  required
                />  
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (months)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Enter duration in months"
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
                  {loading ? 'Updating...' : 'Update Package'}
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

export default UpdatePackage;