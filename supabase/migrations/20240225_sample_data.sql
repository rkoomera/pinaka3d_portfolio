-- Insert sample author
INSERT INTO authors (name, email, bio)
VALUES (
    'Ravi Koomera',
    'ravi@example.com',
    'Motion designer and web developer with over 5 years of experience creating engaging digital experiences.'
);

-- Insert sample projects
INSERT INTO projects (
    title,
    slug,
    subtitle,
    summary,
    thumbnail_url,
    tech_stack,
    category,
    author_id,
    is_published,
    featured,
    client_name,
    duration,
    role
)
VALUES
(
    'E-Commerce Motion Design',
    'e-commerce-motion-design',
    'Animated product showcases and micro-interactions',
    'Created a series of product animations and micro-interactions for an e-commerce platform, enhancing user engagement and conversion rates.',
    'https://images.unsplash.com/photo-1611162616475-46b635cb6868',
    ARRAY['After Effects', 'Lottie', 'React'],
    'motion_design',
    1,
    true,
    true,
    'StyleStore',
    '3 months',
    'Lead Motion Designer'
),
(
    'Portfolio Website Redesign',
    'portfolio-website-redesign',
    'Modern portfolio with dynamic animations',
    'Designed and developed a modern portfolio website with smooth animations and interactive elements.',
    'https://images.unsplash.com/photo-1563089145-599997674d42',
    ARRAY['Next.js', 'Framer Motion', 'Tailwind CSS', 'TypeScript'],
    'web_development',
    1,
    true,
    true,
    'Creative Studio',
    '2 months',
    'Full Stack Developer'
); 