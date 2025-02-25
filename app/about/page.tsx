// app/about/page.tsx
import { Metadata } from 'next';
import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'About Me - Ravi Koomera',
  description: 'Learn more about Ravi Koomera, a motion designer and web developer.',
};

export default function AboutPage() {
  return (
    <>
      <Section className="pt-24 md:pt-32">
        <Container size="lg">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <h1 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
                About Me
              </h1>
              
              <div className="prose prose-lg">
                <p>
                  Hello! I&apos;m Ravi, a motion designer and web developer with over 5 years 
                  of experience creating engaging digital experiences.
                </p>
                
                <p>
                  My journey began in graphic design, which evolved into a passion for bringing 
                  designs to life through motion and interactive experiences. I believe that 
                  thoughtful animation and seamless interactions are key to creating memorable 
                  digital products.
                </p>
                
                <p>
                  I specialize in combining motion design with modern web development, creating 
                  websites and applications that not only look great but also provide engaging 
                  user experiences. My technical expertise includes React, Next.js, TypeScript, 
                  and various animation libraries and tools.
                </p>
                
                <p>
                  When I&apos;m not designing or coding, you can find me exploring new design trends, 
                  experimenting with 3D animations, or hiking in nature to find inspiration.
                </p>
              </div>
              
              <div className="mt-8">
                <Button href="/contact">Get in Touch</Button>
              </div>
            </div>
            
            <div className="relative h-[400px] overflow-hidden rounded-xl md:h-auto">
              <Image
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1000&auto=format"
                alt="Ravi Koomera"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </Section>
      
      <Section background="gray">
        <SectionHeading
          title="My Approach"
          subtitle="How I tackle projects and deliver results"
          centered
        />
        
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Discovery
            </h3>
            <p className="text-gray-600">
              I start by understanding your goals, audience, and vision. This phase involves research, 
              brainstorming, and defining the project scope.
            </p>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Design & Prototype
            </h3>
            <p className="text-gray-600">
              Next, I create wireframes, mockups, and motion concepts. We iterate together until 
              we have a solid design direction and animation style.
            </p>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Development
            </h3>
            <p className="text-gray-600">
              Finally, I bring everything to life with clean code and optimized animations, 
              ensuring the final product is fast, responsive, and works on all devices.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}