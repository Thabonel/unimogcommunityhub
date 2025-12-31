import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Check,
  Star,
  Users,
  Shield,
  Zap,
  BookOpen,
  MapPin,
  MessageCircle,
  TrendingUp,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface LTDStats {
  seats_sold: number;
  seats_limit: number;
  current_price: number;
  revenue_generated: number;
}

const FEATURES = [
  {
    icon: BookOpen,
    title: '45+ Searchable Manuals',
    description: 'Complete Unimog manual library with semantic search'
  },
  {
    icon: MessageCircle,
    title: 'Barry AI Mechanic',
    description: 'Ask technical questions, get instant answers with citations'
  },
  {
    icon: MapPin,
    title: 'GPX Trip Planning',
    description: 'Off-road routes with elevation profiles'
  },
  {
    icon: Users,
    title: 'Parts Marketplace',
    description: 'Buy, sell, and trade Unimog parts'
  },
  {
    icon: Shield,
    title: 'WIS-EPC Premium Access',
    description: 'Workshop Information System + Electronic Parts Catalog'
  },
  {
    icon: Zap,
    title: 'All Future Features',
    description: 'Free access to every feature we build, forever'
  }
];

const FAQ_ITEMS = [
  {
    question: 'What happens after 100 seats are sold?',
    answer: 'After the 100 lifetime seats are sold, we switch to subscription-only pricing at $9.99/month. This is a one-time opportunity to lock in lifetime access.'
  },
  {
    question: 'Is there a money-back guarantee?',
    answer: 'Yes! We offer a 30-day money-back guarantee. If you\'re not satisfied for any reason, we\'ll refund your purchase in full, no questions asked.'
  },
  {
    question: 'Do I get access to future features?',
    answer: 'Absolutely! Your lifetime membership includes all current features plus every feature we add in the future. No additional fees, ever.'
  },
  {
    question: 'Can I upgrade later if I miss this deal?',
    answer: 'No. Once the 100 lifetime seats are sold, we\'ll only offer monthly/annual subscriptions. This is the only chance to get lifetime access.'
  },
  {
    question: 'What if I have multiple Unimogs?',
    answer: 'One lifetime membership covers all your vehicles. You can register and track unlimited Unimogs in your account.'
  }
];

export default function LifetimeDeal() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const { data: ltdStats, isLoading } = useQuery({
    queryKey: ['ltd-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ltd_campaign_stats')
        .select('*')
        .single();

      if (error) {
        return {
          seats_sold: 0,
          seats_limit: 100,
          current_price: 199.00,
          revenue_generated: 0
        } as LTDStats;
      }

      return data as LTDStats;
    },
    refetchInterval: 30000
  });

  useEffect(() => {
    const campaignEndDate = new Date();
    campaignEndDate.setDate(campaignEndDate.getDate() + 14);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = campaignEndDate.getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const seatsSold = ltdStats?.seats_sold || 0;
  const seatsRemaining = (ltdStats?.seats_limit || 100) - seatsSold;
  const currentPrice = ltdStats?.current_price || 199.00;
  const nextTierPrice = seatsSold >= 50 ? 299.00 : 199.00;

  const progress = (seatsSold / (ltdStats?.seats_limit || 100)) * 100;

  return (
    <Layout>
      <div className="bg-gradient-to-b from-military-green/5 to-background">
        <div className="container py-12 max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="destructive" className="text-sm px-4 py-1.5">
              <AlertCircle className="h-3 w-3 mr-1" />
              Limited Time Offer
            </Badge>
            <h1 className="text-5xl font-bold">
              Lifetime Access to UnimogCommunityHub
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join 100 founding members with lifetime access to all features, manuals, and AI support.
              Once these seats are gone, it's $9.99/month forever.
            </p>

            <div className="flex justify-center gap-8 py-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-military-green">{countdown.days}</div>
                <div className="text-sm text-muted-foreground">Days</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-military-green">{countdown.hours}</div>
                <div className="text-sm text-muted-foreground">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-military-green">{countdown.minutes}</div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-military-green">{countdown.seconds}</div>
                <div className="text-sm text-muted-foreground">Seconds</div>
              </div>
            </div>
          </div>

          <Card className="mb-12 overflow-hidden border-2 border-military-green">
            <div className="bg-gradient-to-r from-military-green to-camo-brown p-1">
              <div className="bg-background">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="flex-1 text-center lg:text-left">
                      <div className="mb-4">
                        <span className="text-5xl font-bold">${currentPrice}</span>
                        <span className="text-muted-foreground line-through ml-3 text-2xl">$499</span>
                        <Badge variant="secondary" className="ml-3 text-sm">
                          {Math.round((1 - currentPrice / 499) * 100)}% OFF
                        </Badge>
                      </div>
                      <p className="text-xl font-semibold mb-2">
                        {seatsRemaining} of {ltdStats?.seats_limit || 100} Seats Remaining
                      </p>
                      <div className="w-full bg-muted rounded-full h-2 mb-4">
                        <div
                          className="bg-military-green h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {seatsSold >= 50 ? 'Next 50 seats: $299 • ' : ''}Price increases as seats sell
                      </p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button
                        size="lg"
                        className="bg-military-green hover:bg-military-green/90 text-lg px-8 py-6"
                        onClick={() => navigate('/pricing')}
                      >
                        <TrendingUp className="mr-2 h-5 w-5" />
                        Claim Your Lifetime Seat
                      </Button>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        <span>30-day money-back guarantee</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">What You Get (Forever)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-military-green/10 rounded-lg">
                        <feature.icon className="h-6 w-6 text-military-green" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">What Unimog Owners Are Saying</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((idx) => (
                    <Card key={idx} className="bg-muted/50">
                      <CardContent className="p-6">
                        <div className="flex gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                        <p className="text-sm mb-4">
                          "Barry AI saved me hours of manual searching. Worth every penny!"
                        </p>
                        <div className="text-xs text-muted-foreground">
                          Lifetime Member #{10 + idx}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {FAQ_ITEMS.map((item, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-military-green text-white">
            <CardContent className="p-12 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-4">Don't Miss This Opportunity</h3>
              <p className="text-xl mb-2 text-white/90">
                Only {seatsRemaining} lifetime seats remaining at ${currentPrice}
              </p>
              <p className="mb-8 text-white/80">
                This is a one-time offer. No extensions. No exceptions.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-12 py-6"
                onClick={() => navigate('/pricing')}
              >
                Claim Your Lifetime Seat Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
