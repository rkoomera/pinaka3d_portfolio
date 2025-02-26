// app/contact/page.tsx
import { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { ContactForm } from '@/components/portfolio/ContactForm';

export const metadata: Metadata = {
  title: 'Contact - Ravi Koomera',
  description: 'Get in touch with Ravi Koomera for project inquiries or collaboration opportunities.',
};

export default async function ContactPage() {
  return (
    <Section className="pt-24 md:pt-32">
      <Container size="lg">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <h1 className="mb-6 text-3xl font-bold text-dark dark:text-light transition-colors duration-200 sm:text-4xl">
              Get in Touch
            </h1>
            
            <p className="mb-8 text-lg text-dark-secondary dark:text-gray-300 transition-colors duration-200">
              Have a project in mind or want to discuss a potential collaboration? Fill out the form 
              and I&apos;ll get back to you as soon as possible.
            </p>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-dark dark:text-light transition-colors duration-200">Email</h2>
                <p className="mt-2 text-dark-secondary dark:text-gray-300 transition-colors duration-200">
                  <a href="mailto:hello@ravikoomera.com" className="text-brand hover:text-brand/80 transition-colors duration-200">
                    hello@ravikoomera.com
                  </a>
                </p>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-dark dark:text-light transition-colors duration-200">Location</h2>
                <p className="mt-2 text-dark-secondary dark:text-gray-300 transition-colors duration-200">San Francisco, California</p>
              </div>
            </div>
          </div>
          
          <div>
            <ContactForm />
          </div>
        </div>
      </Container>
    </Section>
  );
}