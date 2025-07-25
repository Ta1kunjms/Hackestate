'use client'
import React from 'react';
import { useParams } from 'next/navigation';
import { 
  DocumentTextIcon,
  CalendarIcon,
  ArrowLeftIcon,
  HomeIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import Layout from '../../src/src/components/layout/Layout';
import Navbar from '../../src/src/components/layout/Navbar';
import Footer from '../../src/src/components/layout/Footer';
import MarkdownRenderer from '../../src/src/components/MarkdownRenderer';
import { Button } from '../../src/src/components/ui';
import { legalDocuments } from '../../src/src/content/legal';
import ErrorPage from '../error/page';

const LegalPage: React.FC = () => {
  const { docType } = useParams<{ docType: string }>();
  
  // Determine document type from URL path
  let currentDocType = docType;
  if (!currentDocType) {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('/terms')) currentDocType = 'terms';
      else if (path.includes('/privacy')) currentDocType = 'privacy';
      else if (path.includes('/cookies')) currentDocType = 'cookies';
      else if (path.includes('/accessibility')) currentDocType = 'accessibility';
    }
  }
  
  // Check if the requested document exists
  if (!currentDocType || !legalDocuments[currentDocType as keyof typeof legalDocuments]) {
    return <ErrorPage errorCode={404} />;
  }

  const document = legalDocuments[currentDocType as keyof typeof legalDocuments];

  const formatDate = (dateString: string) => {
    return new Date(`${dateString} 1, 2024`).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDocumentDescription = (type: string) => {
    switch (type) {
      case 'terms':
        return 'Our Terms of Service outline the rules and regulations for using our real estate platform and services.';
      case 'privacy':
        return 'Our Privacy Policy explains how we collect, use, and protect your personal information.';
      case 'cookies':
        return 'Our Cookie Policy details how we use cookies and similar technologies on our website.';
      case 'accessibility':
        return 'Our Accessibility Statement demonstrates our commitment to providing an inclusive digital experience.';
      default:
        return 'Important legal information regarding our services and your rights.';
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'terms':
        return 'bg-blue-100 text-blue-600';
      case 'privacy':
        return 'bg-green-100 text-green-600';
      case 'cookies':
        return 'bg-purple-100 text-purple-600';
      case 'accessibility':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Layout>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Header */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
              <a href="/" className="hover:text-gray-700 flex items-center">
                <HomeIcon className="w-4 h-4 mr-1" />
                Home
              </a>
              <span>›</span>
              <a href="/legal" className="hover:text-gray-700">Legal</a>
              <span>›</span>
              <span className="text-gray-900">{document.title}</span>
            </nav>

            <div className="flex items-start space-x-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${getDocumentIcon(currentDocType!)}`}>
                <DocumentTextIcon className="w-8 h-8" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {document.title}
                </h1>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {getDocumentDescription(currentDocType!)}
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Last Updated: {formatDate(document.lastUpdated)}
                  </div>
                  <div className="flex items-center">
                    <DocumentTextIcon className="w-4 h-4 mr-2" />
                    Legal Document
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-sm p-8 lg:p-12">
              <MarkdownRenderer 
                content={document.content}
                className="text-gray-700 leading-relaxed"
              />
            </div>
          </div>
        </section>

        {/* Action Section */}
        <section className="py-12 bg-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Questions About This Document?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                If you have any questions about this {document.title.toLowerCase()} or need clarification 
                on any terms, our legal team is here to help.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.location.href = '/contact'}
                  className="!bg-orange-500 hover:!bg-orange-600 !text-white"
                >
                  <EnvelopeIcon className="w-4 h-4 mr-2" />
                  Contact Legal Team
                </Button>
                <Button
                  onClick={() => window.location.href = 'tel:+6281234567'}
                  variant="outlined"
                  className="!border-orange-500 !text-orange-500 hover:!bg-orange-500 hover:!text-white"
                >
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  Call Us
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Related Documents */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Related Legal Documents</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(legalDocuments)
                .filter(([key]) => key !== currentDocType)
                .map(([key, doc]) => (
                  <div key={key} className="bg-white rounded-lg p-6 border border-gray-200 hover:border-orange-300 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getDocumentIcon(key)}`}>
                        <DocumentTextIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{doc.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{getDocumentDescription(key)}</p>
                        <a 
                          href={`/legal/${key}`}
                          className="text-orange-600 hover:text-orange-700 text-sm font-medium inline-flex items-center"
                        >
                          Read Document
                          <ArrowLeftIcon className="w-4 h-4 ml-1 rotate-180" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Footer Navigation */}
        <section className="py-8 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <Button
                onClick={() => window.history.back()}
                variant="outlined"
                className="!border-gray-300 !text-gray-700 hover:!bg-gray-50"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              
              <div className="text-sm text-gray-500">
                Last updated: {formatDate(document.lastUpdated)}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </Layout>
  );
};

export default LegalPage; 