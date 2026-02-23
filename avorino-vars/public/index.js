// ════════════════════════════════════════════════════════════════
// Avorino Builder — Blog CMS Migration
// Creates "Blog Posts" CMS collection via Webflow Data API,
// populates with blog posts migrated from Wix.
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, wait, safeCall, getAvorinVars, getOrCreateStyle, clearAndSet, freshStyle, createSharedStyles, setSharedStyleProps, createPageWithSlug, buildCTASection, applyCTAStyleProps, } from './shared.js';
// ── CDN hash (auto-updated) ──
const CDN = 'https://cdn.jsdelivr.net/gh/Rejhinald/avorino@00e47e2';
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
    {
        title: 'The Importance of Proper Planning in Construction Projects in Orange County, CA',
        slug: 'the-importance-of-proper-planning-in-construction-projects-in-orange-county-ca',
        date: '2023-04-15T00:00:00.000Z',
        author: 'Admin Avorino',
        summary: 'Proper planning is the foundation of any successful construction project. Learn why thorough preparation is critical for building in Orange County.',
        image: 'https://static.wixstatic.com/media/78d045_bd3b500c853c4af4a99079daf3ac4a2a~mv2.jpg',
    },
];
// ── Webflow Data API helpers ──
const API_BASE = 'https://api.webflow.com/v2';
async function apiCall(method, path, token, body) {
    const opts = {
        method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'accept': 'application/json',
        },
    };
    if (body)
        opts.body = JSON.stringify(body);
    const res = await fetch(`${API_BASE}${path}`, opts);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(`API ${res.status}: ${data?.message || data?.msg || JSON.stringify(data)}`);
    }
    return data;
}
// ── Create CMS collection ──
async function createBlogCollection(siteId, token) {
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
async function populateBlogPosts(collectionId, token) {
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
        }
        catch (err) {
            logDetail(`  FAILED ${i + 1}/${BLOG_POSTS.length} — ${post.title}: ${err.message}`, 'err');
        }
        await wait(300); // rate limit
    }
    logDetail('Blog posts populated!', 'ok');
}
// ── Build blog listing page ──
async function buildBlogPage(v, s) {
    const { body } = await createPageWithSlug('Blog', 'blog', 'Blog | Avorino Construction', 'Insights on custom homes, ADUs, and construction in Orange County from the Avorino team.');
    // ── Page styles ──
    const blogHero = await getOrCreateStyle('blog-hero');
    const blogHeroContent = await getOrCreateStyle('blog-hero-content');
    const blogHeroSubtitle = await getOrCreateStyle('blog-hero-subtitle');
    const labelLine = await getOrCreateStyle('blog-label-line');
    const blogGridWrap = await getOrCreateStyle('blog-grid-wrap');
    const blogGrid = await getOrCreateStyle('blog-grid');
    const blogCard = await getOrCreateStyle('blog-card');
    const blogCardImgWrap = await getOrCreateStyle('blog-card-img-wrap');
    const blogCardImg = await getOrCreateStyle('blog-card-img');
    const blogCardBody = await getOrCreateStyle('blog-card-body');
    const blogCardDate = await getOrCreateStyle('blog-card-date');
    const blogCardTitle = await getOrCreateStyle('blog-card-title');
    const blogCardSummary = await getOrCreateStyle('blog-card-summary');
    const blogCardLink = await getOrCreateStyle('blog-card-link');
    // ── Build DOM ──
    log('Building blog page elements...');
    // ═══ HERO ═══
    const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
    hero.setTag('section');
    hero.setStyles([blogHero]);
    hero.setAttribute('id', 'blog-hero');
    const heroContent = hero.append(webflow.elementPresets.DOM);
    heroContent.setTag('div');
    heroContent.setStyles([blogHeroContent]);
    // Label with line
    const heroLbl = heroContent.append(webflow.elementPresets.DOM);
    heroLbl.setTag('div');
    heroLbl.setStyles([s.label]);
    heroLbl.setAttribute('data-animate', 'fade-up');
    const heroLblTxt = heroLbl.append(webflow.elementPresets.DOM);
    heroLblTxt.setTag('div');
    heroLblTxt.setTextContent('INSIGHTS');
    const heroLblLine = heroLbl.append(webflow.elementPresets.DOM);
    heroLblLine.setTag('div');
    heroLblLine.setStyles([labelLine]);
    // Heading
    const heroHeading = heroContent.append(webflow.elementPresets.DOM);
    heroHeading.setTag('h1');
    heroHeading.setStyles([s.headingXL]);
    heroHeading.setTextContent('Blog');
    heroHeading.setAttribute('data-animate', 'fade-up');
    // Subtitle
    const heroSub = heroContent.append(webflow.elementPresets.DOM);
    heroSub.setTag('p');
    heroSub.setStyles([blogHeroSubtitle]);
    heroSub.setTextContent('Expert insights on custom homes, ADUs, building permits, and construction trends in Orange County.');
    heroSub.setAttribute('data-animate', 'fade-up');
    await safeCall('append:hero', () => body.append(hero));
    // ═══ BLOG GRID (CMS Collection List) ═══
    const gridSection = webflow.elementBuilder(webflow.elementPresets.DOM);
    gridSection.setTag('section');
    gridSection.setStyles([blogGridWrap]);
    // Try DynamoWrapper (Collection List) — falls back to static cards if unsupported
    let usedCMS = false;
    try {
        log('Attempting CMS Collection List (DynamoWrapper)...');
        const dynamo = gridSection.append(webflow.elementPresets.DynamoWrapper);
        dynamo.setStyles([blogGrid]);
        logDetail('DynamoWrapper created — bind to Blog Posts collection in Designer', 'ok');
        usedCMS = true;
    }
    catch (err) {
        logDetail(`DynamoWrapper not supported: ${err.message} — using static cards`, 'err');
        const grid = gridSection.append(webflow.elementPresets.DOM);
        grid.setTag('div');
        grid.setStyles([blogGrid]);
        for (const post of BLOG_POSTS) {
            const card = grid.append(webflow.elementPresets.DOM);
            card.setTag('a');
            card.setStyles([blogCard]);
            card.setAttribute('href', `/blog-posts/${post.slug}`);
            const imgWrap = card.append(webflow.elementPresets.DOM);
            imgWrap.setTag('div');
            imgWrap.setStyles([blogCardImgWrap]);
            const img = imgWrap.append(webflow.elementPresets.DOM);
            img.setTag('img');
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
            const readMore = cardBody.append(webflow.elementPresets.DOM);
            readMore.setTag('span');
            readMore.setStyles([blogCardLink]);
            readMore.setTextContent('Read Article \u2192');
        }
    }
    await safeCall('append:grid', () => body.append(gridSection));
    if (usedCMS) {
        log('Collection List added! Now in Designer: select it → connect to "Blog Posts" collection → design the card template inside.', 'info');
    }
    // ═══ CTA ═══
    await buildCTASection(body, v, 'Ready to Build Your Dream Home?', 'Get a Free Estimate', '/free-estimate');
    logDetail('Blog page elements built', 'ok');
    // ── Apply style properties ──
    log('Applying blog style properties...');
    await clearAndSet(await freshStyle('blog-hero'), 'blog-hero', {
        'min-height': '60vh', 'display': 'flex', 'align-items': 'flex-end',
        'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
        'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
        'background-color': v['av-dark'], 'color': v['av-cream'],
        'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('blog-hero-content'), 'blog-hero-content', {
        'max-width': '800px',
    });
    await clearAndSet(await freshStyle('blog-hero-subtitle'), 'blog-hero-subtitle', {
        'font-family': 'DM Sans', 'font-size': v['av-text-body'],
        'line-height': '1.9', 'opacity': '0.6', 'margin-top': '24px', 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('blog-label-line'), 'blog-label-line', {
        'flex-grow': '1', 'height': '1px', 'background-color': v['av-dark-15'],
    });
    await wait(500);
    await clearAndSet(await freshStyle('blog-grid-wrap'), 'blog-grid-wrap', {
        'padding-top': v['av-section-pad-y'], 'padding-bottom': v['av-section-pad-y'],
        'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
        'background-color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('blog-grid'), 'blog-grid', {
        'display': 'grid',
        'grid-template-columns': '1fr 1fr 1fr',
        'grid-column-gap': v['av-gap-md'],
        'grid-row-gap': v['av-gap-lg'],
        'max-width': '1200px', 'margin-left': 'auto', 'margin-right': 'auto',
    });
    await clearAndSet(await freshStyle('blog-card'), 'blog-card', {
        'background-color': '#ffffff',
        'border-top-left-radius': v['av-radius'],
        'border-top-right-radius': v['av-radius'],
        'border-bottom-left-radius': v['av-radius'],
        'border-bottom-right-radius': v['av-radius'],
        'overflow-x': 'hidden', 'overflow-y': 'hidden',
        'display': 'flex', 'flex-direction': 'column',
        'box-shadow': '0 2px 20px rgba(0, 0, 0, 0.06)',
        'text-decoration': 'none', 'color': v['av-dark'],
    });
    await clearAndSet(await freshStyle('blog-card-img-wrap'), 'blog-card-img-wrap', {
        'overflow-x': 'hidden', 'overflow-y': 'hidden',
        'height': '240px',
    });
    await clearAndSet(await freshStyle('blog-card-img'), 'blog-card-img', {
        'width': '100%', 'height': '100%',
        'object-fit': 'cover',
    });
    await wait(500);
    await clearAndSet(await freshStyle('blog-card-body'), 'blog-card-body', {
        'padding-top': '32px', 'padding-bottom': '32px',
        'padding-left': '32px', 'padding-right': '32px',
        'display': 'flex', 'flex-direction': 'column',
        'grid-row-gap': '12px', 'flex-grow': '1',
    });
    await clearAndSet(await freshStyle('blog-card-date'), 'blog-card-date', {
        'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
        'letter-spacing': '0.15em', 'text-transform': 'uppercase',
        'opacity': '0.4', 'margin-top': '0px', 'margin-bottom': '0px',
        'color': v['av-dark'],
    });
    await clearAndSet(await freshStyle('blog-card-title'), 'blog-card-title', {
        'font-family': 'DM Serif Display', 'font-size': '22px',
        'line-height': '1.25', 'font-weight': '400',
        'margin-top': '0px', 'margin-bottom': '0px',
        'color': v['av-dark'],
    });
    await clearAndSet(await freshStyle('blog-card-summary'), 'blog-card-summary', {
        'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
        'line-height': '1.7', 'font-weight': '400',
        'opacity': '0.6', 'margin-top': '0px', 'margin-bottom': '0px',
        'color': v['av-dark'],
        'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('blog-card-link'), 'blog-card-link', {
        'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
        'color': v['av-dark'], 'opacity': '0.5',
        'margin-top': 'auto', 'padding-top': '8px',
    });
    await wait(500);
    await applyCTAStyleProps(v);
    logDetail('Blog style properties applied', 'ok');
}
// ── Build Blog Post Template (individual post page) ──
async function buildBlogTemplate(v, s) {
    log('Building blog post template on current page...');
    const allElements = await safeCall('getAllElements', () => webflow.getAllElements());
    const body = allElements[0];
    // Guard: prevent duplicate builds
    const children = await body.getChildren();
    if (children && children.length > 0) {
        log('Page already has content — undo first or use a blank page.');
        return;
    }
    logDetail(`Got body element (${allElements.length} elements on page)`, 'ok');
    // ── Create template-specific styles ──
    const btHero = await getOrCreateStyle('bt-hero');
    const btHeroInner = await getOrCreateStyle('bt-hero-inner');
    const btLabel = await getOrCreateStyle('bt-label');
    const btLabelLine = await getOrCreateStyle('bt-label-line');
    const btMeta = await getOrCreateStyle('bt-meta');
    const btMetaItem = await getOrCreateStyle('bt-meta-item');
    const btMetaLabel = await getOrCreateStyle('bt-meta-label');
    const btMetaValue = await getOrCreateStyle('bt-meta-value');
    const btTitle = await getOrCreateStyle('bt-title');
    const btFeaturedImg = await getOrCreateStyle('bt-featured-img');
    const btImgWrap = await getOrCreateStyle('bt-img-wrap');
    const btArticle = await getOrCreateStyle('bt-article');
    const btArticleInner = await getOrCreateStyle('bt-article-inner');
    const btRichText = await getOrCreateStyle('bt-rich-text');
    const btBackLink = await getOrCreateStyle('bt-back-link');
    const btDivider = await getOrCreateStyle('bt-divider');
    // ═══ SECTION 1: HERO ═══
    log('Building hero section...');
    const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
    hero.setTag('section');
    hero.setStyles([btHero]);
    const heroInner = hero.append(webflow.elementPresets.DOM);
    heroInner.setTag('div');
    heroInner.setStyles([btHeroInner]);
    // Label with line
    const labelRow = heroInner.append(webflow.elementPresets.DOM);
    labelRow.setTag('div');
    labelRow.setStyles([btLabel]);
    const labelTxt = labelRow.append(webflow.elementPresets.DOM);
    labelTxt.setTag('div');
    labelTxt.setTextContent('BLOG');
    const labelLine = labelRow.append(webflow.elementPresets.DOM);
    labelLine.setTag('div');
    labelLine.setStyles([btLabelLine]);
    // Title — bind to CMS "Name"
    const title = heroInner.append(webflow.elementPresets.DOM);
    title.setTag('h1');
    title.setStyles([btTitle]);
    title.setTextContent('Blog Post Title');
    // Meta row
    const meta = heroInner.append(webflow.elementPresets.DOM);
    meta.setTag('div');
    meta.setStyles([btMeta]);
    // Author — bind "Author Name" span to CMS "Author"
    const authorWrap = meta.append(webflow.elementPresets.DOM);
    authorWrap.setTag('div');
    authorWrap.setStyles([btMetaItem]);
    const authorLbl = authorWrap.append(webflow.elementPresets.DOM);
    authorLbl.setTag('span');
    authorLbl.setStyles([btMetaLabel]);
    authorLbl.setTextContent('Written by');
    const authorVal = authorWrap.append(webflow.elementPresets.DOM);
    authorVal.setTag('span');
    authorVal.setStyles([btMetaValue]);
    authorVal.setTextContent('Author Name');
    // Divider dot
    const dot = meta.append(webflow.elementPresets.DOM);
    dot.setTag('span');
    dot.setStyles([btMetaLabel]);
    dot.setTextContent('\u00B7');
    // Date — bind "January 1, 2025" span to CMS "Publish Date"
    const dateWrap = meta.append(webflow.elementPresets.DOM);
    dateWrap.setTag('div');
    dateWrap.setStyles([btMetaItem]);
    const dateLbl = dateWrap.append(webflow.elementPresets.DOM);
    dateLbl.setTag('span');
    dateLbl.setStyles([btMetaLabel]);
    dateLbl.setTextContent('Published');
    const dateVal = dateWrap.append(webflow.elementPresets.DOM);
    dateVal.setTag('span');
    dateVal.setStyles([btMetaValue]);
    dateVal.setTextContent('January 1, 2025');
    await safeCall('append:hero', () => body.append(hero));
    logDetail('Hero section appended', 'ok');
    // ═══ SECTION 2: FEATURED IMAGE ═══
    log('Building featured image section...');
    const imgSection = webflow.elementBuilder(webflow.elementPresets.DOM);
    imgSection.setTag('section');
    imgSection.setStyles([btImgWrap]);
    // Try native Image preset, fall back to placeholder div
    try {
        const img = imgSection.append(webflow.elementPresets.Image);
        img.setStyles([btFeaturedImg]);
        logDetail('Native Image element created — bind to CMS "Featured Image"', 'ok');
    }
    catch (_e) {
        logDetail('Image preset not supported — drag Image into bt-img-wrap in Designer', 'err');
    }
    await safeCall('append:img', () => body.append(imgSection));
    logDetail('Featured image section appended', 'ok');
    // ═══ SECTION 3: ARTICLE BODY ═══
    log('Building article body section...');
    const article = webflow.elementBuilder(webflow.elementPresets.DOM);
    article.setTag('section');
    article.setStyles([btArticle]);
    const articleInner = article.append(webflow.elementPresets.DOM);
    articleInner.setTag('div');
    articleInner.setStyles([btArticleInner]);
    // Try native RichText preset, fall back to div
    try {
        const richText = articleInner.append(webflow.elementPresets.RichText);
        richText.setStyles([btRichText]);
        logDetail('Native RichText element created — bind to CMS "Post Body"', 'ok');
    }
    catch (_e) {
        logDetail('RichText preset not supported — drag Rich Text into bt-article-inner in Designer', 'err');
    }
    // Divider
    const divider = articleInner.append(webflow.elementPresets.DOM);
    divider.setTag('div');
    divider.setStyles([btDivider]);
    // Back to blog link
    const backLink = articleInner.append(webflow.elementPresets.DOM);
    backLink.setTag('a');
    backLink.setStyles([btBackLink]);
    backLink.setTextContent('\u2190 Back to Blog');
    backLink.setAttribute('href', '/blog');
    await safeCall('append:article', () => body.append(article));
    logDetail('Article body section appended', 'ok');
    // ═══ SECTION 4: CTA ═══
    log('Building CTA section...');
    await buildCTASection(body, v, 'Ready to Build Your Dream Home?', 'Get a Free Estimate', '/free-estimate');
    // ═══ APPLY STYLE PROPERTIES ═══
    log('Applying template style properties...');
    await clearAndSet(await freshStyle('bt-hero'), 'bt-hero', {
        'min-height': '50vh', 'display': 'flex', 'align-items': 'flex-end',
        'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
        'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
        'background-color': v['av-dark'], 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('bt-hero-inner'), 'bt-hero-inner', {
        'max-width': '800px', 'margin-left': 'auto', 'margin-right': 'auto',
        'text-align': 'center', 'width': '100%',
    });
    await clearAndSet(await freshStyle('bt-label'), 'bt-label', {
        'display': 'flex', 'align-items': 'center', 'grid-column-gap': '16px',
        'font-family': 'DM Sans', 'font-size': '11px',
        'letter-spacing': '0.25em', 'text-transform': 'uppercase',
        'opacity': '0.4', 'margin-bottom': '32px',
        'justify-content': 'center',
    });
    await clearAndSet(await freshStyle('bt-label-line'), 'bt-label-line', {
        'width': '48px', 'height': '1px', 'background-color': v['av-dark-15'],
    });
    await clearAndSet(await freshStyle('bt-title'), 'bt-title', {
        'font-family': 'DM Serif Display', 'font-size': 'clamp(32px, 5vw, 56px)',
        'line-height': '1.15', 'letter-spacing': '-0.02em', 'font-weight': '400',
        'margin-top': '0px', 'margin-bottom': '40px', 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('bt-meta'), 'bt-meta', {
        'display': 'flex', 'justify-content': 'center', 'align-items': 'center',
        'grid-column-gap': '20px', 'grid-row-gap': '12px',
        'flex-wrap': 'wrap',
    });
    await clearAndSet(await freshStyle('bt-meta-item'), 'bt-meta-item', {
        'display': 'flex', 'align-items': 'center', 'grid-column-gap': '8px',
        'font-family': 'DM Sans', 'font-size': '14px',
    });
    await clearAndSet(await freshStyle('bt-meta-label'), 'bt-meta-label', {
        'opacity': '0.4', 'font-family': 'DM Sans', 'font-size': '14px',
    });
    await clearAndSet(await freshStyle('bt-meta-value'), 'bt-meta-value', {
        'opacity': '0.7', 'font-weight': '500',
    });
    await wait(500);
    await clearAndSet(await freshStyle('bt-img-wrap'), 'bt-img-wrap', {
        'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
        'padding-top': v['av-gap-lg'], 'padding-bottom': '0px',
        'background-color': v['av-cream'],
        'display': 'flex', 'justify-content': 'center',
    });
    await clearAndSet(await freshStyle('bt-featured-img'), 'bt-featured-img', {
        'width': '100%', 'max-width': '900px',
        'padding-bottom': '56.25%',
        'background-position': '50% 50%', 'background-size': 'cover',
        'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
        'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
        'display': 'block',
    });
    await clearAndSet(await freshStyle('bt-article'), 'bt-article', {
        'padding-top': v['av-gap-xl'], 'padding-bottom': v['av-section-pad-y'],
        'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
        'background-color': v['av-cream'], 'color': v['av-dark'],
    });
    await clearAndSet(await freshStyle('bt-article-inner'), 'bt-article-inner', {
        'max-width': '720px', 'margin-left': 'auto', 'margin-right': 'auto',
    });
    await clearAndSet(await freshStyle('bt-rich-text'), 'bt-rich-text', {
        'font-family': 'DM Sans', 'font-size': '18px',
        'line-height': '2.6', 'color': v['av-dark'],
        'letter-spacing': '0.01em',
    });
    await clearAndSet(await freshStyle('bt-divider'), 'bt-divider', {
        'width': '80px', 'height': '1px',
        'background-color': v['av-dark-15'],
        'margin-top': '64px', 'margin-bottom': '40px',
    });
    await clearAndSet(await freshStyle('bt-back-link'), 'bt-back-link', {
        'display': 'inline-block',
        'font-family': 'DM Sans', 'font-size': '15px',
        'font-weight': '500', 'letter-spacing': '0.02em',
        'color': v['av-dark'], 'opacity': '0.45',
        'text-decoration': 'none',
    });
    await wait(500);
    await applyCTAStyleProps(v);
    logDetail('Template style properties applied', 'ok');
    log('Blog post template built! Now bind CMS fields to each element.', 'success');
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
// ── UI: Add template builder + API token input ──
function addExtraUI() {
    const statusEl = document.getElementById('status');
    const extraUI = document.createElement('div');
    extraUI.innerHTML = `
    <div class="divider"></div>
    <div class="section-label">Blog Post Template</div>
    <p style="font-size:12px;opacity:0.6;margin:0 0 8px;">Open the "Blog Posts Template" page first, then click below.</p>
    <button id="build-template" class="btn-secondary" style="width:100%;margin-bottom:16px;">Build Blog Post Template</button>
    <div class="divider"></div>
    <div class="section-label">CMS Migration (Webflow API)</div>
    <input id="api-token" type="text" placeholder="Webflow API Token" style="width:100%;padding:8px 12px;margin-bottom:8px;border:1px solid #ccc;border-radius:6px;font-size:13px;box-sizing:border-box;">
    <input id="site-id" type="text" placeholder="Site ID" style="width:100%;padding:8px 12px;margin-bottom:8px;border:1px solid #ccc;border-radius:6px;font-size:13px;box-sizing:border-box;">
    <button id="migrate-cms" class="btn-secondary" style="width:100%;">Create Collection + Populate Posts</button>
  `;
    statusEl.parentNode.insertBefore(extraUI, statusEl);
}
// ── Init ──
const pageName = document.getElementById('page-name');
pageName.textContent = 'Blog';
addExtraUI();
// Build template button (for Blog Posts Template page)
document.getElementById('build-template')?.addEventListener('click', async () => {
    clearErrorLog();
    try {
        log('Loading variables...', 'info');
        const v = await getAvorinVars();
        log('Creating shared styles...', 'info');
        const s = await createSharedStyles();
        log('Setting shared style properties...', 'info');
        await setSharedStyleProps(s, v);
        await buildBlogTemplate(v, s);
        // Show head/footer code
        const headEl = document.getElementById('head-code');
        const footerEl = document.getElementById('footer-code');
        if (headEl)
            headEl.textContent = HEAD_CODE;
        if (footerEl)
            footerEl.textContent = FOOTER_CODE;
    }
    catch (err) {
        log(`Template error: ${err.message}`, 'error');
        logDetail(`Template error: ${err.message}`, 'err');
    }
});
// CMS migration button
document.getElementById('migrate-cms')?.addEventListener('click', async () => {
    const token = document.getElementById('api-token').value.trim();
    const siteId = document.getElementById('site-id').value.trim();
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
    }
    catch (err) {
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
        if (headEl)
            headEl.textContent = HEAD_CODE;
        if (footerEl)
            footerEl.textContent = FOOTER_CODE;
        log('Blog page built! See custom code below.', 'success');
    }
    catch (err) {
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
    }
    catch (err) {
        log(`Error: ${err.message}`, 'error');
    }
});
