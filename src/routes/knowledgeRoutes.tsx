
import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { lazyImport } from '@/utils/lazyImport';

const { default: Knowledge } = lazyImport(() => import('@/pages/Knowledge'), 'default');
const { default: KnowledgeManuals } = lazyImport(() => import('@/pages/KnowledgeManuals'), 'default');
const { default: RepairPage } = lazyImport(() => import('@/pages/knowledge/RepairPage'), 'default');
const { default: MaintenancePage } = lazyImport(() => import('@/pages/knowledge/MaintenancePage'), 'default');
const { default: ModificationsPage } = lazyImport(() => import('@/pages/knowledge/ModificationsPage'), 'default');
const { default: TyresPage } = lazyImport(() => import('@/pages/knowledge/TyresPage'), 'default');
const { default: AdventuresPage } = lazyImport(() => import('@/pages/knowledge/AdventuresPage'), 'default');
const { default: BotpressAIPage } = lazyImport(() => import('@/pages/knowledge/BotpressAIPage'), 'default');

export const knowledgeRoutes = (
  <>
    <Route path="knowledge" element={<Knowledge />} />
    <Route path="knowledge/manuals" element={<KnowledgeManuals />} />
    <Route path="knowledge/repair" element={<RepairPage />} />
    <Route path="knowledge/maintenance" element={<MaintenancePage />} />
    <Route path="knowledge/modifications" element={<ModificationsPage />} />
    <Route path="knowledge/tyres" element={<TyresPage />} />
    <Route path="knowledge/adventures" element={<AdventuresPage />} />
    <Route path="knowledge/ai-mechanic" element={<BotpressAIPage />} />
  </>
);
