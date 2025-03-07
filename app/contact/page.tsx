// app/contact/page.tsx
import { Viewport,  Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { ClientContactWrapper } from '@/components/portfolio/ClientContactWrapper';

// Page configuration
export const dynamicParams = true;


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};
export default function ContactPage() {
  return (
    <Section className="pt-24 md:pt-32" background="gray-100">
      <Container size="lg">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200 sm:text-4xl">
              Get in Touch
            </h1>
            
            <p className="mb-8 text-lg text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Have a project in mind or want to discuss a potential collaboration? Fill out the form 
              and I&apos;ll get back to you as soon as possible.
            </p>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">Location</h2>
                <p className="mt-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">Frankfurt, Germany</p>
              </div>
            </div>
          </div>
          
          <div>
            <ClientContactWrapper />
          </div>
        </div>
      </Container>
    </Section>
  );
}