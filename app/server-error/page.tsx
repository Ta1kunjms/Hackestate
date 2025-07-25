import React from 'react';
import ErrorPage from './ErrorPage';

const ServerErrorPage: React.FC = () => {
  return (
    <ErrorPage 
      errorCode={500}
      title="Internal Server Error"
      message="We're experiencing some technical difficulties. Our team has been notified and is working on a fix."
    />
  );
};

export default ServerErrorPage; 