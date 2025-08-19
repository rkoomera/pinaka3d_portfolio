// app/page.tsx
import { Metadata, Viewport } from 'next';
import { HeroSection } from '@/components/portfolio/HeroSection';
import { FeaturedProjects } from '@/components/portfolio/FeaturedProjects';
import { getAllProjects } from '@/lib/services/sanity';
import { VideoSection } from '@/components/layout/VideoSection';
import { ContactCTA } from '@/components/portfolio/ContactCTA';

export const metadata: Metadata = {
  title: 'Ravi Koomera - Motion Designer & Developer',
  description: 'Portfolio showcasing motion design and web development projects by Ravi Koomera.'
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};



export default async function HomePage() {
  const featuredProjects = await getAllProjects();
  
  return (
    <>
      <HeroSection
        titleLines={[
          { 
            text: "I'm Ravi aka Pinaka", 
            className: "font-normal text-4xl text-brand dark:text-white sm:text-4xl" 
          },
          { 
            text: "Motion Designer and Creative Developer", 
            className: "font-normal text-lg text-gray-900 dark:text-white italic sm:text-xl leading-relaxed" 
          },
          { 
            text: "based in Frankfurt, Germany.", 
            className: "font-normal text-lg text-gray-900 dark:text-white italic sm:text-xl leading-relaxed" 
          }
        ]}
        riveUrl="https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/3d-assets/little_boy.riv"
        riveArtboard="Little Boy"
        riveStateMachine="State Machine 1"
        riveAutoplay={true}
      />
      
      <VideoSection />
      
      <FeaturedProjects 
        projects={featuredProjects} 
        background="white"
        layout="twoCol"
        showLayoutToggle={true}
        useSwiperOnFourCol={true}
        title="Featured Projects"
        subtitle="A selection of my recent work"
        showSubtitle={true}
      />
      
      <ContactCTA />
    </>
  );
}