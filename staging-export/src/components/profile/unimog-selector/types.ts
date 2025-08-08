
import { User } from '@supabase/supabase-js';

export interface UnimogModel {
  model_code: string;
  series: string;
  name: string;
  specs: Record<string, any>;
  features: string[];
  year_range?: string;
  id: string;
  capabilities?: string;
  history?: string;
  wiki_data?: any;
  created_at: string;
  updated_at: string;
}

export interface UnimogModelSelectorProps {
  currentModel: string | null;
  onChange: (model: string, series: string, specs: Record<string, any>, features: string[]) => void;
  disabled?: boolean;
}

export const getDefaultModels = (): UnimogModel[] => [
  {
    id: '1',
    model_code: 'U1700L',
    series: 'U1700',
    name: 'Unimog U1700L',
    specs: {
      engine: 'OM352A 5.7L',
      power: '124 hp',
      transmission: '8 forward, 8 reverse'
    },
    features: ['All-wheel drive', 'Portal axles', 'Coil springs'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    model_code: 'U4000',
    series: 'UHN',
    name: 'Unimog U4000',
    specs: {
      engine: 'OM924LA 4.8L',
      power: '218 hp',
      transmission: 'UG100 transmission'
    },
    features: ['Advanced electronics', 'High ground clearance', 'Central tire inflation'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    model_code: 'U5000',
    series: 'UHN',
    name: 'Unimog U5000',
    specs: {
      engine: 'OM924LA 4.8L',
      power: '218 hp',
      transmission: 'UG100 transmission'
    },
    features: ['Military grade', 'Extreme off-road capability', 'High payload capacity'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const isMasterUser = (user: User | null): boolean => {
  if (!user) return false;
  return user.email === 'master@development.com';
};
