// app/about/page.tsx
import { Metadata } from 'next';
import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About Me - Ravi Koomera',
  description: 'Learn more about Ravi Koomera, a motion designer and web developer.',
};

export default function AboutPage() {
  return (
    <>
      <Section className="pt-24 md:pt-32" background="white">
        <Container size="xl">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            <div>
              <div className="mb-12">
                <h1 className="mb-4 text-5xl text-gray-900 md:text-6xl">
                  About Me
                </h1>
                <div className="h-1 w-20 bg-blue-600"></div>
              </div>
              
              <p className="mb-6 text-xl leading-relaxed text-gray-900">
                Hello! I&apos;m Ravi, a motion designer and web developer with over 5 years 
                of experience creating engaging digital experiences.
              </p>
              
              <p className="mb-6 text-lg leading-relaxed text-gray-700 md:text-xl">
                My journey began in graphic design, which evolved into a passion for bringing 
                designs to life through motion and interactive experiences. I believe that 
                thoughtful animation and seamless interactions are key to creating memorable 
                digital products.
              </p>
              
              <p className="mb-6 text-lg leading-relaxed text-gray-700 md:text-xl">
                I specialize in combining motion design with modern web development, creating 
                websites and applications that not only look great but also provide engaging 
                user experiences. My technical expertise includes React, Next.js, TypeScript, 
                and various animation libraries and tools.
              </p>
              
              <p className="mb-8 text-lg leading-relaxed text-gray-700 md:text-xl">
                When I&apos;m not designing or coding, you can find me exploring new design trends, 
                experimenting with 3D animations, or hiking in nature to find inspiration.
              </p>
              
              <div>
                <Button href="/contact">Get in Touch</Button>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-lg shadow-md md:mt-0">
              <Image
                src="https://images.unsplash.com/photo-1536164261511-3a17e671d380?q=80&w=2385&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Ravi Koomera"
                width={600}
                height={800}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}