import React, { useState, useEffect } from 'react';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PhotoIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  HomeIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';
import { Button, Card, Input, Modal, Select, Textarea } from '../ui';
import { ActionGuard } from './PermissionGuard';
import { UserRole } from '../../utils/permissions';

interface Property {
  id: string;
  title: string;
  type: 'house' | 'condo' | 'apartment' | 'land' | 'commercial';
  status: 'active' | 'pending' | 'sold' | 'rented';
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  images: string[];
  features: string[];
  createdAt: string;
  updatedAt: string;
  agentId?: string;
  developerId?: string;
  sellerId?: string;
}

interface PropertiesManagerProps {
  userRole: UserRole;
  userId: string;
}

const PropertiesManager: React.FC<PropertiesManagerProps> = ({ userRole, userId }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    type: 'house' as Property['type'],
    status: 'pending' as Property['status'],
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    description: '',
    features: [] as string[]
  });

  // Mock data loading
  useEffect(() => {
    const loadProperties = async () => {
      // Simulate API call
      const mockProperties: Property[] = [
        {
          id: '1',
          title: 'Modern 3BR Condo in BGC',
          type: 'condo',
          status: 'active',
          price: 8500000,
          location: 'Bonifacio Global City, Taguig',
          bedrooms: 3,
          bathrooms: 2,
          area: 85,
          description: 'Beautiful modern condo with city views, fully furnished with premium amenities.',
          images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
          features: ['Swimming Pool', 'Gym', 'Parking', 'Security'],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-16T14:30:00Z',
          agentId: userRole === 'agent' ? userId : undefined,
          developerId: userRole === 'developer' ? userId : undefined,
          sellerId: userRole === 'seller' ? userId : undefined
        },
        {
          id: '2',
          title: 'Luxury House in Alabang',
          type: 'house',
          status: 'pending',
          price: 25000000,
          location: 'Alabang, Muntinlupa',
          bedrooms: 4,
          bathrooms: 3,
          area: 200,
          description: 'Spacious family home with garden and pool, perfect for large families.',
          images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
          features: ['Garden', 'Pool', 'Garage', 'Security System'],
          createdAt: '2024-01-10T09:00:00Z',
          updatedAt: '2024-01-15T16:20:00Z',
          agentId: userRole === 'agent' ? userId : undefined,
          developerId: userRole === 'developer' ? userId : undefined,
          sellerId: userRole === 'seller' ? userId : undefined
        }
      ];

      setProperties(mockProperties);
      setFilteredProperties(mockProperties);
      setIsLoading(false);
    };

    loadProperties();
  }, [userRole, userId]);

  // Filter properties
  useEffect(() => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => property.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(property => property.type === typeFilter);
    }

    setFilteredProperties(filtered);
  }, [properties, searchTerm, statusFilter, typeFilter]);

  const handleAddProperty = () => {
    setEditingProperty(null);
    setFormData({
      title: '',
      type: 'house',
      status: 'pending',
      price: '',
      location: '',
      bedrooms: '',
      bathrooms: '',
      area: '',
      description: '',
      features: []
    });
    setShowModal(true);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      type: property.type,
      status: property.status,
      price: property.price.toString(),
      location: property.location,
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      area: property.area.toString(),
      description: property.description,
      features: [...property.features]
    });
    setShowModal(true);
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      // Simulate API call
      setProperties(properties.filter(p => p.id !== propertyId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProperty: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'images'> = {
      title: formData.title,
      type: formData.type,
      status: formData.status,
      price: parseFloat(formData.price),
      location: formData.location,
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      area: parseFloat(formData.area),
      description: formData.description,
      features: formData.features,
      agentId: userRole === 'agent' ? userId : undefined,
      developerId: userRole === 'developer' ? userId : undefined,
      sellerId: userRole === 'seller' ? userId : undefined
    };

    if (editingProperty) {
      // Update existing property
      const updatedProperties = properties.map(p =>
        p.id === editingProperty.id
          ? { ...p, ...newProperty, updatedAt: new Date().toISOString() }
          : p
      );
      setProperties(updatedProperties);
    } else {
      // Add new property
      const newPropertyWithId: Property = {
        ...newProperty,
        id: Date.now().toString(),
        images: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setProperties([...properties, newPropertyWithId]);
    }

    setShowModal(false);
  };

  const getStatusColor = (status: Property['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'rented': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Property['type']) => {
    switch (type) {
      case 'house': return <HomeIcon className="h-5 w-5" />;
      case 'condo': return <BuildingOfficeIcon className="h-5 w-5" />;
      case 'apartment': return <HomeIcon className="h-5 w-5" />;
      case 'land': return <MapPinIcon className="h-5 w-5" />;
      case 'commercial': return <BuildingOfficeIcon className="h-5 w-5" />;
      default: return <HomeIcon className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Properties Management</h2>
          <p className="text-gray-600">Manage your property listings</p>
        </div>
        <ActionGuard role={userRole} action="create" resource="properties">
          <Button onClick={handleAddProperty} className="flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Add Property
          </Button>
        </ActionGuard>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </Select>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="apartment">Apartment</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </Select>
        </div>
      </Card>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-200 relative">
              {property.images.length > 0 ? (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <PhotoIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                  {property.status}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {property.title}
                </h3>
                <div className="flex items-center text-gray-500">
                  {getTypeIcon(property.type)}
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{property.location}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold text-blue-600">
                  ₱{(property.price / 1000000).toFixed(1)}M
                </span>
                <div className="text-sm text-gray-500">
                  {property.bedrooms} bed • {property.bathrooms} bath • {property.area} sqm
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Updated {new Date(property.updatedAt).toLocaleDateString()}
                </span>
                                 <div className="flex items-center gap-2">
                  <ActionGuard role={userRole} action="edit" resource="properties">
                    <Button
                      variant="text"
                      size="sm"
                      onClick={() => handleEditProperty(property)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  </ActionGuard>
                  <ActionGuard role={userRole} action="delete" resource="properties">
                    <Button
                      variant="text"
                      size="sm"
                      onClick={() => handleDeleteProperty(property.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </ActionGuard>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <Card className="p-12 text-center">
          <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by adding your first property'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
            <Button onClick={handleAddProperty}>
              Add Your First Property
            </Button>
          )}
        </Card>
      )}

      {/* Property Form Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingProperty ? 'Edit Property' : 'Add New Property'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Property['type'] })}
                required
              >
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="apartment">Apartment</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₱)</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <Input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
              <Input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Area (sqm)</label>
            <Input
              type="number"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit">
              {editingProperty ? 'Update Property' : 'Add Property'}
            </Button>
            <Button
              type="button"
              variant="text"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PropertiesManager; 