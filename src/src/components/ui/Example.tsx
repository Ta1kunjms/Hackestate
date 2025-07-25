import React from 'react';
import { Button, Input, Card, CardBody, Modal } from './index';

export const ExampleComponents: React.FC = () => {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">UI Components Preview</h2>
      
      {/* Button Examples */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Buttons</h3>
        <div className="flex gap-2">
          <Button variant="filled" color="blue">Primary</Button>
          <Button variant="outlined" color="green">Secondary</Button>
          <Button variant="text" color="red">Text</Button>
        </div>
      </div>

      {/* Input Example */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Input</h3>
        <Input type="email" placeholder="Enter your email" />
      </div>

      {/* Card Example */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Card</h3>
        <Card className="max-w-sm">
          <CardBody>
            <h4 className="text-lg font-semibold mb-2">Property Card</h4>
            <p className="text-gray-600">
              This is an example of a Material Tailwind card component for property listings.
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Modal Example */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Modal</h3>
        <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Example Modal"
          footer={
            <Button onClick={() => setModalOpen(false)} variant="text">
              Close
            </Button>
          }
        >
          <p>This is an example modal using Material Tailwind components.</p>
        </Modal>
      </div>
    </div>
  );
};

export default ExampleComponents; 