// Admin Dashboard Utility Functions

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatCurrency = (amount: number) => {
  return `₱${(amount / 1000000).toFixed(1)}M`;
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'verified':
    case 'published':
      return 'bg-green-100 text-green-800';
    case 'pending':
    case 'draft':
      return 'bg-yellow-100 text-yellow-800';
    case 'suspended':
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}; 