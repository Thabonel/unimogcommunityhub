import { useTranslation } from 'react-i18next';
import { Users, BookOpen, Globe, Star } from 'lucide-react';

export function StatsSection() {
  const { t } = useTranslation();

  const stats = [
    {
      icon: Users,
      value: '1,200+',
      label: t('home.stats.members'),
      key: 'members'
    },
    {
      icon: BookOpen,
      value: '45+',
      label: t('home.stats.manuals'),
      key: 'manuals'
    },
    {
      icon: Globe,
      value: '12',
      label: t('home.stats.countries'),
      key: 'countries'
    },
    {
      icon: Star,
      value: '4.8',
      label: t('home.stats.rating'),
      key: 'rating'
    }
  ];

  return (
    <section className="py-12 bg-sand-beige border-y border-camo-brown/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.key}
                className="flex flex-col items-center text-center"
              >
                <Icon className="w-8 h-8 text-military-green mb-3" />
                <div className="text-3xl font-bold text-mud-black mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-mud-black/70">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
