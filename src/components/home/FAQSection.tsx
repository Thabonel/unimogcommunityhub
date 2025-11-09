import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FAQSection() {
  const { t } = useTranslation();

  const faqs = [
    {
      question: t('home.faq.different_facebook.question'),
      answer: t('home.faq.different_facebook.answer'),
      key: 'different_facebook'
    },
    {
      question: t('home.faq.free_trial.question'),
      answer: t('home.faq.free_trial.answer'),
      key: 'free_trial'
    },
    {
      question: t('home.faq.barry_works.question'),
      answer: t('home.faq.barry_works.answer'),
      key: 'barry_works'
    },
    {
      question: t('home.faq.cancel_anytime.question'),
      answer: t('home.faq.cancel_anytime.answer'),
      key: 'cancel_anytime'
    },
    {
      question: t('home.faq.verify_ownership.question'),
      answer: t('home.faq.verify_ownership.answer'),
      key: 'verify_ownership'
    },
    {
      question: t('home.faq.manuals_available.question'),
      answer: t('home.faq.manuals_available.answer'),
      key: 'manuals_available'
    },
    {
      question: t('home.faq.data_private.question'),
      answer: t('home.faq.data_private.answer'),
      key: 'data_private'
    },
    {
      question: t('home.faq.community_active.question'),
      answer: t('home.faq.community_active.answer'),
      key: 'community_active'
    },
    {
      question: t('home.faq.payment_methods.question'),
      answer: t('home.faq.payment_methods.answer'),
      key: 'payment_methods'
    },
    {
      question: t('home.faq.refunds.question'),
      answer: t('home.faq.refunds.answer'),
      key: 'refunds'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-mud-black mb-4">
            {t('home.faq.title')}
          </h2>
          <p className="text-lg text-mud-black/70">
            {t('home.faq.subtitle')}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.key} value={faq.key}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-mud-black/70">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
