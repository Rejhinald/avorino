// ════════════════════════════════════════════════════════════════
// Avorino Builder — Blog CMS Migration
// Creates "Blog Posts" CMS collection via Webflow Data API,
// populates with blog posts migrated from Wix.
// ════════════════════════════════════════════════════════════════

import {
  webflow, log, logDetail, clearErrorLog, wait,
  safeCall, getAvorinVars,
  getOrCreateStyle, clearAndSet, freshStyle,
  createSharedStyles, setSharedStyleProps,
  createPageWithSlug, buildCTASection,
} from './shared';

// ── CDN hash (auto-updated) ──
const CDN = 'https://cdn.jsdelivr.net/gh/Rejhinald/avorino@3f8063a';
const CALENDLY_CSS = '<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">';
const CALENDLY_JS = '<script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>';

// ── Blog post data (scraped from Wix) ──
const BLOG_POSTS = [
  {
    title: 'Maximizing Energy Efficiency in Your Custom Home',
    slug: 'maximizing-energy-efficiency-in-your-custom-home',
    date: '2025-03-27T00:00:00.000Z',
    author: 'Admin Avorino',
    summary: 'How to reduce utility costs, improve comfort, and lower environmental impact? Key energy-efficient features to consider.',
    image: 'https://static.wixstatic.com/media/11062b_c68182fbfc224eee8aa7825605dcb461~mv2.jpg',
  },
  {
    title: 'How Potential Tariffs Could Impact the ADU Market',
    slug: 'how-potential-tariffs-could-impact-the-adu-market-and-micro-construction-industry',
    date: '2025-02-19T00:00:00.000Z',
    author: 'Admin Avorino',
    summary: 'This will help you understand how the potential tariff will affect building ADU in your property.',
    image: 'https://static.wixstatic.com/media/11062b_b4fd5956141849c781c58d3c109c145c~mv2.jpeg',
  },
  {
    title: 'Rebuilding After Fire: A Chance to Build Luxurious, Safe, and Sustainable Custom Homes',
    slug: 'rebuilding-after-fire-a-chance-to-build-luxurious-safe-and-sustainable-custom-homes',
    date: '2025-02-10T00:00:00.000Z',
    author: 'Admin Avorino',
    summary: 'The opportunity to rebuild after the wildfire comes with the chance to reimagine your home and tailor it to your lifestyle.',
    image: 'https://static.wixstatic.com/media/b3a9a1_2f5f778c7e124ff79f87a3062380b07d~mv2.jpg',
  },
  {
    title: 'Custom Home Builder Orange County: Custom vs Spec Homes Explained',
    slug: 'custom-home-builder-orange-county-custom-vs-spec-homes-explained',
    date: '2025-02-07T00:00:00.000Z',
    author: 'Avorino',
    summary: 'Compare custom vs spec homes in Orange County. Hire a trusted custom home builder Orange County to build your dream home today.',
    image: 'https://static.wixstatic.com/media/5a3eca_aa34e6b7a8d441f4b5b4527332cda458~mv2.png',
  },
  {
    title: 'Wildfire-Resistant Landscaping for Custom Homes',
    slug: 'wildfire-resistant-landscaping-for-custom-homes',
    date: '2025-01-31T00:00:00.000Z',
    author: 'Admin Avorino',
    summary: 'Wildfires are a growing concern in many regions. Creating a landscape that prioritizes safety without compromising beauty is essential.',
    image: 'https://static.wixstatic.com/media/06e87b_392f96af6f4f49ebb9d5fa4378a5ea81~mv2.jpg',
  },
  {
    title: 'Shaping the Future of Construction: The Fascinating Impact of 3D Renderings on ADU Projects',
    slug: 'shaping-the-future-of-construction-the-fascinating-impact-of-3d-renderings-on-adu-projects',
    date: '2024-03-31T00:00:00.000Z',
    author: 'Avo Rino',
    summary: 'In the dynamic landscape of home expansion and construction, 3D renderings have emerged as a game-changer for ADUs in Orange County.',
    image: 'https://static.wixstatic.com/media/06e87b_663ad4dffe8149ebadf65a1102e6cc8e~mv2.jpg',
  },
  {
    title: "Avorino's Guide to ADU Construction in Orange County: What You Need to Know",
    slug: 'avorino-s-guide-to-adu-construction-in-orange-county-what-you-need-to-know',
    date: '2023-07-19T00:00:00.000Z',
    author: 'Avorino',
    summary: 'Learn everything about ADU construction in Orange County with Avorino. From foundation to finish, increase property value and rental income.',
    image: 'https://static.wixstatic.com/media/e962d0f54c71471b8962607de56eaaff.jpg',
  },
  {
    title: 'Understanding the Process of Obtaining Building Permits in Orange County, CA',
    slug: 'understanding-the-process-of-obtaining-building-permits-in-orange-county-ca',
    date: '2023-05-21T00:00:00.000Z',
    author: 'Avo Rino',
    summary: 'Building permits are essential documents that ensure compliance with local regulations and the safety of structures being built or modified.',
    image: 'https://static.wixstatic.com/media/06e87b_2cca91b00cde44908ed48a8c9d49664b~mv2.png',
  },
  {
    title: 'How to Choose the Right Construction Company for Your Project: Why Avorino is the Right Choice in OC',
    slug: 'how-to-choose-the-right-construction-company-for-your-project-why-avorino-is-the-right-choice-in-oc',
    date: '2023-05-20T00:00:00.000Z',
    author: 'Avo Rino',
    summary: 'Choosing the right construction company for your project is a crucial decision that can greatly impact the outcome and success of your endeavor.',
    image: 'https://static.wixstatic.com/media/06e87b_e22f81b1a1844287bd57f2db7ff2d2fa~mv2.jpg',
  },
];

// ── Webflow Data API helpers ──
const API_BASE = 'https://api.webflow.com/v2';

async function apiCall(method: string, path: string, token: string, body?: any) {
  const opts: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${path}`, opts);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${data?.message || data?.msg || JSON.stringify(data)}`);
  }
  return data;
}

// ── Create CMS collection ──
async function createBlogCollection(siteId: string, token: string) {
  logDetail('Creating "Blog Posts" CMS collection...', 'info');

  const collection = await apiCall('POST', `/sites/${siteId}/collections`, token, {
    displayName: 'Blog Posts',
    singularName: 'Blog Post',
    slug: 'blog-posts',
    fields: [
      { displayName: 'Post Summary', type: 'PlainText', isRequired: false, slug: 'post-summary' },
      { displayName: 'Post Body', type: 'RichText', isRequired: false, slug: 'post-body' },
      { displayName: 'Thumbnail', type: 'ImageRef', isRequired: false, slug: 'thumbnail' },
      { displayName: 'Author', type: 'PlainText', isRequired: false, slug: 'author' },
      { displayName: 'Publish Date', type: 'Date', isRequired: false, slug: 'publish-date' },
    ],
  });

  logDetail(`Collection created: ${collection.id}`, 'ok');
  return collection.id;
}

// ── Populate blog posts ──
async function populateBlogPosts(collectionId: string, token: string) {
  logDetail(`Populating ${BLOG_POSTS.length} blog posts...`, 'info');

  for (let i = 0; i < BLOG_POSTS.length; i++) {
    const post = BLOG_POSTS[i];
    try {
      await apiCall('POST', `/collections/${collectionId}/items`, token, {
        isArchived: false,
        isDraft: false,
        fieldData: {
          name: post.title,
          slug: post.slug,
          'post-summary': post.summary,
          'post-body': `<p>${post.summary}</p><p><em>Full article content to be added.</em></p>`,
          'author': post.author,
          'publish-date': post.date,
        },
      });
      logDetail(`  ${i + 1}/${BLOG_POSTS.length} — ${post.title}`, 'ok');
    } catch (err: any) {
      logDetail(`  FAILED ${i + 1}/${BLOG_POSTS.length} — ${post.title}: ${err.message}`, 'err');
    }
    await wait(300); // rate limit
  }

  logDetail('Blog posts populated!', 'ok');
}

// ── Build blog listing page ──
async function buildBlogPage(v: Record<string, any>, s: Record<string, any>) {
  const { body } = await createPageWithSlug('Blog', 'blog', 'Blog | Avorino Construction', 'Insights on custom homes, ADUs, and construction in Orange County from the Avorino team.');

  // ── Page styles ──
  const blogHero = await getOrCreateStyle('blog-hero');
  const blogGrid = await getOrCreateStyle('blog-grid');
  const blogCard = await getOrCreateStyle('blog-card');
  const blogCardImg = await getOrCreateStyle('blog-card-img');
  const blogCardBody = await getOrCreateStyle('blog-card-body');
  const blogCardDate = await getOrCreateStyle('blog-card-date');
  const blogCardTitle = await getOrCreateStyle('blog-card-title');
  const blogCardSummary = await getOrCreateStyle('blog-card-summary');

  // ── Build DOM ──
  log('Building blog page elements...');

  // Hero
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([s.sectionDark]);

  const heroLabel = hero.append(webflow.elementPresets.DOM);
  heroLabel.setTag('p');
  heroLabel.setStyles([s.label]);
  heroLabel.setTextContent('INSIGHTS');

  const heroHeading = hero.append(webflow.elementPresets.DOM);
  heroHeading.setTag('h1');
  heroHeading.setStyles([s.headingXL]);
  heroHeading.setTextContent('Blog');

  const heroBody = hero.append(webflow.elementPresets.DOM);
  heroBody.setTag('p');
  heroBody.setStyles([s.body, s.bodyMuted]);
  heroBody.setTextContent('Expert insights on custom homes, ADUs, building permits, and construction trends in Orange County.');

  // Blog grid section
  const gridSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  gridSection.setTag('section');
  gridSection.setStyles([s.sectionCream]);

  const grid = gridSection.append(webflow.elementPresets.DOM);
  grid.setTag('div');
  grid.setStyles([blogGrid]);

  // Blog cards
  for (const post of BLOG_POSTS) {
    const card = grid.append(webflow.elementPresets.DOM);
    card.setTag('div');
    card.setStyles([blogCard]);

    const img = card.append(webflow.elementPresets.Image);
    img.setStyles([blogCardImg]);
    img.setAttribute('src', post.image);
    img.setAttribute('alt', post.title);

    const cardBody = card.append(webflow.elementPresets.DOM);
    cardBody.setTag('div');
    cardBody.setStyles([blogCardBody]);

    const date = cardBody.append(webflow.elementPresets.DOM);
    date.setTag('p');
    date.setStyles([blogCardDate]);
    date.setTextContent(new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));

    const title = cardBody.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setStyles([blogCardTitle]);
    title.setTextContent(post.title);

    const summary = cardBody.append(webflow.elementPresets.DOM);
    summary.setTag('p');
    summary.setStyles([blogCardSummary]);
    summary.setTextContent(post.summary);
  }

  // Append to body
  await safeCall('append:hero', () => body.append(hero));
  await safeCall('append:grid', () => body.append(gridSection));

  // CTA
  await buildCTASection(body, v, 'Ready to Build Your Dream Home?', 'Get a Free Estimate', '/free-estimate');

  logDetail('Blog page elements built', 'ok');

  // ── Apply style properties ──
  log('Applying blog style properties...');

  await clearAndSet(await freshStyle('blog-hero'), 'blog-hero', {
    'padding-top': v['av-section-pad-y'], 'padding-bottom': v['av-section-pad-y'],
    'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
    'background-color': v['av-dark'], 'color': v['av-cream'],
    'text-align': 'center',
  });

  await clearAndSet(await freshStyle('blog-grid'), 'blog-grid', {
    'display': 'grid',
    'grid-template-columns': '1fr 1fr 1fr',
    'grid-column-gap': v['av-gap-lg'],
    'grid-row-gap': v['av-gap-lg'],
  });

  await clearAndSet(await freshStyle('blog-card'), 'blog-card', {
    'background-color': '#ffffff',
    'border-top-left-radius': v['av-radius'],
    'border-top-right-radius': v['av-radius'],
    'border-bottom-left-radius': v['av-radius'],
    'border-bottom-right-radius': v['av-radius'],
    'overflow-x': 'hidden', 'overflow-y': 'hidden',
    'display': 'flex', 'flex-direction': 'column',
    'box-shadow': '0 2px 20px rgba(0, 0, 0, 0.08)',
  });

  await clearAndSet(await freshStyle('blog-card-img'), 'blog-card-img', {
    'width': '100%', 'height': '220px',
    'object-fit': 'cover',
  });

  await clearAndSet(await freshStyle('blog-card-body'), 'blog-card-body', {
    'padding-top': '28px', 'padding-bottom': '28px',
    'padding-left': '28px', 'padding-right': '28px',
    'display': 'flex', 'flex-direction': 'column',
    'grid-row-gap': '12px',
  });

  await clearAndSet(await freshStyle('blog-card-date'), 'blog-card-date', {
    'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
    'letter-spacing': '0.15em', 'text-transform': 'uppercase',
    'opacity': '0.5', 'margin-top': '0px', 'margin-bottom': '0px',
    'color': v['av-dark'],
  });

  await clearAndSet(await freshStyle('blog-card-title'), 'blog-card-title', {
    'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
    'line-height': '1.2', 'font-weight': '400',
    'margin-top': '0px', 'margin-bottom': '0px',
    'color': v['av-dark'],
  });

  await clearAndSet(await freshStyle('blog-card-summary'), 'blog-card-summary', {
    'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
    'line-height': '1.7', 'font-weight': '400',
    'opacity': '0.7', 'margin-top': '0px', 'margin-bottom': '0px',
    'color': v['av-dark'],
    'display': '-webkit-box',
    '-webkit-line-clamp': '3',
    '-webkit-box-orient': 'vertical',
    'overflow-x': 'hidden', 'overflow-y': 'hidden',
  });
  await wait(500);

  logDetail('Blog style properties applied', 'ok');
}

// ── Head / Footer output ──
const HEAD_CODE = [
  `<link rel="stylesheet" href="${CDN}/avorino-responsive.css">`,
  `<link rel="stylesheet" href="${CDN}/avorino-nav-footer.css">`,
  `<link rel="stylesheet" href="${CDN}/avorino-blog.css">`,
  CALENDLY_CSS,
].join('\n');

const FOOTER_CODE = [
  `<script src="${CDN}/avorino-blog.js"></script>`,
  CALENDLY_JS,
].join('\n');

// ── UI: Add API token input ──
function addApiTokenUI() {
  const container = document.querySelector('.container')!;
  const buildBtn = document.getElementById('build-page')!;

  const tokenSection = document.createElement('div');
  tokenSection.innerHTML = `
    <div class="divider"></div>
    <div class="section-label">CMS Migration (Webflow API)</div>
    <input id="api-token" type="text" placeholder="Webflow API Token" style="width:100%;padding:8px 12px;margin-bottom:8px;border:1px solid #ccc;border-radius:6px;font-size:13px;box-sizing:border-box;">
    <input id="site-id" type="text" placeholder="Site ID" style="width:100%;padding:8px 12px;margin-bottom:8px;border:1px solid #ccc;border-radius:6px;font-size:13px;box-sizing:border-box;">
    <button id="migrate-cms" class="btn-secondary" style="width:100%;">Create Collection + Populate Posts</button>
  `;
  container.insertBefore(tokenSection, buildBtn.parentElement?.nextSibling || null);
}

// ── Init ──
const pageName = document.getElementById('page-name')!;
pageName.textContent = 'Blog';
addApiTokenUI();

// CMS migration button
document.getElementById('migrate-cms')?.addEventListener('click', async () => {
  const token = (document.getElementById('api-token') as HTMLInputElement).value.trim();
  const siteId = (document.getElementById('site-id') as HTMLInputElement).value.trim();

  if (!token || !siteId) {
    log('Enter both API Token and Site ID', 'error');
    return;
  }

  clearErrorLog();
  try {
    log('Creating CMS collection...', 'info');
    const collectionId = await createBlogCollection(siteId, token);

    log('Populating blog posts...', 'info');
    await populateBlogPosts(collectionId, token);

    log('CMS migration complete!', 'success');
  } catch (err: any) {
    log(`CMS Error: ${err.message}`, 'error');
    logDetail(`CMS Error: ${err.message}`, 'err');
  }
});

// Build page button
document.getElementById('build-page')?.addEventListener('click', async () => {
  clearErrorLog();
  try {
    log('Loading variables...', 'info');
    const v = await getAvorinVars();

    log('Creating shared styles...', 'info');
    const s = await createSharedStyles();

    log('Setting shared style properties...', 'info');
    await setSharedStyleProps(s, v);

    await buildBlogPage(v, s);

    // Show head/footer code
    const headEl = document.getElementById('head-code');
    const footerEl = document.getElementById('footer-code');
    if (headEl) headEl.textContent = HEAD_CODE;
    if (footerEl) footerEl.textContent = FOOTER_CODE;

    log('Blog page built! See custom code below.', 'success');
  } catch (err: any) {
    log(`Build error: ${err.message}`, 'error');
    logDetail(`Build error: ${err.message}`, 'err');
  }
});

// Variable injection
document.getElementById('inject-btn')?.addEventListener('click', async () => {
  clearErrorLog();
  try {
    const { createAllVariables } = await import('./shared');
    await createAllVariables();
    log('Variables created!', 'success');
  } catch (err: any) {
    log(`Error: ${err.message}`, 'error');
  }
});
