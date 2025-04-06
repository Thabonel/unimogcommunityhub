
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

export const knowledgeRoutes = [
  {
    path: "knowledge",
    element: <Knowledge />
  },
  {
    path: "knowledge/manuals",
    element: <KnowledgeManuals />
  },
  {
    path: "knowledge/repair",
    element: <RepairPage />
  },
  {
    path: "knowledge/maintenance",
    element: <MaintenancePage />
  },
  {
    path: "knowledge/modifications",
    element: <ModificationsPage />
  },
  {
    path: "knowledge/tyres",
    element: <TyresPage />
  },
  {
    path: "knowledge/adventures",
    element: <AdventuresPage />
  },
  {
    path: "knowledge/ai-mechanic",
    element: <BotpressAIPage />
  }
];
