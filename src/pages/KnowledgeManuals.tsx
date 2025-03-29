
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const manuals = [
  {
    id: 'manual1',
    title: 'Unimog U1700L Owner\'s Manual',
    description: 'Complete operator\'s guide for the U1700L model',
    pdfUrl: '#',
    coverImage: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    pages: 210,
    fileSize: '12.4 MB',
    lastUpdated: 'February 2024',
  },
  {
    id: 'manual2',
    title: 'U1700L Service & Repair Manual',
    description: 'Detailed maintenance and repair procedures for U1700L',
    pdfUrl: '#',
    pages: 342,
    fileSize: '24.8 MB',
    lastUpdated: 'January 2024',
  },
  {
    id: 'manual3',
    title: 'Unimog Engine Technical Guide',
    description: 'Specifications and service information for OM352A engines',
    pdfUrl: '#',
    pages: 128,
    fileSize: '8.7 MB',
    lastUpdated: 'March 2024',
  },
  {
    id: 'manual4',
    title: 'U1700L Parts Catalog',
    description: 'Complete parts listing with diagrams and part numbers',
    pdfUrl: '#',
    pages: 186,
    fileSize: '16.2 MB',
    lastUpdated: 'December 2023',
  },
  {
    id: 'manual5',
    title: 'Military to Civilian Conversion Guide',
    description: 'Step-by-step guide for converting ex-military Unimogs to civilian use',
    pdfUrl: '#',
    pages: 64,
    fileSize: '5.8 MB',
    lastUpdated: 'April 2024',
  },
  {
    id: 'manual6',
    title: 'Unimog U1700L Electrical Systems',
    description: 'Wiring diagrams and electrical component information',
    pdfUrl: '#',
    pages: 98,
    fileSize: '7.3 MB',
    lastUpdated: 'January 2024',
  },
];

const KnowledgeManuals = () => {
  // Mock user data - in a real app this would come from authentication
  const mockUser = {
    name: 'John Doe',
    avatarUrl: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    unimogModel: 'U1700L'
  };
  
  return (
    <Layout isLoggedIn={true} user={mockUser}>
      <div className="container py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/knowledge">Knowledge Base</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Vehicle Manuals</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <Button variant="outline" className="mb-4" asChild>
              <Link to="/knowledge">
                <ArrowLeft size={16} className="mr-2" />
                Back to Knowledge Base
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-2">
              Vehicle Manuals
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Access official Unimog technical documentation, owner's manuals, and service guides.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {manuals.map((manual) => (
            <Card key={manual.id} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="line-clamp-2">{manual.title}</CardTitle>
                <CardDescription>{manual.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                {manual.coverImage && (
                  <div className="aspect-[3/4] bg-muted rounded-md mb-4 overflow-hidden">
                    <img 
                      src={manual.coverImage} 
                      alt={manual.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {!manual.coverImage && (
                  <div className="aspect-[3/4] bg-muted rounded-md mb-4 flex items-center justify-center">
                    <FileText size={64} className="text-muted-foreground opacity-40" />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div>
                    <p className="text-muted-foreground">Pages</p>
                    <p className="font-medium">{manual.pages}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Size</p>
                    <p className="font-medium">{manual.fileSize}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{manual.lastUpdated}</p>
                  </div>
                </div>
                <Button className="mt-auto w-full gap-2">
                  <Download size={16} />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default KnowledgeManuals;
