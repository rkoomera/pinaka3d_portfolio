import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { PlayButtonShowcase } from './play-button-showcase';
import { ButtonVariantsShowcase, ButtonSizesShowcase, ButtonArrowShowcase } from './button-showcase';

export const metadata: Metadata = {
  title: 'Style Guide - Pinaka Portfolio',
  description: 'Design system and component library for the Pinaka Portfolio site',
};

export default function StyleGuidePage() {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen pb-20 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="py-12 md:py-16 border-b border-gray-200 dark:border-gray-800">
        <Container>
          <h1 className="text-2xl md:text-3xl font-medium">Design System</h1>
          <p className="mt-2 text-gray-700 dark:text-gray-300">Visual language and component library</p>
        </Container>
      </header>
      
      <Container size="lg" className="mt-12">
        {/* Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <aside className="lg:col-span-3">
            <nav className="sticky top-32">
              <ul className="space-y-6">
                <NavItem href="#colors">Colors</NavItem>
                <NavItem href="#typography">Typography</NavItem>
                <NavItem href="#spacing">Spacing</NavItem>
                <NavItem href="#buttons">Buttons</NavItem>
                <NavItem href="#play-buttons">Play Buttons</NavItem>
                <NavItem href="#containers">Containers</NavItem>
                <NavItem href="#section-backgrounds">Section Backgrounds</NavItem>
                <NavItem href="#video-player">Video Player</NavItem>
              </ul>
            </nav>
          </aside>
          
          <main className="lg:col-span-9">
            {/* Colors */}
            <section id="colors" className="mb-20 scroll-mt-32">
              <SectionTitle>Colors</SectionTitle>
              
              <div className="space-y-10">
                <div>
                  <h3 className="text-lg font-medium mb-4">Brand Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <ColorSwatch name="Brand" color="bg-brand" />
                    <ColorSwatch name="Brand Light" color="bg-brand-light" />
                    <ColorSwatch name="Brand Dark" color="bg-brand-dark" />
                    <ColorSwatch name="Accent" color="bg-accent" />
                    <ColorSwatch name="Accent Dark" color="bg-accent-dark" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Gray Scale</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <ColorSwatch name="White" color="bg-white" />
                    <ColorSwatch name="Gray 200" color="bg-gray-200" />
                    <ColorSwatch name="Gray 300" color="bg-gray-300" />
                    <ColorSwatch name="Gray 400" color="bg-gray-400" />
                    <ColorSwatch name="Gray 500" color="bg-gray-500" />
                    <ColorSwatch name="Gray 600" color="bg-gray-600" />
                    <ColorSwatch name="Gray 700" color="bg-gray-700" />
                    <ColorSwatch name="Gray 800" color="bg-gray-800" />
                    <ColorSwatch name="Gray 900" color="bg-gray-900" />
                    <ColorSwatch name="Gray 950" color="bg-gray-950" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Text Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <ColorSwatch name="Text Default" color="bg-gray-900" />
                    <ColorSwatch name="Text Light" color="bg-gray-700" />
                    <ColorSwatch name="Text Dark" color="bg-gray-200" />
                  </div>
                </div>
              </div>
            </section>
            
            {/* Typography */}
            <section id="typography" className="mb-20 scroll-mt-32">
              <SectionTitle>Typography</SectionTitle>
              
              <div className="space-y-10">
                <div>
                  <h3 className="text-lg font-medium mb-4">Headings</h3>
                  <div className="space-y-6 p-8 bg-gray-100 dark:bg-gray-900 rounded-xl">
                    <div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 block mb-2">text-4xl md:text-5xl lg:text-6xl font-bold</span>
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">Heading 1</h1>
                    </div>
                    <div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 block mb-2">text-3xl md:text-4xl font-bold</span>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Heading 2</h2>
                    </div>
                    <div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 block mb-2">text-2xl md:text-3xl font-semibold</span>
                      <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">Heading 3</h3>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Body Text</h3>
                  <div className="space-y-6 p-8 bg-gray-100 dark:bg-gray-900 rounded-xl">
                    <div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 block mb-2">text-base</span>
                      <p className="text-base text-gray-700 dark:text-gray-300">This is the base text size used throughout the site. It&apos;s responsive and adjusts based on viewport width.</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 block mb-2">text-lg</span>
                      <p className="text-lg text-gray-700 dark:text-gray-300">This is a larger text size, often used for important paragraphs.</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 block mb-2">text-sm</span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">This is smaller text, used for captions and secondary information.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Spacing */}
            <section id="spacing" className="mb-20 scroll-mt-32">
              <SectionTitle>Spacing</SectionTitle>
              
              <div className="space-y-6">
                <div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 block mb-2">xs (0.25rem)</span>
                  <div className="h-xs bg-brand rounded"></div>
                </div>
                <div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 block mb-2">sm (0.5rem)</span>
                  <div className="h-sm bg-brand rounded"></div>
                </div>
                <div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 block mb-2">md (1rem)</span>
                  <div className="h-md bg-brand rounded"></div>
                </div>
                <div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 block mb-2">lg (2rem)</span>
                  <div className="h-lg bg-brand rounded"></div>
                </div>
                <div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 block mb-2">xl (4rem)</span>
                  <div className="h-xl bg-brand rounded"></div>
                </div>
              </div>
            </section>
            
            {/* Buttons */}
            <section id="buttons" className="mb-20 scroll-mt-32">
              <SectionTitle>Buttons</SectionTitle>
              
              <div className="space-y-10">
                <div>
                  <h3 className="text-lg font-medium mb-4">Button Variants</h3>
                  <div className="p-8 bg-gray-100 dark:bg-gray-900 rounded-xl">
                    <ButtonVariantsShowcase />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Button Sizes</h3>
                  <div className="p-8 bg-gray-100 dark:bg-gray-900 rounded-xl">
                    <ButtonSizesShowcase />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Button with Arrow</h3>
                  <div className="p-8 bg-gray-100 dark:bg-gray-900 rounded-xl">
                    <ButtonArrowShowcase />
                  </div>
                </div>
              </div>
            </section>
            
            {/* Play Buttons */}
            <section id="play-buttons" className="mb-20 scroll-mt-32">
              <SectionTitle>Play Buttons</SectionTitle>
              
              <div className="p-8 bg-gray-100 dark:bg-gray-900 rounded-xl">
                <PlayButtonShowcase />
              </div>
            </section>
            
            {/* Containers */}
            <section id="containers" className="mb-20 scroll-mt-32">
              <SectionTitle>Containers</SectionTitle>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Container Sizes</h3>
                <p className="mb-6 text-gray-700 dark:text-gray-300">The site uses these container sizes for consistent content width:</p>
                
                <div className="space-y-8">
                  <div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 block mb-2">sm (max-w-3xl)</span>
                    <div className="max-w-3xl mx-auto h-10 bg-brand/20 border border-brand rounded-lg flex items-center justify-center text-gray-900 dark:text-white">
                      <span className="text-sm">max-w-3xl</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 block mb-2">md (max-w-5xl)</span>
                    <div className="max-w-5xl mx-auto h-10 bg-brand/20 border border-brand rounded-lg flex items-center justify-center text-gray-900 dark:text-white">
                      <span className="text-sm">max-w-5xl</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 block mb-2">lg (max-w-7xl) - Default</span>
                    <div className="max-w-7xl mx-auto h-10 bg-brand/30 border-2 border-brand rounded-lg flex items-center justify-center text-gray-900 dark:text-white">
                      <span className="text-sm font-medium">max-w-7xl (Default)</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 block mb-2">xl (max-w-screen-2xl)</span>
                    <div className="max-w-screen-2xl mx-auto h-10 bg-brand/20 border border-brand rounded-lg flex items-center justify-center text-gray-900 dark:text-white">
                      <span className="text-sm">max-w-screen-2xl</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Section Backgrounds */}
            <section id="section-backgrounds" className="mb-20 scroll-mt-32">
              <SectionTitle>Section Backgrounds</SectionTitle>
              
              <div className="space-y-8">
                <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-medium mb-2">White / Gray 900 (Dark Mode)</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">background=&quot;white&quot;</p>
                </div>
                
                <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="font-medium mb-2">Gray 100 / Gray 800 (Dark Mode)</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">background=&quot;gray-100&quot;</p>
                </div>
                
                <div className="p-6 bg-gray-900 dark:bg-white rounded-lg border border-gray-800 dark:border-gray-200 text-white dark:text-gray-900">
                  <h3 className="font-medium mb-2">Gray 900 / White (Dark Mode)</h3>
                  <p className="text-sm text-gray-300 dark:text-gray-700">background=&quot;gray-900&quot;</p>
                </div>
                
                <div className="p-6 bg-gray-800 dark:bg-gray-100 rounded-lg border border-gray-700 dark:border-gray-300 text-white dark:text-gray-900">
                  <h3 className="font-medium mb-2">Gray 800 / Gray 100 (Dark Mode)</h3>
                  <p className="text-sm text-gray-300 dark:text-gray-700">background=&quot;gray-800&quot;</p>
                </div>
                
                <div className="p-6 bg-gray-950 dark:bg-gray-50 rounded-lg border border-gray-800 dark:border-gray-300 text-white dark:text-gray-900">
                  <h3 className="font-medium mb-2">Gray 950 / Gray 50 (Dark Mode)</h3>
                  <p className="text-sm text-gray-300 dark:text-gray-700">background=&quot;gray-950&quot;</p>
                </div>
              </div>
            </section>
            
            {/* Video Player */}
            <section id="video-player" className="mb-20 scroll-mt-32">
              <SectionTitle>Video Player</SectionTitle>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Default Video Player</h3>
                  <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
                    <VideoPlayer 
                      src="https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/project-videos//demo-reel-bg.mp4" 
                      poster="https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/project-images//demo-reel-poster.jpg"
                      autoPlay={false}
                      loop={true}
                      muted={false}
                    />
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </Container>
    </div>
  );
}

// Helper component for section titles
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-3xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
      {children}
    </h2>
  );
}

// Helper component for navigation items
function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a 
        href={href} 
        className="text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light transition-colors"
      >
        {children}
      </a>
    </li>
  );
}

// Helper component for color swatches
function ColorSwatch({ name, color, textColor }: { name: string; color: string; textColor?: string }) {
  return (
    <div className="flex flex-col">
      <div className={`h-20 ${color} rounded-lg shadow-sm`}></div>
      <p className="mt-2 text-sm text-gray-900 dark:text-white">{name}</p>
    </div>
  );
} 