import React, { useState } from 'react';
import { 
  PlusIcon,
  PhotoIcon,
  DocumentIcon,
  TrashIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';
import { Button, Card, Modal } from '../ui';
import { ActionGuard } from './PermissionGuard';
import { UserRole } from '../../utils/permissions';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'document';
  url: string;
  size: number;
  uploadedAt: string;
}

interface MediaLibraryProps {
  userRole: UserRole;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ userRole }) => {
  const [files, setFiles] = useState<MediaFile[]>([
    {
      id: '1',
      name: 'property-exterior.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      size: 2048576,
      uploadedAt: '2024-01-16T10:00:00Z'
    },
    {
      id: '2',
      name: 'floor-plan.pdf',
      type: 'document',
      url: '#',
      size: 1048576,
      uploadedAt: '2024-01-15T14:30:00Z'
    }
  ]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newFile: MediaFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        url: URL.createObjectURL(file),
        size: file.size,
        uploadedAt: new Date().toISOString()
      };
      setFiles([...files, newFile]);
      setShowUploadModal(false);
    }
  };

  const handleDeleteFile = (fileId: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      setFiles(files.filter(f => f.id !== fileId));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image': return <PhotoIcon className="h-8 w-8" />;
      case 'document': return <DocumentIcon className="h-8 w-8" />;
      default: return <DocumentIcon className="h-8 w-8" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
          <p className="text-gray-600">Manage your uploaded files and media</p>
        </div>
        <ActionGuard role={userRole} action="create" resource="media">
          <Button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Upload File
          </Button>
        </ActionGuard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {files.map((file) => (
          <Card key={file.id} className="overflow-hidden">
            <div className="aspect-square bg-gray-100 relative">
              {file.type === 'image' ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  {getFileIcon(file.type)}
                </div>
              )}
              <div className="absolute top-2 right-2">
                <ActionGuard role={userRole} action="delete" resource="media">
                  <Button
                    variant="text"
                    size="sm"
                    onClick={() => handleDeleteFile(file.id)}
                    className="text-red-600 hover:text-red-700 bg-white/80"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </ActionGuard>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
              <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
              <p className="text-xs text-gray-400">
                Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {files.length === 0 && (
        <Card className="p-12 text-center">
          <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded</h3>
          <p className="text-gray-600 mb-4">Get started by uploading your first file</p>
          <Button onClick={() => setShowUploadModal(true)}>
            Upload Your First File
          </Button>
        </Card>
      )}

      <Modal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload File"
      >
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Click to select files to upload
            </p>
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept="image/*,.pdf,.doc,.docx"
            />
            <label htmlFor="file-upload">
              <span className="inline-block">
                <Button>
                  Choose File
                </Button>
              </span>
            </label>
          </div>
          
          <div className="flex items-center gap-4">
            <Button onClick={() => setShowUploadModal(false)}>
              Upload
            </Button>
            <Button
              variant="text"
              onClick={() => setShowUploadModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MediaLibrary; 