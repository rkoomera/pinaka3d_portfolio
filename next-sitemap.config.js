/** @type {import('next-sitemap').IConfig} */

// Define the primary domain and alternate domains
const PRIMARY_DOMAIN = "https://www.pinaka3d.com";
const ALTERNATE_DOMAINS = [
  "https://www.pinaka.xyz",
  "https://pinaka3d-portfolio.vercel.app"
];

module.exports = {
  siteUrl: PRIMARY_DOMAIN,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/*'],
      },
    ],
    additionalSitemaps: [
      // Add alternate domain sitemaps if needed
      // `${ALTERNATE_DOMAINS[0]}/sitemap.xml`,
    ],
  },
  exclude: ['/admin/*'],
  generateIndexSitemap: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  outDir: 'public',
  // Add alternate links to sitemap
  transform: async (config, path) => {
    // Base configuration
    const alternateRefs = ALTERNATE_DOMAINS.map(domain => ({
      href: `${domain}${path}`,
      hreflang: 'en',
    }));

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs,
    };
  },
} 