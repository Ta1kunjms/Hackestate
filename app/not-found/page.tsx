import React from 'react';
import ErrorPage from '../error/page';

const NotFoundPage: React.FC = () => {
  return (
    <ErrorPage 
      errorCode={404}
      title="Page Not Found"
      message="The page you're looking for might have been moved, deleted, or you entered the wrong URL."
    />
  );
};

export default NotFoundPage; 