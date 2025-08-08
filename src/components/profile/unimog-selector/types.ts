
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
  // Most popular in Australia - listed first
  {
    id: '1',
    model_code: 'U1700L',
    series: 'U1700',
    name: 'Unimog U1700L (Most Popular in Australia)',
    year_range: '1975-1988',
    specs: {
      engine: 'OM352A 5.7L',
      power: '124-168 hp',
      transmission: '8 forward, 8 reverse',
      weight: '7.5 tonnes'
    },
    features: ['All-wheel drive', 'Portal axles', 'Coil springs', 'Long wheelbase', 'Ideal for Australian conditions'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    model_code: 'U1300L',
    series: 'U1300',
    name: 'Unimog U1300L',
    year_range: '1976-1989',
    specs: {
      engine: 'OM352 5.7L',
      power: '130 hp',
      transmission: '8 forward, 8 reverse'
    },
    features: ['All-wheel drive', 'Portal axles', 'Coil springs', 'Compact size'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Classic models
  {
    id: '3',
    model_code: '404',
    series: '404',
    name: 'Unimog 404 (Classic)',
    year_range: '1955-1977',
    specs: {
      engine: 'M180 2.2L',
      power: '82 hp',
      transmission: '6 forward, 2 reverse'
    },
    features: ['Classic military vehicle', 'Proven reliability', 'Simple mechanics'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    model_code: '406',
    series: '406/416',
    name: 'Unimog 406',
    year_range: '1963-1989',
    specs: {
      engine: 'OM352 5.7L',
      power: '84-110 hp',
      transmission: '6 forward, 2 reverse'
    },
    features: ['Agricultural focus', 'PTO drive', 'Cab or soft-top'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    model_code: '416',
    series: '406/416',
    name: 'Unimog 416',
    year_range: '1975-1989',
    specs: {
      engine: 'OM352 5.7L',
      power: '110 hp',
      transmission: '8 forward, 4 reverse'
    },
    features: ['Heavy duty', 'Portal axles', 'Improved cab'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Modern models
  {
    id: '6',
    model_code: 'U300',
    series: 'UGN',
    name: 'Unimog U300',
    year_range: '2000-2013',
    specs: {
      engine: 'OM904LA 4.2L',
      power: '177 hp',
      transmission: 'UG100 transmission'
    },
    features: ['Modern electronics', 'Euro III/IV compliant', 'Comfortable cab'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '7',
    model_code: 'U400',
    series: 'UGN',
    name: 'Unimog U400',
    year_range: '2000-2013',
    specs: {
      engine: 'OM904LA 4.2L',
      power: '177 hp',
      transmission: 'UG100 transmission'
    },
    features: ['Versatile implement carrier', 'High ground clearance', 'Advanced hydraulics'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '8',
    model_code: 'U500',
    series: 'UGN',
    name: 'Unimog U500',
    year_range: '2000-2013',
    specs: {
      engine: 'OM906LA 6.4L',
      power: '272 hp',
      transmission: 'UG100 transmission'
    },
    features: ['Heavy duty', 'High payload', 'Extreme off-road capability'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '9',
    model_code: 'U4000',
    series: 'UHN',
    name: 'Unimog U4000',
    year_range: '2013-present',
    specs: {
      engine: 'OM934LA 5.1L',
      power: '231 hp',
      transmission: 'UG100 transmission'
    },
    features: ['Euro VI compliant', 'Modern safety systems', 'Central tire inflation'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '10',
    model_code: 'U5000',
    series: 'UHN',
    name: 'Unimog U5000',
    year_range: '2013-present',
    specs: {
      engine: 'OM936LA 7.7L',
      power: '299 hp',
      transmission: 'UG100 transmission'
    },
    features: ['Military grade', 'Extreme off-road', 'High payload capacity'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Special models
  {
    id: '11',
    model_code: 'U2450L',
    series: 'U2450',
    name: 'Unimog U2450L',
    year_range: '1989-1996',
    specs: {
      engine: 'OM366LA 6.0L',
      power: '240 hp',
      transmission: '16 forward, 16 reverse'
    },
    features: ['Long wheelbase', 'Heavy duty', 'Popular for expeditions'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '12',
    model_code: 'U530',
    series: 'U530',
    name: 'Unimog U530',
    year_range: '2013-present',
    specs: {
      engine: 'OM936LA 7.7L',
      power: '299 hp',
      transmission: 'Fully automatic'
    },
    features: ['Agricultural specialist', 'Implement carrier', 'High-tech farming'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '13',
    model_code: 'U20',
    series: 'UGE',
    name: 'Unimog U20',
    year_range: '2010-present',
    specs: {
      engine: 'OM934LA 5.1L',
      power: '177 hp',
      transmission: 'Hydrostatic'
    },
    features: ['Compact size', 'Municipal use', 'All-season capability'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const isMasterUser = (user: User | null): boolean => {
  if (!user) return false;
  return user.email === 'master@development.com';
};
