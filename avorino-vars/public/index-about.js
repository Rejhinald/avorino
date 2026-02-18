// ════════════════════════════════════════════════════════════════
// Avorino Builder — ABOUT PAGE
// Rename this to index.ts to build the About page.
// ════════════════════════════════════════════════════════════════
import { webflow, log, logDetail, clearErrorLog, wait, safeCall, getAvorinVars, getOrCreateStyle, freshStyle, clearAndSet, createSharedStyles, setSharedStyleProps, createAllVariables, createPageWithSlug, buildCTASection, applyCTAStyleProps, CALENDLY_CSS, CALENDLY_JS, } from './shared.js';
// ── Page config ──
const PAGE_NAME = 'About';
const PAGE_SLUG = 'about';
const PAGE_TITLE = 'About Avorino — Custom Home & ADU Builder in Orange County';
const PAGE_DESC = 'Learn about Avorino, a custom home and ADU builder in Orange County since 2010. Exceptional craftsmanship, innovative design, and unwavering commitment to quality.';
const HEAD_CODE = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@b91dd73/avorino-about-head.css">',
    CALENDLY_CSS,
].join('\n');
const FOOTER_CODE = [
    '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@b91dd73/avorino-about-footer.js"><\/script>',
    '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@b91dd73/avorino-animations.js"><\/script>',
    CALENDLY_JS,
].join('\n');
// ── Update panel UI ──
document.getElementById('page-name').textContent = PAGE_NAME;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
if (headCodeEl)
    headCodeEl.textContent = HEAD_CODE;
if (footerCodeEl)
    footerCodeEl.textContent = FOOTER_CODE;
// ── Build function ──
async function buildAboutPage() {
    clearErrorLog();
    logDetail('Starting About page build...', 'info');
    const v = await getAvorinVars();
    logDetail('Loaded Avorino variable collection', 'ok');
    log('Creating shared styles...');
    const s = await createSharedStyles();
    logDetail('Shared styles done', 'ok');
    // Page-specific styles
    log('Creating page-specific styles...');
    const heroSection = await getOrCreateStyle('about-hero');
    const heroOverlay = await getOrCreateStyle('about-hero-overlay');
    const heroContent = await getOrCreateStyle('about-hero-content');
    const heroSubtitle = await getOrCreateStyle('about-hero-subtitle');
    const storyBody = await getOrCreateStyle('about-story-body');
    const storyImg = await getOrCreateStyle('about-story-img');
    const storyLink = await getOrCreateStyle('about-story-link');
    const maxWidth520 = await getOrCreateStyle('av-max-520');
    const maxWidth580 = await getOrCreateStyle('av-max-580');
    const mb48 = await getOrCreateStyle('av-mb-48');
    const mb64 = await getOrCreateStyle('av-mb-64');
    const mb96 = await getOrCreateStyle('av-mb-96');
    const cardLabel = await getOrCreateStyle('about-card-label');
    const cardHeading = await getOrCreateStyle('about-card-heading');
    const cardBody = await getOrCreateStyle('about-card-body');
    const labelLine = await getOrCreateStyle('about-label-line');
    const statsGrid = await getOrCreateStyle('about-stats-grid');
    const statItem = await getOrCreateStyle('about-stat-item');
    const statNumber = await getOrCreateStyle('about-stat-number');
    const statLabel = await getOrCreateStyle('about-stat-label');
    const valueNumber = await getOrCreateStyle('about-value-num');
    const valueTitle = await getOrCreateStyle('about-value-title');
    const valueDesc = await getOrCreateStyle('about-value-desc');
    const valuesZigzag = await getOrCreateStyle('about-values-zigzag');
    const valuesRow = await getOrCreateStyle('about-values-row');
    const valuesCard = await getOrCreateStyle('about-values-card');
    const valuesSpacer = await getOrCreateStyle('about-values-spacer');
    const valuesSnakeAnchor = await getOrCreateStyle('about-values-snake-anchor');
    const cursorRing = await getOrCreateStyle('cursor-ring');
    const cursorDot = await getOrCreateStyle('cursor-dot');
    // Create page
    const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);
    // Style properties — applied after all elements are built
    async function applyStyleProperties() {
        log('Setting shared style properties...');
        await setSharedStyleProps(s, v);
        logDetail('Shared style properties set', 'ok');
        await wait(1000);
        log('Setting page-specific style properties...');
        await clearAndSet(await freshStyle('about-hero'), 'about-hero', {
            'min-height': '60vh', 'display': 'flex', 'align-items': 'flex-end',
            'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
            'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
            'background-color': v['av-dark'], 'color': v['av-cream'],
            'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
        });
        await clearAndSet(await freshStyle('about-hero-overlay'), 'about-hero-overlay', {
            'position': 'absolute', 'top': '0px', 'left': '0px', 'right': '0px', 'bottom': '0px',
            'background-image': 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
        });
        await clearAndSet(await freshStyle('about-hero-content'), 'about-hero-content', {
            'position': 'relative', 'z-index': '2', 'max-width': '800px',
        });
        await clearAndSet(await freshStyle('about-hero-subtitle'), 'about-hero-subtitle', {
            'font-family': 'DM Sans', 'font-size': v['av-text-body'],
            'line-height': '1.9', 'opacity': '0.6', 'margin-top': '24px', 'color': v['av-cream'],
        });
        await wait(500);
        await clearAndSet(await freshStyle('about-story-body'), 'about-story-body', {
            'display': 'flex', 'flex-direction': 'column', 'justify-content': 'flex-end', 'padding-top': '8px',
        });
        await clearAndSet(await freshStyle('about-story-img'), 'about-story-img', {
            'width': '100%', 'height': '100%', 'min-height': '400px', 'background-color': v['av-dark-06'],
            'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
            'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
        });
        await clearAndSet(await freshStyle('about-story-link'), 'about-story-link', {
            'font-family': 'DM Sans', 'font-size': v['av-text-sm'], 'color': v['av-dark'], 'text-decoration': 'none', 'opacity': '0.5', 'margin-top': '24px', 'display': 'inline-block',
        });
        await clearAndSet(await freshStyle('av-max-520'), 'av-max-520', { 'max-width': '520px' });
        await clearAndSet(await freshStyle('av-max-580'), 'av-max-580', { 'max-width': '580px' });
        await clearAndSet(await freshStyle('av-mb-48'), 'av-mb-48', { 'margin-bottom': '48px' });
        await clearAndSet(await freshStyle('av-mb-64'), 'av-mb-64', { 'margin-bottom': v['av-gap-md'] });
        await clearAndSet(await freshStyle('av-mb-96'), 'av-mb-96', { 'margin-bottom': v['av-gap-lg'] });
        await wait(500);
        await clearAndSet(await freshStyle('about-card-label'), 'about-card-label', {
            'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
            'letter-spacing': '0.25em', 'text-transform': 'uppercase',
            'opacity': '0.4', 'margin-bottom': '24px', 'color': v['av-cream'],
        });
        await clearAndSet(await freshStyle('about-card-heading'), 'about-card-heading', {
            'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
            'line-height': '1.12', 'font-weight': '400', 'margin-bottom': '24px', 'color': v['av-cream'],
        });
        await clearAndSet(await freshStyle('about-card-body'), 'about-card-body', {
            'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
            'line-height': '1.9', 'opacity': '0.6', 'color': v['av-cream'],
        });
        await clearAndSet(await freshStyle('about-label-line'), 'about-label-line', { 'flex-grow': '1', 'height': '1px', 'background-color': v['av-dark-15'] });
        await wait(500);
        await clearAndSet(await freshStyle('about-stats-grid'), 'about-stats-grid', {
            'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr', 'grid-column-gap': '64px', 'grid-row-gap': '64px', 'text-align': 'center',
        });
        await clearAndSet(await freshStyle('about-stat-item'), 'about-stat-item', { 'display': 'flex', 'flex-direction': 'column', 'align-items': 'center' });
        await clearAndSet(await freshStyle('about-stat-number'), 'about-stat-number', {
            'font-family': 'DM Serif Display', 'font-size': 'clamp(64px, 8vw, 120px)', 'line-height': '1', 'letter-spacing': '-0.03em', 'font-weight': '400', 'color': v['av-cream'], 'margin-bottom': '16px',
        });
        await clearAndSet(await freshStyle('about-stat-label'), 'about-stat-label', {
            'font-family': 'DM Sans', 'font-size': v['av-text-sm'], 'letter-spacing': '0.15em', 'text-transform': 'uppercase', 'opacity': '0.4', 'color': v['av-cream'],
        });
        await wait(500);
        await clearAndSet(await freshStyle('about-value-num'), 'about-value-num', {
            'font-family': 'DM Serif Display', 'font-size': '56px',
            'line-height': '1', 'opacity': '0.07', 'margin-bottom': '24px', 'color': v['av-cream'],
        });
        await clearAndSet(await freshStyle('about-value-title'), 'about-value-title', {
            'font-family': 'DM Serif Display', 'font-size': '24px',
            'line-height': '1.2', 'font-weight': '400', 'margin-bottom': '16px', 'color': v['av-cream'],
        });
        await clearAndSet(await freshStyle('about-value-desc'), 'about-value-desc', {
            'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
            'line-height': '1.7', 'opacity': '0.5', 'color': v['av-cream'],
        });
        await clearAndSet(await freshStyle('about-values-zigzag'), 'about-values-zigzag', {
            'display': 'flex', 'flex-direction': 'column', 'position': 'relative',
        });
        await clearAndSet(await freshStyle('about-values-row'), 'about-values-row', {
            'display': 'grid', 'grid-template-columns': '1fr 1fr',
            'grid-column-gap': '64px', 'align-items': 'center',
            'padding-top': '32px', 'padding-bottom': '32px',
        });
        await clearAndSet(await freshStyle('about-values-card'), 'about-values-card', {
            'background-color': v['av-dark'], 'color': v['av-cream'],
            'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
            'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
            'padding-top': '48px', 'padding-bottom': '48px',
            'padding-left': '40px', 'padding-right': '40px',
            'position': 'relative', 'z-index': '2',
        });
        await clearAndSet(await freshStyle('about-values-spacer'), 'about-values-spacer', { 'min-height': '1px' });
        await clearAndSet(await freshStyle('about-values-snake-anchor'), 'about-values-snake-anchor', {
            'position': 'absolute', 'top': '0px', 'left': '0px', 'width': '100%', 'height': '100%', 'z-index': '1',
        });
        await applyCTAStyleProps(v);
    }
    // ═══════════════ BUILD ELEMENTS ═══════════════
    // Cursor elements
    const cursorRingEl = webflow.elementBuilder(webflow.elementPresets.DOM);
    cursorRingEl.setTag('div');
    cursorRingEl.setStyles([cursorRing]);
    await safeCall('append:cursor-ring', () => body.append(cursorRingEl));
    const cursorDotEl = webflow.elementBuilder(webflow.elementPresets.DOM);
    cursorDotEl.setTag('div');
    cursorDotEl.setStyles([cursorDot]);
    await safeCall('append:cursor-dot', () => body.append(cursorDotEl));
    // HERO
    log('Building Hero...');
    const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
    hero.setTag('section');
    hero.setStyles([heroSection]);
    hero.setAttribute('id', 'about-hero');
    const overlay = hero.append(webflow.elementPresets.DOM);
    overlay.setTag('div');
    overlay.setStyles([heroOverlay]);
    const heroC = hero.append(webflow.elementPresets.DOM);
    heroC.setTag('div');
    heroC.setStyles([heroContent]);
    const heroH = heroC.append(webflow.elementPresets.DOM);
    heroH.setTag('h1');
    heroH.setStyles([s.headingXL]);
    heroH.setTextContent('About Avorino');
    heroH.setAttribute('data-animate', 'opacity-sweep');
    const heroSub = heroC.append(webflow.elementPresets.DOM);
    heroSub.setTag('p');
    heroSub.setStyles([heroSubtitle]);
    heroSub.setTextContent('Custom home and ADU builder in Orange County since 2010');
    heroSub.setAttribute('data-animate', 'fade-up');
    await safeCall('append:hero', () => body.append(hero));
    // STORY
    log('Building Story...');
    const story = webflow.elementBuilder(webflow.elementPresets.DOM);
    story.setTag('section');
    story.setStyles([s.section, s.sectionWarm]);
    story.setAttribute('id', 'about-story');
    const storyLbl = story.append(webflow.elementPresets.DOM);
    storyLbl.setTag('div');
    storyLbl.setStyles([s.label, mb64]);
    storyLbl.setAttribute('data-animate', 'fade-up');
    const storyLblTxt = storyLbl.append(webflow.elementPresets.DOM);
    storyLblTxt.setTag('div');
    storyLblTxt.setTextContent('Our Story');
    const storyLblLine = storyLbl.append(webflow.elementPresets.DOM);
    storyLblLine.setTag('div');
    storyLblLine.setStyles([labelLine]);
    const storyGrid = story.append(webflow.elementPresets.DOM);
    storyGrid.setTag('div');
    storyGrid.setStyles([s.grid2]);
    const storyLeft = storyGrid.append(webflow.elementPresets.DOM);
    storyLeft.setTag('div');
    storyLeft.setAttribute('data-animate', 'fade-up');
    const storyImgEl = storyLeft.append(webflow.elementPresets.DOM);
    storyImgEl.setTag('div');
    storyImgEl.setStyles([storyImg]);
    const storyRight = storyGrid.append(webflow.elementPresets.DOM);
    storyRight.setTag('div');
    storyRight.setStyles([storyBody]);
    const storyH = storyRight.append(webflow.elementPresets.DOM);
    storyH.setTag('h2');
    storyH.setStyles([s.headingLG, maxWidth580, mb48]);
    storyH.setTextContent('We redefine the art of construction');
    storyH.setAttribute('data-animate', 'line-wipe');
    const storyP = storyRight.append(webflow.elementPresets.DOM);
    storyP.setTag('p');
    storyP.setStyles([s.body, s.bodyMuted, maxWidth520, mb48]);
    storyP.setTextContent('Avorino is a custom home and an ADU builder in Orange County that takes pride in its exceptional customer service. With a friendly and professional approach, Avorino actively involves clients throughout the process, ensuring their unique needs are met with utmost care. Our unwavering commitment to quality is evident in every detail, resulting in remarkable outcomes that exceed expectations. Avorino stands out by embracing innovation, leveraging cutting-edge technologies and sustainable practices to deliver exceptional results. Our in-house crew is capable of handling every aspect of a project from design to execution.');
    storyP.setAttribute('data-animate', 'fade-up');
    const storyLinkEl = storyRight.append(webflow.elementPresets.DOM);
    storyLinkEl.setTag('a');
    storyLinkEl.setStyles([storyLink]);
    storyLinkEl.setTextContent('Learn our story \u2192');
    storyLinkEl.setAttribute('href', '#about-values');
    storyLinkEl.setAttribute('data-animate', 'fade-up');
    storyLinkEl.setAttribute('data-magnetic', '');
    await safeCall('append:story', () => body.append(story));
    // STATS
    log('Building Stats...');
    const stats = webflow.elementBuilder(webflow.elementPresets.DOM);
    stats.setTag('section');
    stats.setStyles([s.section, s.sectionDark]);
    stats.setAttribute('id', 'about-stats');
    const statsG = stats.append(webflow.elementPresets.DOM);
    statsG.setTag('div');
    statsG.setStyles([statsGrid]);
    [{ number: '15+', label: 'Years of Experience' }, { number: '200+', label: 'Projects Completed' }, { number: '50+', label: 'ADUs Built' }].forEach(stat => {
        const item = statsG.append(webflow.elementPresets.DOM);
        item.setTag('div');
        item.setStyles([statItem]);
        const num = item.append(webflow.elementPresets.DOM);
        num.setTag('div');
        num.setStyles([statNumber]);
        num.setTextContent(stat.number);
        const lbl = item.append(webflow.elementPresets.DOM);
        lbl.setTag('div');
        lbl.setStyles([statLabel]);
        lbl.setTextContent(stat.label);
    });
    await safeCall('append:stats', () => body.append(stats));
    // MISSION & VISION
    log('Building Mission & Vision...');
    const mv = webflow.elementBuilder(webflow.elementPresets.DOM);
    mv.setTag('section');
    mv.setStyles([s.section, s.sectionWarm]);
    mv.setAttribute('id', 'about-mission-vision');
    const mvGrid = mv.append(webflow.elementPresets.DOM);
    mvGrid.setTag('div');
    mvGrid.setStyles([s.grid2]);
    [
        { label: 'Mission', heading: 'Bringing visionary dreams to life', body: 'Our mission is to bring visionary dreams to life through strong communication and transformative construction. As builders, we are committed to delivering exceptional projects that exceed expectations, inspire awe, and leave a lasting impact. With a focus on collaboration and innovation, we strive to create spaces that not only fulfill our clients\' visions but also enhance the lives of those who experience them.' },
        { label: 'Vision', heading: 'The catalyst for transformation', body: 'Our vision is to be the catalyst for transformation in the construction industry. We aspire to be known as the go-to builders for visionary projects, where dreams become reality. Through our commitment to strong communication, we aim to foster deep understanding and collaboration with our clients, partners, and communities.' },
    ].forEach(card => {
        const c = mvGrid.append(webflow.elementPresets.DOM);
        c.setTag('div');
        c.setStyles([s.cardDark]);
        c.setAttribute('data-animate', 'fade-up');
        const l = c.append(webflow.elementPresets.DOM);
        l.setTag('div');
        l.setStyles([cardLabel]);
        l.setTextContent(card.label);
        const h = c.append(webflow.elementPresets.DOM);
        h.setTag('h3');
        h.setStyles([cardHeading]);
        h.setTextContent(card.heading);
        const p = c.append(webflow.elementPresets.DOM);
        p.setTag('p');
        p.setStyles([cardBody]);
        p.setTextContent(card.body);
    });
    await safeCall('append:mission-vision', () => body.append(mv));
    // VALUES
    log('Building Values...');
    const vals = webflow.elementBuilder(webflow.elementPresets.DOM);
    vals.setTag('section');
    vals.setStyles([s.section, s.sectionDark]);
    vals.setAttribute('id', 'about-values');
    const valsLbl = vals.append(webflow.elementPresets.DOM);
    valsLbl.setTag('div');
    valsLbl.setStyles([s.label, mb64]);
    valsLbl.setAttribute('data-animate', 'fade-up');
    const valsLblTxt = valsLbl.append(webflow.elementPresets.DOM);
    valsLblTxt.setTag('div');
    valsLblTxt.setTextContent('Our Values');
    const valsLblLine = valsLbl.append(webflow.elementPresets.DOM);
    valsLblLine.setTag('div');
    valsLblLine.setStyles([labelLine]);
    const valsH = vals.append(webflow.elementPresets.DOM);
    valsH.setTag('h2');
    valsH.setStyles([s.headingLG, mb96]);
    valsH.setTextContent('What We Stand For');
    valsH.setAttribute('data-animate', 'line-wipe');
    const zigzag = vals.append(webflow.elementPresets.DOM);
    zigzag.setTag('div');
    zigzag.setStyles([valuesZigzag]);
    const snakeAnchor = zigzag.append(webflow.elementPresets.DOM);
    snakeAnchor.setTag('div');
    snakeAnchor.setStyles([valuesSnakeAnchor]);
    snakeAnchor.setAttribute('id', 'values-snake-anchor');
    const valuesData = [
        { title: 'Integrity', desc: 'Nurturing honesty, transparency, and ethical practices in everything we do.' },
        { title: 'Navigating Challenges', desc: 'Skillfully navigating obstacles and finding effective solutions to overcome project complexities and deliver successful outcomes.' },
        { title: 'Safety First', desc: 'Making safety a top priority, implementing rigorous safety protocols to protect our team members, clients, and the communities we serve.' },
        { title: 'People-Oriented', desc: 'Putting people at the center of our business, valuing our team members, clients, and community and prioritizing their needs.' },
        { title: 'Innovation', desc: 'Embracing creativity and pushing the boundaries of construction with cutting-edge technologies.' },
        { title: 'Resourceful Solutions', desc: 'Applying resourcefulness and ingenuity to find innovative and efficient solutions that meet our clients\' needs and exceed their expectations.' },
        { title: 'Excellence', desc: 'Striving for continuous improvement and delivering outstanding results in every project we undertake.' },
    ];
    valuesData.forEach((val, i) => {
        const isLeft = i % 2 === 0;
        const row = zigzag.append(webflow.elementPresets.DOM);
        row.setTag('div');
        row.setStyles([valuesRow]);
        row.setAttribute('data-values-row', String(i));
        if (isLeft) {
            const card = row.append(webflow.elementPresets.DOM);
            card.setTag('div');
            card.setStyles([valuesCard]);
            card.setAttribute('data-animate', 'snake-card-left');
            const n = card.append(webflow.elementPresets.DOM);
            n.setTag('div');
            n.setStyles([valueNumber]);
            n.setTextContent(String(i + 1).padStart(2, '0'));
            const t = card.append(webflow.elementPresets.DOM);
            t.setTag('h3');
            t.setStyles([valueTitle]);
            t.setTextContent(val.title);
            const d = card.append(webflow.elementPresets.DOM);
            d.setTag('p');
            d.setStyles([valueDesc]);
            d.setTextContent(val.desc);
            const sp = row.append(webflow.elementPresets.DOM);
            sp.setTag('div');
            sp.setStyles([valuesSpacer]);
        }
        else {
            const sp = row.append(webflow.elementPresets.DOM);
            sp.setTag('div');
            sp.setStyles([valuesSpacer]);
            const card = row.append(webflow.elementPresets.DOM);
            card.setTag('div');
            card.setStyles([valuesCard]);
            card.setAttribute('data-animate', 'snake-card-right');
            const n = card.append(webflow.elementPresets.DOM);
            n.setTag('div');
            n.setStyles([valueNumber]);
            n.setTextContent(String(i + 1).padStart(2, '0'));
            const t = card.append(webflow.elementPresets.DOM);
            t.setTag('h3');
            t.setStyles([valueTitle]);
            t.setTextContent(val.title);
            const d = card.append(webflow.elementPresets.DOM);
            d.setTag('p');
            d.setStyles([valueDesc]);
            d.setTextContent(val.desc);
        }
    });
    await safeCall('append:values', () => body.append(vals));
    // CTA
    log('Building CTA...');
    await buildCTASection(body, v, 'Create your dream home', 'Get a Free Estimate', '/schedule-a-meeting', 'Learn About ADUs', '/adu');
    // APPLY STYLES
    await applyStyleProperties();
    log('About page built! Add custom code manually (see instructions below).', 'success');
    await webflow.notify({ type: 'Success', message: 'About page created! Now add custom code manually — see extension panel.' });
}
// ── Event listeners ──
document.getElementById('inject-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('inject-btn');
    btn.disabled = true;
    try {
        await createAllVariables();
    }
    catch (err) {
        log(`Error: ${err.message || err}`, 'error');
    }
    finally {
        btn.disabled = false;
    }
});
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.dataset.copy;
        let text = type === 'head' ? HEAD_CODE : type === 'footer' ? FOOTER_CODE : '';
        navigator.clipboard.writeText(text).then(() => {
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
        });
    });
});
document.getElementById('build-page')?.addEventListener('click', async () => {
    const btn = document.getElementById('build-page');
    btn.disabled = true;
    try {
        await buildAboutPage();
    }
    catch (err) {
        log(`Error: ${err.message || err}`, 'error');
        await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
    }
    finally {
        btn.disabled = false;
    }
});
