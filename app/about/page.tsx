// app/about/page.tsx
import { Metadata, Viewport } from 'next';
import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ContactCTA } from '@/components/portfolio/ContactCTA';
import { ProfileTabs } from '@/components/portfolio/ProfileTabs';

export const metadata: Metadata = {
  title: 'About Me - Ravi Koomera',
  description: 'Learn more about Ravi Koomera, a motion designer and web developer.'
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

interface ExperienceItem {
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface SkillItem {
  name: string;
  icon: string;
}

interface EducationItem {
  institution: string;
  degree: string;
  duration: string;
  description: string;
}

const experiences: ExperienceItem[] = [
  {
    company: "Motion Design Studio",
    position: "Senior Motion Designer",
    duration: "January 2022 - Present",
    description: "Leading motion design projects for major clients, creating animated brand experiences and overseeing a team of junior designers. Specialized in 3D animations and interactive web experiences."
  },
  {
    company: "Creative Agency",
    position: "Web Developer & Motion Designer",
    duration: "March 2019 - December 2021",
    description: "Developed websites with modern JavaScript frameworks while creating engaging animations. Implemented seamless transitions and micro-interactions to enhance user experiences across various client projects."
  },
  {
    company: "Digital Products Inc.",
    position: "UI/UX Designer",
    duration: "June 2017 - February 2019",
    description: "Designed user interfaces for web and mobile applications. Created interactive prototypes and collaborated with development teams to ensure design integrity during implementation."
  },
  {
    company: "Tech Startup",
    position: "Frontend Developer Intern",
    duration: "January - May 2017",
    description: "Assisted in developing responsive web interfaces and learned frontend development best practices. Gained experience with React and modern CSS frameworks."
  }
];

const education: EducationItem[] = [
  {
    institution: "Design University",
    degree: "Master of Arts in Digital Design",
    duration: "2015 - 2017",
    description: "Focused on interactive design and digital experiences. Graduated with honors and received the Dean's Award for Outstanding Creative Project."
  },
  {
    institution: "Technology Institute",
    degree: "Bachelor of Science in Computer Science",
    duration: "2012 - 2015",
    description: "Specialized in web technologies and user interface programming. Participated in multiple hackathons and design competitions."
  }
];

const skills: SkillItem[] = [
  { name: "Motion Design", icon: "✦" },
  { name: "After Effects", icon: "✦" },
  { name: "Cinema 4D", icon: "✦" },
  { name: "React", icon: "✦" },
  { name: "Next.js", icon: "✦" },
  { name: "Framer Motion", icon: "✦" },
  { name: "GSAP", icon: "✦" },
  { name: "TypeScript", icon: "✦" },
  { name: "Figma", icon: "✦" },
  { name: "Lottie", icon: "✦" },
  { name: "Three.js", icon: "✦" },
  { name: "Tailwind CSS", icon: "✦" },
];

export default function AboutPage() {
  return (
    <>
      <Section className="pt-24 md:pt-32" background="white">
        <Container size="xl">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            <div>
              <div className="mb-12">
                <h1 className="mb-4 text-5xl text-dark dark:text-light transition-colors duration-200 md:text-6xl">
                  About Me
                </h1>
                <div className="h-1 w-20 bg-brand"></div>
              </div>
              
              <p className="mb-6 text-xl leading-relaxed text-dark dark:text-light transition-colors duration-200">
                Hello! I&apos;m Ravi, a motion designer and web developer with over 5 years 
                of experience creating engaging digital experiences.
              </p>
              
              <p className="mb-6 text-lg leading-relaxed text-dark-secondary dark:text-gray-300 transition-colors duration-200 md:text-xl">
                My journey began in graphic design, which evolved into a passion for bringing 
                designs to life through motion and interactive experiences. I believe that 
                thoughtful animation and seamless interactions are key to creating memorable 
                digital products.
              </p>
              
              <p className="mb-6 text-lg leading-relaxed text-dark-secondary dark:text-gray-300 transition-colors duration-200 md:text-xl">
                I specialize in combining motion design with modern web development, creating 
                websites and applications that not only look great but also provide engaging 
                user experiences. My technical expertise includes React, Next.js, TypeScript, 
                and various animation libraries and tools.
              </p>
              
              <p className="mb-8 text-lg leading-relaxed text-dark-secondary dark:text-gray-300 transition-colors duration-200 md:text-xl">
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

      {/* Combined Professional Profile Section */}
      <Section className="py-24" background="gray-100">
        <Container>
          <div className="relative">
            <SectionHeading 
              title="Professional Profile" 
              subtitle="My experience, education and specialized skills"
            />
            
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
              {/* Tab System for Experience and Education */}
              <ProfileTabs experiences={experiences} education={education} />
              
              {/* Skills Column */}
              <div className="lg:col-span-5">
                <h3 className="text-xl text-black dark:text-white border-b border-gray-300 dark:border-gray-600 pb-3 mb-8 flex items-center">
                  <span className="h-5 w-1 bg-brand mr-3 rounded-full"></span>
                  Technical Skills
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {skills.map((skill, index) => (
                    <div 
                      key={index} 
                      className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] hover:border-brand/20 dark:hover:border-brand/20 dark:bg-gray-800/50"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-md bg-brand/10 dark:bg-brand/30 text-brand text-lg">{skill.icon}</span>
                        <span className="text-black dark:text-white">{skill.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Add a small introduction to skills */}
                <div className="mt-8 p-5 rounded-lg border-l-4 border-brand border-y border-r border-gray-300 dark:border-gray-600 dark:bg-gray-800/50">
                  <p className="text-gray-800 dark:text-gray-200 text-sm">
                    My technical expertise spans both motion design and web development, 
                    with a focus on creating seamless, interactive digital experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
      
      <ContactCTA />
    </>
  );
}