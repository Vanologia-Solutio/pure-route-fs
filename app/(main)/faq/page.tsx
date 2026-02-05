import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Fragment } from 'react'

export default function FAQPage() {
  const faqItems: { question: string; answer: string }[] = [
    {
      question: 'How fast will my order be shipped?',
      answer:
        'Orders are shipped either the same business day or the next business day. Most orders arrive within four business days.',
    },
    {
      question: 'Can I get a refund or return my order?',
      answer:
        "Unfortunately, we do not accept refunds or returns. Due to the nature of our products, accepting returns would not be safe for our customers. If you need to cancel your order before it has shipped, please contact our support email and we'll be happy to assist you. Once an order has shipped, it cannot be canceled.",
    },
    {
      question: 'How do I track my order?',
      answer:
        'Your tracking number will be sent to you via email along with your order confirmation.',
    },
    {
      question: 'How can I change my order?',
      answer:
        'If you need to make a change or correct a mistake, please email us as soon as possible. Orders cannot be modified once they have shipped. We strongly recommend double-checking all your information before placing an order to ensure accuracy.',
    },
    {
      question: 'Do you ship internationally?',
      answer:
        'No. At this time, Pure Route ships only within the United States.',
    },
    {
      question: 'Do your products include bacteriostatic water?',
      answer:
        'No. Bacteriostatic water must be purchased separately. All of our products are supplied in lyophilized powder form.',
    },
    {
      question: 'Are all of your products lab-tested?',
      answer:
        'Yes. All products are lab-tested. When a product is in stock, a link to its test results will always be available. Each product is guaranteed to be over 99% pure and completely free of contaminants and heavy metals.',
    },
  ]

  return (
    <Fragment>
      <h1 className='text-3xl font-bold mb-4'>FAQ</h1>
      {faqItems.map(item => (
        <Accordion
          key={item.question}
          type='multiple'
          defaultValue={[item.question]}
        >
          <AccordionItem value={item.question}>
            <AccordionTrigger className='text-lg font-bold'>
              {item.question}
            </AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </Fragment>
  )
}
