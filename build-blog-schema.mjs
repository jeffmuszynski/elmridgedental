import fs from 'fs';
import { domain, dentistEntityRef } from './site-helpers.mjs';

const publisher = {
  '@type': 'Organization',
  name: 'Elm Ridge Implant and Family Dentistry',
  logo: {
    '@type': 'ImageObject',
    url: `${domain}/square%20logo.webp`,
  },
};

const defaultAuthor = {
  '@type': 'Person',
  '@id': `${domain}/#dr-jeff`,
  name: 'Dr. Jeff Muszynski, DDS',
  url: `${domain}/#team`,
  jobTitle: 'Dentist',
  worksFor: dentistEntityRef,
};

const posts = [
  {
    file: 'blog/are-dental-implants-painful/index.html',
    path: '/blog/are-dental-implants-painful',
    image: `${domain}/blog-implant-comfort.webp`,
    datePublished: '2026-05-05',
    dateModified: '2026-05-07',
  },
  {
    file: 'blog/cosmetic-dentistry-options-killeen-tx/index.html',
    path: '/blog/cosmetic-dentistry-options-killeen-tx',
    image: `${domain}/blog-cosmetic-options.webp`,
    likelyKayla: true,
    datePublished: '2026-05-05',
    dateModified: '2026-05-07',
  },
  {
    file: 'blog/dental-implant-cost-killeen-tx/index.html',
    path: '/blog/dental-implant-cost-killeen-tx',
    image: `${domain}/blog-implant-cost.webp`,
    datePublished: '2026-05-05',
    dateModified: '2026-05-07',
  },
  {
    file: 'blog/emergency-dentist-killeen-tx/index.html',
    path: '/blog/emergency-dentist-killeen-tx',
    image: `${domain}/blog-emergency-dentist.webp`,
    datePublished: '2026-05-05',
    dateModified: '2026-05-07',
  },
  {
    file: 'blog/implant-dentist-killeen-tx/index.html',
    path: '/blog/implant-dentist-killeen-tx',
    image: `${domain}/blog-implant-dentist.webp`,
    datePublished: '2026-05-05',
    dateModified: '2026-05-07',
  },
  {
    file: 'blog/implants-vs-dentures-vs-bridges/index.html',
    path: '/blog/implants-vs-dentures-vs-bridges',
    image: `${domain}/blog-implants-vs-options.webp`,
    datePublished: '2026-05-05',
    dateModified: '2026-05-07',
  },
  {
    file: 'dental-implants-near-me-in-killeen-how-to-choose-the-right-fit',
    path: '/dental-implants-near-me-in-killeen-how-to-choose-the-right-fit',
    image: `${domain}/cbct-implant-planning-killeen.webp`,
    datePublished: '2026-05-15',
    dateModified: '2026-05-15',
  },
];

function readMeta(file) {
  const html = fs.readFileSync(file, 'utf8');
  const headline = (html.match(/<h1[^>]*>(.*?)<\/h1>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim();
  const description = (html.match(/<meta name="description" content="([^"]*)"/i) || [])[1]?.trim();
  return { html, headline, description };
}

function blogPostingSchema(post, headline, description, datePublished, dateModified) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    image: post.image || `${domain}/Building.webp`,
    datePublished,
    dateModified,
    author: defaultAuthor,
    publisher,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${domain}${post.path}`,
    },
  };
}

function upsertHeadSchema(html, key, obj) {
  const tag = `<script type="application/ld+json" data-schema="${key}">${JSON.stringify(obj)}</script>`;
  if (html.includes(`data-schema="${key}"`)) {
    return html.replace(new RegExp(`<script type="application/ld\\+json" data-schema="${key}">[\\s\\S]*?<\\/script>`), tag);
  }
  return html.replace('</head>', `${tag}</head>`);
}

const blogPostSummaries = [];

for (const post of posts) {
  const { html, headline, description } = readMeta(post.file);
  const datePublished = post.datePublished;
  const dateModified = post.dateModified;
  const schema = blogPostingSchema(post, headline, description, datePublished, dateModified);
  const updated = upsertHeadSchema(html, 'blog-posting', schema);
  fs.writeFileSync(post.file, updated);
  blogPostSummaries.push({
    '@type': 'BlogPosting',
    headline,
    url: `${domain}${post.path}`,
    datePublished,
    image: post.image || `${domain}/Building.webp`,
  });
}

let blogIndex = fs.readFileSync('blog/index.html', 'utf8');
const blogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  '@id': `${domain}/blog#blog`,
  name: 'Elm Ridge Implant and Family Dentistry Blog',
  description: 'Patient-focused dental education from Drs. Jeff and Kayla Muszynski covering implants, cosmetic dentistry, emergencies, costs, and treatment decisions in Killeen, TX.',
  url: `${domain}/blog`,
  publisher,
  blogPost: blogPostSummaries,
};
blogIndex = upsertHeadSchema(blogIndex, 'blog-index', blogSchema);
fs.writeFileSync('blog/index.html', blogIndex);

fs.writeFileSync(
  'blog-schema-report.json',
  JSON.stringify({
    defaultAuthor: defaultAuthor.name,
    likelyKaylaCandidate: posts.filter((post) => post.likelyKayla).map((post) => post.file),
    posts: posts.map((post) => ({
      file: post.file,
      path: post.path,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
      image: post.image || `${domain}/Building.webp`,
    })),
    blogSchema,
  }, null, 2),
);
