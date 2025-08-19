import { lazy } from 'react';

const KnowledgeManuals = lazy(() => import('@/pages/KnowledgeManuals'));

export const knowledgeRoutes = [
  {
    path: '/knowledge/manuals',
    element: <KnowledgeManuals />,
  },
];