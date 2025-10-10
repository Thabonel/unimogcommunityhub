
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RecommendationSubmissionDialog } from '@/components/knowledge/RecommendationSubmissionDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/profile';
import { FEATURES } from '@/config/features';
import { useTranslation } from 'react-i18next';

const Knowledge = () => {
  const { t } = useTranslation('knowledge');
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const { user } = useAuth();
  const { userData } = useProfile();
  
  
  const layoutUser = userData ? {
    name: userData.name || user?.email?.split('@')[0] || 'User',
    avatarUrl: (userData.useVehiclePhotoAsProfile && userData.vehiclePhotoUrl) 
      ? userData.vehiclePhotoUrl 
      : userData.avatarUrl,
    unimogModel: userData.unimogModel || '',
    vehiclePhotoUrl: userData.vehiclePhotoUrl || '',
    useVehiclePhotoAsProfile: userData.useVehiclePhotoAsProfile || false
  } : undefined;
  
  return (
    <Layout isLoggedIn={!!user} user={layoutUser}>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-2">
              {t('page_title')}
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              {t('page_description')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-primary"
              onClick={() => setSubmissionDialogOpen(true)}
            >
              <BookOpen size={16} className="mr-2" />
              {t('new_recommendation')}
            </Button>
          </div>
        </div>

        {/* Three main sections as cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Community Recommendations */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>{t('sections.community_recommendations.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t('sections.community_recommendations.description')}
              </p>
              <Button asChild className="w-full">
                <Link to="/knowledge/recommendations">{t('browse_recommendations')}</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Technical Manuals */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-8 w-8 mb-2 text-military-green" />
              <CardTitle>{t('sections.technical_manuals.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t('sections.technical_manuals.description')}
              </p>
              <Button asChild variant="outline" className="w-full border-military-green text-military-green">
                <Link to="/knowledge/manuals">{t('view_manuals')}</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Workshop Database */}
          {FEATURES.WIS_ENABLED && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Wrench className="h-8 w-8 mb-2 text-orange-600" />
                <CardTitle>{t('sections.workshop_database.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('sections.workshop_database.description')}
                </p>
                <Button asChild variant="outline" className="w-full border-orange-600 text-orange-600">
                  <Link to="/knowledge/wis">{t('access_workshop')}</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
      </div>

      {/* Recommendation Submission Dialog */}
      <RecommendationSubmissionDialog 
        open={submissionDialogOpen} 
        onOpenChange={setSubmissionDialogOpen} 
      />
    </Layout>
  );
};

export default Knowledge;
