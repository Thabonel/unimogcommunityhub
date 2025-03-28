
import { useState } from 'react';
import Layout from '@/components/Layout';
import ArticleCard from '@/components/knowledge/ArticleCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Filter, BookOpen } from 'lucide-react';

const articles = [
  {
    id: '1',
    title: 'Essential Maintenance Tips for Your Unimog U1700L',
    excerpt: 'Learn the key maintenance practices to keep your Unimog running smoothly for decades.',
    coverImage: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    author: {
      id: 'author1',
      name: 'Michael Schmidt',
    },
    publishedAt: 'Mar 15, 2024',
    readingTime: 8,
    likes: 124,
    views: 3452,
    categories: ['Maintenance', 'U1700L'],
    isSaved: true,
  },
  {
    id: '2',
    title: 'Off-Road Capabilities: Pushing Your Unimog to the Limit',
    excerpt: 'Discover the incredible off-road potential of your Unimog and learn how to navigate extreme terrain safely.',
    author: {
      id: 'author2',
      name: 'Sarah Johnson',
    },
    publishedAt: 'Feb 22, 2024',
    readingTime: 12,
    likes: 87,
    views: 2105,
    categories: ['Off-Road', 'Adventure'],
  },
  {
    id: '3',
    title: 'Unimog Engine Troubleshooting Guide',
    excerpt: 'A comprehensive guide to identifying and fixing common engine issues in Mercedes-Benz Unimog vehicles.',
    author: {
      id: 'author3',
      name: 'Thomas Weber',
    },
    publishedAt: 'Apr 3, 2024',
    readingTime: 15,
    likes: 56,
    views: 1872,
    categories: ['Repair', 'Engine'],
  },
  {
    id: '4',
    title: 'Upgrading Your Unimog: Modern Modifications for Classic Models',
    excerpt: 'Explore how to blend modern technology with your classic Unimog without compromising its authentic character.',
    coverImage: 'https://images.unsplash.com/photo-1566936737687-8f392a237b8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    author: {
      id: 'author4',
      name: 'Klaus Müller',
    },
    publishedAt: 'Jan 17, 2024',
    readingTime: 10,
    likes: 103,
    views: 2940,
    categories: ['Modifications', 'DIY'],
  },
];

const Knowledge = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-2">
              Knowledge Base
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore our collection of articles, guides, and resources to help you get the most out of your Unimog.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              <span>Filter</span>
            </Button>
            <Button className="bg-primary">
              <BookOpen size={16} className="mr-2" />
              New Article
            </Button>
          </div>
        </div>
        
        <div className="relative mb-6">
          <Input
            type="search"
            placeholder="Search articles..."
            className="w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        </div>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Articles</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="repair">Repair</TabsTrigger>
            <TabsTrigger value="adventures">Adventures</TabsTrigger>
            <TabsTrigger value="modifications">Modifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} {...article} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="maintenance" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles
                .filter(article => article.categories.includes('Maintenance'))
                .map((article) => (
                  <ArticleCard key={article.id} {...article} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="repair" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles
                .filter(article => article.categories.includes('Repair'))
                .map((article) => (
                  <ArticleCard key={article.id} {...article} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="adventures" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles
                .filter(article => article.categories.includes('Adventure'))
                .map((article) => (
                  <ArticleCard key={article.id} {...article} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="modifications" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles
                .filter(article => article.categories.includes('Modifications'))
                .map((article) => (
                  <ArticleCard key={article.id} {...article} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Knowledge;
