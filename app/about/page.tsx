'use client'
import React, { useState } from 'react';
import { 
  StarIcon,
  UsersIcon,
  HomeIcon,
  TrophyIcon,
  ChartBarIcon,
  HeartIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Layout from '../../src/src/components/layout/Layout';
import Navbar from '../../src/src/components/layout/Navbar';
import Footer from '../../src/src/components/layout/Footer';
import { Button } from '../../src/src/components/ui';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  bio: string;
  image: string;
  experience: string;
  education: string;
  specialties: string[];
  email: string;
  phone: string;
  linkedin?: string;
  achievements: string[];
}

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  type: 'founding' | 'milestone' | 'expansion' | 'award' | 'achievement';
  icon: React.ComponentType<any>;
}

interface CompanyValue {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface CompanyStat {
  number: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
}

// Mock team data
const teamMembers: TeamMember[] = [
  {
    id: 'ceo',
    name: 'Maria Santos',
    position: 'Chief Executive Officer',
    department: 'Executive',
    bio: 'Maria has over 15 years of experience in the Philippine real estate market. She founded the company with a vision to make property transactions transparent and accessible to everyone.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    experience: '15+ years',
    education: 'MBA, Ateneo Graduate School of Business',
    specialties: ['Strategic Planning', 'Market Development', 'Leadership'],
    email: 'maria.santos@realestate.ph',
    phone: '+63 917 123 4567',
    linkedin: 'maria-santos-ceo',
    achievements: [
      'Real Estate Executive of the Year 2023',
      'Top 40 Under 40 Business Leaders',
      'Philippine Property Awards - CEO Excellence'
    ]
  },
  {
    id: 'coo',
    name: 'Carlos Mendoza',
    position: 'Chief Operating Officer',
    department: 'Operations',
    bio: 'Carlos oversees all operational aspects of the company, ensuring smooth transactions and exceptional customer service across all our offices.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    experience: '12+ years',
    education: 'BS Business Administration, University of the Philippines',
    specialties: ['Operations Management', 'Process Optimization', 'Team Leadership'],
    email: 'carlos.mendoza@realestate.ph',
    phone: '+63 917 234 5678',
    achievements: [
      'Operations Excellence Award 2022',
      'Certified Property Manager (CPM)',
      'Six Sigma Black Belt'
    ]
  },
  {
    id: 'sales_director',
    name: 'Ana Rodriguez',
    position: 'Sales Director',
    department: 'Sales',
    bio: 'Ana leads our sales team with passion and expertise. Her deep understanding of client needs has resulted in record-breaking sales performance.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    experience: '10+ years',
    education: 'BS Marketing, De La Salle University',
    specialties: ['Luxury Properties', 'Client Relations', 'Sales Strategy'],
    email: 'ana.rodriguez@realestate.ph',
    phone: '+63 917 345 6789',
    achievements: [
      'Top Sales Performer 2023',
      'Real Estate Salesperson of the Year',
      'Million Dollar Club Member'
    ]
  },
  {
    id: 'tech_director',
    name: 'David Kim',
    position: 'Technology Director',
    department: 'Technology',
    bio: 'David spearheads our digital transformation initiatives, creating innovative solutions that enhance the property buying and selling experience.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    experience: '8+ years',
    education: 'MS Computer Science, University of California',
    specialties: ['PropTech', 'Digital Innovation', 'Software Development'],
    email: 'david.kim@realestate.ph',
    phone: '+63 917 456 7890',
    achievements: [
      'PropTech Innovation Award 2023',
      'Forbes 30 Under 30 Technology',
      'Certified Scrum Master'
    ]
  },
  {
    id: 'legal_counsel',
    name: 'Isabella Cruz',
    position: 'Legal Counsel',
    department: 'Legal',
    bio: 'Isabella ensures all our transactions comply with Philippine real estate law and provides expert legal guidance to our clients and team.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    experience: '12+ years',
    education: 'Juris Doctor, University of the Philippines College of Law',
    specialties: ['Real Estate Law', 'Contract Negotiation', 'Regulatory Compliance'],
    email: 'isabella.cruz@realestate.ph',
    phone: '+63 917 567 8901',
    achievements: [
      'Top Real Estate Lawyer 2022',
      'Bar Topnotcher 2011',
      'Legal Excellence Award'
    ]
  },
  {
    id: 'marketing_manager',
    name: 'Miguel Torres',
    position: 'Marketing Manager',
    department: 'Marketing',
    bio: 'Miguel creates compelling marketing strategies that showcase properties in their best light and connect with the right buyers.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    experience: '7+ years',
    education: 'BS Advertising, University of Santo Tomas',
    specialties: ['Digital Marketing', 'Brand Strategy', 'Content Creation'],
    email: 'miguel.torres@realestate.ph',
    phone: '+63 917 678 9012',
    achievements: [
      'Marketing Campaign of the Year 2023',
      'Google Ads Certified Professional',
      'Content Marketing Award'
    ]
  }
];

// Company timeline
const timeline: TimelineEvent[] = [
  {
    year: '2018',
    title: 'Company Founded',
    description: 'Maria Santos established the company with a vision to revolutionize real estate in the Philippines.',
    type: 'founding',
    icon: BuildingOfficeIcon
  },
  {
    year: '2019',
    title: 'First Office Opening',
    description: 'Opened our flagship office in Makati Business District, marking our official entry into Metro Manila market.',
    type: 'milestone',
    icon: HomeIcon
  },
  {
    year: '2020',
    title: 'Digital Transformation',
    description: 'Launched our comprehensive digital platform, enabling virtual property tours and online transactions.',
    type: 'achievement',
    icon: GlobeAltIcon
  },
  {
    year: '2021',
    title: 'BGC Expansion',
    description: 'Expanded operations with a new office in Bonifacio Global City to serve the growing Taguig market.',
    type: 'expansion',
    icon: MapPinIcon
  },
  {
    year: '2022',
    title: 'Industry Recognition',
    description: 'Received multiple awards including "Real Estate Company of the Year" and "Innovation in PropTech".',
    type: 'award',
    icon: TrophyIcon
  },
  {
    year: '2023',
    title: 'Ortigas Office',
    description: 'Opened third location in Ortigas Center, establishing presence across key business districts.',
    type: 'expansion',
    icon: BuildingOfficeIcon
  },
  {
    year: '2024',
    title: 'Sustainable Future',
    description: 'Launched green building certification program and sustainable property development initiatives.',
    type: 'achievement',
    icon: HeartIcon
  }
];

// Company values
const companyValues: CompanyValue[] = [
  {
    title: 'Transparency',
    description: 'We believe in complete honesty and openness in all our dealings, ensuring clients have all the information they need.',
    icon: ShieldCheckIcon
  },
  {
    title: 'Innovation',
    description: 'We continuously embrace new technologies and methods to improve the real estate experience for everyone.',
    icon: LightBulbIcon
  },
  {
    title: 'Excellence',
    description: 'We strive for the highest standards in everything we do, from service quality to professional expertise.',
    icon: StarIcon
  },
  {
    title: 'Integrity',
    description: 'We conduct business with the highest ethical standards, building trust through consistent, reliable actions.',
    icon: CheckCircleIcon
  }
];

// Company statistics
const companyStats: CompanyStat[] = [
  {
    number: '2,500+',
    label: 'Properties Sold',
    description: 'Successfully completed transactions',
    icon: HomeIcon
  },
  {
    number: '₱15B+',
    label: 'Total Sales Value',
    description: 'Combined value of all transactions',
    icon: ChartBarIcon
  },
  {
    number: '5,000+',
    label: 'Happy Clients',
    description: 'Satisfied buyers and sellers',
    icon: UsersIcon
  },
  {
    number: '98%',
    label: 'Client Satisfaction',
    description: 'Based on post-transaction surveys',
    icon: HeartIcon
  }
];

const AboutPage: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null);

  const departments = ['All', 'Executive', 'Sales', 'Operations', 'Technology', 'Legal', 'Marketing'];

  const filteredTeamMembers = selectedDepartment === 'All' 
    ? teamMembers 
    : teamMembers.filter(member => member.department === selectedDepartment);

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'founding': return 'bg-blue-100 text-blue-600';
      case 'milestone': return 'bg-green-100 text-green-600';
      case 'expansion': return 'bg-purple-100 text-purple-600';
      case 'award': return 'bg-yellow-100 text-yellow-600';
      case 'achievement': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Layout>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                About Our Company
              </h1>
              <p className="text-xl lg:text-2xl text-orange-100 max-w-4xl mx-auto mb-8">
                We're passionate about helping people find their perfect home and 
                making real estate transactions simple, transparent, and successful.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' })}
                  className="!bg-white !text-orange-600 hover:!bg-orange-50 !font-semibold !px-8 !py-4"
                >
                  Our Mission
                </Button>
                <Button
                  onClick={() => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })}
                  variant="outlined"
                  className="!border-white !text-white hover:!bg-white hover:!text-orange-600 !font-semibold !px-8 !py-4"
                >
                  Meet the Team
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Company Stats */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {companyStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <stat.icon className="w-8 h-8 text-orange-500" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-600">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section id="mission" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Our Mission & Values
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Guided by our core principles, we're building the future of real estate in the Philippines
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* Mission */}
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <LightBulbIcon className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To revolutionize the Philippine real estate market by providing transparent, 
                  efficient, and customer-centric property services that empower people to make 
                  informed decisions about their most important investments.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <GlobeAltIcon className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To be the most trusted and innovative real estate company in the Philippines, 
                  setting new standards for professionalism, technology integration, and customer 
                  satisfaction in property transactions.
                </p>
              </div>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {companyValues.map((value, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm text-center">
                  <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h4>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Timeline */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Our Journey
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From a small startup to a leading real estate company, here's how we've grown
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 h-full bg-gray-300 hidden lg:block"></div>

              <div className="space-y-12">
                {timeline.map((event, index) => (
                  <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Timeline Icon */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full border-4 border-white shadow-lg hidden lg:flex items-center justify-center">
                      <div className={`w-full h-full rounded-full flex items-center justify-center ${getTimelineIcon(event.type)}`}>
                        <event.icon className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center mb-3 lg:hidden">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getTimelineIcon(event.type)}`}>
                            <event.icon className="w-4 h-4" />
                          </div>
                          <span className="text-2xl font-bold text-orange-500">{event.year}</span>
                        </div>
                        <div className="hidden lg:block text-2xl font-bold text-orange-500 mb-3">{event.year}</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                        <p className="text-gray-600">{event.description}</p>
                      </div>
                    </div>

                    {/* Spacer for opposite side */}
                    <div className="hidden lg:block w-5/12"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our diverse team of experts brings together decades of experience in real estate, 
                technology, and customer service
              </p>
            </div>

            {/* Department Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedDepartment === dept
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTeamMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-w-4 aspect-h-3">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-orange-600 font-medium mb-2">{member.position}</p>
                    <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{member.experience} experience</span>
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{member.department}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.specialties.slice(0, 2).map((specialty, index) => (
                        <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                          {specialty}
                        </span>
                      ))}
                      {member.specialties.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{member.specialties.length - 2} more
                        </span>
                      )}
                    </div>

                    <Button
                      onClick={() => setSelectedTeamMember(member)}
                      size="sm"
                      variant="outlined"
                      className="w-full !border-orange-500 !text-orange-500 hover:!bg-orange-500 hover:!text-white"
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Awards & Recognition */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Awards & Recognition
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our commitment to excellence has been recognized by industry leaders and organizations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 text-center">
                <TrophyIcon className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Real Estate Company of the Year</h3>
                <p className="text-gray-600 text-sm mb-2">Philippine Property Awards 2023</p>
                <div className="flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <StarSolidIcon key={i} className="w-4 h-4 text-yellow-500" />
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                <LightBulbIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation in PropTech</h3>
                <p className="text-gray-600 text-sm mb-2">Asia Real Estate Technology Awards 2023</p>
                <div className="flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <StarSolidIcon key={i} className="w-4 h-4 text-blue-500" />
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                <HeartSolidIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Service Excellence</h3>
                <p className="text-gray-600 text-sm mb-2">Philippine Customer Satisfaction Index 2023</p>
                <div className="flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <StarSolidIcon key={i} className="w-4 h-4 text-green-500" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Work with Us?
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Whether you're buying, selling, or investing, our expert team is here to guide you 
              through every step of your real estate journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.href = '/contact'}
                className="!bg-white !text-orange-600 hover:!bg-orange-50 !font-semibold !px-8 !py-4"
              >
                <EnvelopeIcon className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
              <Button
                onClick={() => window.location.href = '/properties'}
                variant="outlined"
                className="!border-white !text-white hover:!bg-white hover:!text-orange-600 !font-semibold !px-8 !py-4"
              >
                <ArrowRightIcon className="w-5 h-5 mr-2" />
                View Properties
              </Button>
            </div>
          </div>
        </section>

        {/* Team Member Modal */}
        {selectedTeamMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <button
                  onClick={() => setSelectedTeamMember(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg z-10"
                >
                  ×
                </button>
                <img
                  src={selectedTeamMember.image}
                  alt={selectedTeamMember.name}
                  className="w-full h-64 object-cover"
                />
              </div>
              
              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedTeamMember.name}</h3>
                  <p className="text-orange-600 font-semibold text-lg mb-1">{selectedTeamMember.position}</p>
                  <p className="text-gray-600">{selectedTeamMember.department} Department</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">About</h4>
                    <p className="text-gray-700">{selectedTeamMember.bio}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Experience</h4>
                      <p className="text-gray-700">{selectedTeamMember.experience}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Education</h4>
                      <p className="text-gray-700">{selectedTeamMember.education}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeamMember.specialties.map((specialty, index) => (
                        <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Achievements</h4>
                    <ul className="space-y-2">
                      {selectedTeamMember.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start">
                          <TrophyIcon className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-3" />
                        <a href={`mailto:${selectedTeamMember.email}`} className="text-orange-600 hover:text-orange-700">
                          {selectedTeamMember.email}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <PhoneIcon className="w-5 h-5 text-gray-400 mr-3" />
                        <a href={`tel:${selectedTeamMember.phone}`} className="text-orange-600 hover:text-orange-700">
                          {selectedTeamMember.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </Layout>
  );
};

export default AboutPage; 