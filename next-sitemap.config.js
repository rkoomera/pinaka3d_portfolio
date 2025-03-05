/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.pinaka3d.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/*'],
      },
    ],
  },
  exclude: ['/admin/*'],
  generateIndexSitemap: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  outDir: 'public',
} 