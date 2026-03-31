import { webflow, log, logDetail, clearErrorLog, getAvorinVars, getOrCreateStyle, freshStyle, clearAndSet, createSharedStyles, setSharedStyleProps, createAllVariables, createPageWithSlug, buildCTASection, applyCTAStyleProps, } from './shared.js';
import { ADU_PLAN_IMAGE_DATA } from './adu-plan-image-data.js';
import { ADU_PLAN_VIEWER_DATA } from './adu-plan-viewer-data.js';
import { ADU_PLANS_FOOTER_INLINE } from './adu-plans-footer-inline.js';
const PAGE_NAME = 'ADU Plan Samples';
const PAGE_SLUG = 'adu-plan-samples';
const PAGE_TITLE = 'ADU Floor Plans & Designs | Avorino Orange County';
const PAGE_DESC = 'Explore Bellecielo, Casielo, and Elega with interactive 3D floor plans and matched room render references.';
const HEAD_CODE = '';
const getFooterCode = () => {
    return [
        '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
        '<script src="https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js"><\/script>',
        `<script>${ADU_PLANS_FOOTER_INLINE}<\/script>`,
    ].join('\n');
};
document.getElementById('page-name').textContent = PAGE_NAME;
const headCodeEl = document.getElementById('head-code');
const footerCodeEl = document.getElementById('footer-code');
const renderCodeSnippets = () => {
    if (headCodeEl)
        headCodeEl.textContent = HEAD_CODE;
    if (footerCodeEl)
        footerCodeEl.textContent = getFooterCode();
};
renderCodeSnippets();
const PLAN_SECTIONS = [
    {
        key: 'belle',
        label: '// Plan A',
        title: 'Bellecielo',
        sqft: '830 SQFT',
        desc: 'A spacious two-bedroom ADU with an open-concept living and kitchen area. The symmetrical layout places bedrooms on opposite ends for maximum privacy, with full bathrooms adjacent to each.',
        tags: ['2 Bedrooms', '2 Bathrooms', 'Open Kitchen', 'Living Room'],
        useCases: [
            'Multi-generational family housing',
            'Long-term rental income',
            'Home office + guest suite',
            'Aging-in-place for parents',
        ],
        iframe: ADU_PLAN_VIEWER_DATA.belle,
        rooms: [
            { name: 'Overview', img: ADU_PLAN_IMAGE_DATA.belle['overview'], desc: 'Bellecielo overview rendering' },
            { name: 'Living Room', img: ADU_PLAN_IMAGE_DATA.belle['living-alt'], desc: 'Bellecielo living room rendering' },
            { name: 'Kitchen', img: ADU_PLAN_IMAGE_DATA.belle['living'], desc: 'Bellecielo kitchen rendering' },
            { name: 'Bedroom 1', img: ADU_PLAN_IMAGE_DATA.belle['bedroom'], desc: 'Bellecielo primary bedroom rendering' },
            { name: 'Bedroom 2', img: ADU_PLAN_IMAGE_DATA.belle['bedroom'], desc: 'Bellecielo secondary bedroom rendering' },
            { name: 'Bathroom 1', img: ADU_PLAN_IMAGE_DATA.belle['bathroom'], desc: 'Bellecielo bathroom one rendering' },
            { name: 'Bathroom 2', img: ADU_PLAN_IMAGE_DATA.belle['bathroom'], desc: 'Bellecielo bathroom two rendering' },
        ],
    },
    {
        key: 'casielo',
        label: '// Plan B',
        title: 'Casielo',
        sqft: '387 SQFT',
        desc: 'A compact one-bedroom ADU with an efficient open-concept living and kitchen core. The bedroom and bath stay private while the main living space stays bright and straightforward.',
        tags: ['1 Bedroom', '1 Bathroom', 'Open Kitchen', 'Living Room', 'Laundry'],
        useCases: [
            'Garage conversion + new ADU combo',
            'Rental unit with covered parking',
            'In-law suite with independent access',
            'Investment property addition',
        ],
        iframe: ADU_PLAN_VIEWER_DATA.casielo,
        rooms: [
            { name: 'Overview', img: ADU_PLAN_IMAGE_DATA.casielo['overview'], desc: 'Casielo overview rendering' },
            { name: 'Living Room', img: ADU_PLAN_IMAGE_DATA.casielo['living'], desc: 'Casielo living room rendering' },
            { name: 'Kitchen', img: ADU_PLAN_IMAGE_DATA.casielo['kitchen'], desc: 'Casielo kitchen rendering' },
            { name: 'Bedroom', img: ADU_PLAN_IMAGE_DATA.casielo['bedroom'], desc: 'Casielo bedroom rendering' },
            { name: 'Bathroom', img: ADU_PLAN_IMAGE_DATA.casielo['bathroom'], desc: 'Casielo bathroom rendering' },
        ],
    },
    {
        key: 'elega',
        label: '// Plan C',
        title: 'Elega',
        sqft: '500 SQFT',
        desc: 'A compact yet elegant one-bedroom ADU that maximizes every square foot. The open living and kitchen area occupies the right side, while the bedroom and full bath have their own private wing on the left.',
        tags: ['1 Bedroom', '1 Bathroom', 'Open Kitchen', 'Living Room', 'Closet'],
        useCases: [
            'Junior ADU on smaller lots',
            'Backyard studio apartment',
            'Starter rental property',
            'Guest house for visitors',
        ],
        iframe: ADU_PLAN_VIEWER_DATA.elega,
        rooms: [
            { name: 'Overview', img: ADU_PLAN_IMAGE_DATA.elega['overview'], desc: 'Elega overview rendering' },
            { name: 'Living Room', img: ADU_PLAN_IMAGE_DATA.elega['living-kitchen'], desc: 'Elega living room rendering' },
            { name: 'Kitchen', img: ADU_PLAN_IMAGE_DATA.elega['kitchen'], desc: 'Elega kitchen rendering' },
            { name: 'Bedroom', img: ADU_PLAN_IMAGE_DATA.elega['bedroom'], desc: 'Elega bedroom rendering' },
            { name: 'Bathroom', img: ADU_PLAN_IMAGE_DATA.elega['bathroom'], desc: 'Elega bathroom rendering' },
        ],
    },
];
function createTextEl(parent, tag, text, attrs = {}, styles = []) {
    const el = parent.append(webflow.elementPresets.DOM);
    el.setTag(tag);
    if (styles.length)
        el.setStyles(styles);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    el.setTextContent(text);
    return el;
}
async function buildPlansPage() {
    clearErrorLog();
    logDetail('Starting ADU Plans Samples build...', 'info');
    const v = await getAvorinVars();
    const s = await createSharedStyles();
    const heroStyle = await getOrCreateStyle('adu-plans-hero');
    const heroInnerStyle = await getOrCreateStyle('adu-plans-hero-inner');
    const heroCopyStyle = await getOrCreateStyle('adu-plans-hero-copy-wrap');
    const heroLabelStyle = await getOrCreateStyle('adu-plans-hero-label');
    const heroTitleStyle = await getOrCreateStyle('adu-plans-hero-title');
    const heroSubtitleStyle = await getOrCreateStyle('adu-plans-hero-subtitle');
    const heroMediaStyle = await getOrCreateStyle('adu-plans-hero-media');
    const heroMediaImgStyle = await getOrCreateStyle('adu-plans-hero-media-img');
    const heroScrollStyle = await getOrCreateStyle('adu-plans-hero-scroll');
    const heroScrollLineStyle = await getOrCreateStyle('adu-plans-hero-scroll-line');
    const sectionStyle = await getOrCreateStyle('adu-plans-section');
    const sectionInnerStyle = await getOrCreateStyle('adu-plans-section-inner');
    const planLayoutStyle = await getOrCreateStyle('adu-plans-layout');
    const viewerWrapStyle = await getOrCreateStyle('adu-plans-viewer-wrap');
    const viewerFrameStyle = await getOrCreateStyle('adu-plans-viewer-frame');
    const viewerStyle = await getOrCreateStyle('adu-plans-viewer');
    const viewerHintStyle = await getOrCreateStyle('adu-plans-viewer-hint');
    const infoStyle = await getOrCreateStyle('adu-plans-info');
    const planLabelStyle = await getOrCreateStyle('adu-plans-plan-label');
    const planNameStyle = await getOrCreateStyle('adu-plans-plan-name');
    const sqftBadgeStyle = await getOrCreateStyle('adu-plans-sqft-badge');
    const planDescStyle = await getOrCreateStyle('adu-plans-plan-desc');
    const roomTagsStyle = await getOrCreateStyle('adu-plans-room-tags');
    const roomTagStyle = await getOrCreateStyle('adu-plans-room-tag');
    const useTitleStyle = await getOrCreateStyle('adu-plans-use-title');
    const useListStyle = await getOrCreateStyle('adu-plans-use-list');
    const useItemStyle = await getOrCreateStyle('adu-plans-use-item');
    const galleryStyle = await getOrCreateStyle('adu-plans-gallery');
    const galleryHeroStyle = await getOrCreateStyle('adu-plans-gallery-hero');
    const galleryHeroImgStyle = await getOrCreateStyle('adu-plans-gallery-hero-img');
    const galleryThumbsStyle = await getOrCreateStyle('adu-plans-gallery-thumbs');
    const galleryThumbStyle = await getOrCreateStyle('adu-plans-gallery-thumb');
    const galleryThumbImgStyle = await getOrCreateStyle('adu-plans-gallery-thumb-img');
    const { body } = await createPageWithSlug(PAGE_NAME, PAGE_SLUG, PAGE_TITLE, PAGE_DESC);
    async function applyStyleProperties() {
        await setSharedStyleProps(s, v);
        await clearAndSet(await freshStyle('adu-plans-hero'), 'adu-plans-hero', {
            'min-height': '100vh',
            'display': 'flex',
            'align-items': 'center',
            'padding-top': '120px',
            'padding-bottom': '72px',
            'padding-left': v['av-section-pad-x'],
            'padding-right': v['av-section-pad-x'],
            'background-color': v['av-dark'],
            'color': v['av-cream'],
            'position': 'relative',
            'overflow-x': 'hidden',
            'overflow-y': 'hidden',
        });
        await clearAndSet(await freshStyle('adu-plans-hero-inner'), 'adu-plans-hero-inner', {
            'display': 'grid',
            'grid-template-columns': '0.95fr 1.05fr',
            'grid-column-gap': '64px',
            'align-items': 'center',
            'max-width': '1440px',
            'margin-left': 'auto',
            'margin-right': 'auto',
        });
        await clearAndSet(await freshStyle('adu-plans-hero-copy-wrap'), 'adu-plans-hero-copy-wrap', {
            'display': 'flex',
            'flex-direction': 'column',
            'align-items': 'flex-start',
            'justify-content': 'center',
            'max-width': '520px',
        });
        await clearAndSet(await freshStyle('adu-plans-hero-label'), 'adu-plans-hero-label', {
            'font-family': 'DM Sans',
            'font-size': '14px',
            'font-weight': '600',
            'letter-spacing': '0.22em',
            'text-transform': 'uppercase',
            'color': '#c8a86e',
            'margin-bottom': '20px',
        });
        await clearAndSet(await freshStyle('adu-plans-hero-title'), 'adu-plans-hero-title', {
            'font-family': 'DM Serif Display',
            'font-size': '64px',
            'line-height': '1.1',
            'font-weight': '400',
            'letter-spacing': '-0.02em',
            'color': v['av-cream'],
            'margin-top': '0px',
            'margin-bottom': '24px',
            'max-width': '10ch',
        });
        await clearAndSet(await freshStyle('adu-plans-hero-subtitle'), 'adu-plans-hero-subtitle', {
            'font-family': 'DM Sans',
            'font-size': '18px',
            'line-height': '1.7',
            'color': 'rgba(240,237,232,0.7)',
            'margin-top': '0px',
            'margin-bottom': '0px',
            'max-width': '440px',
        });
        await clearAndSet(await freshStyle('adu-plans-hero-media'), 'adu-plans-hero-media', {
            'height': '80vh',
            'min-height': '520px',
            'max-height': '720px',
            'position': 'relative',
            'overflow-x': 'hidden',
            'overflow-y': 'hidden',
            'background-color': 'transparent',
        });
        await clearAndSet(await freshStyle('adu-plans-hero-media-img'), 'adu-plans-hero-media-img', {
            'width': '100%',
            'height': '100%',
            'display': 'block',
            'background-color': 'transparent',
        });
        await clearAndSet(await freshStyle('adu-plans-hero-scroll'), 'adu-plans-hero-scroll', {
            'position': 'absolute',
            'bottom': '40px',
            'left': '0px',
            'width': '100%',
            'display': 'flex',
            'flex-direction': 'column',
            'align-items': 'center',
            'grid-row-gap': '8px',
            'color': 'rgba(240,237,232,0.4)',
            'font-family': 'DM Sans',
            'font-size': '12px',
            'letter-spacing': '0.18em',
            'text-transform': 'uppercase',
        });
        await clearAndSet(await freshStyle('adu-plans-hero-scroll-line'), 'adu-plans-hero-scroll-line', {
            'width': '1px',
            'height': '40px',
            'background-color': 'rgba(200,168,110,0.65)',
        });
        await clearAndSet(await freshStyle('adu-plans-section'), 'adu-plans-section', {
            'padding-top': '128px',
            'padding-bottom': '128px',
            'padding-left': v['av-section-pad-x'],
            'padding-right': v['av-section-pad-x'],
            'background-color': '#ffffff',
            'border-top-width': '1px',
            'border-top-color': 'rgba(17,17,17,0.08)',
        });
        await clearAndSet(await freshStyle('adu-plans-section-inner'), 'adu-plans-section-inner', {
            'max-width': '1440px',
            'margin-left': 'auto',
            'margin-right': 'auto',
        });
        await clearAndSet(await freshStyle('adu-plans-layout'), 'adu-plans-layout', {
            'display': 'flex',
            'grid-column-gap': '64px',
            'align-items': 'flex-start',
        });
        await clearAndSet(await freshStyle('adu-plans-viewer-wrap'), 'adu-plans-viewer-wrap', {
            'width': '55%',
            'flex-shrink': '0',
            'position': 'relative',
        });
        await clearAndSet(await freshStyle('adu-plans-viewer-frame'), 'adu-plans-viewer-frame', {
            'border-top-left-radius': '12px',
            'border-top-right-radius': '12px',
            'border-bottom-left-radius': '12px',
            'border-bottom-right-radius': '12px',
            'overflow-x': 'hidden',
            'overflow-y': 'hidden',
            'background-color': '#111111',
            'border-top-width': '1px',
            'border-right-width': '1px',
            'border-bottom-width': '1px',
            'border-left-width': '1px',
            'border-top-color': 'rgba(200,168,110,0.15)',
            'border-right-color': 'rgba(200,168,110,0.15)',
            'border-bottom-color': 'rgba(200,168,110,0.15)',
            'border-left-color': 'rgba(200,168,110,0.15)',
        });
        await clearAndSet(await freshStyle('adu-plans-viewer'), 'adu-plans-viewer', {
            'width': '100%',
            'height': '600px',
            'min-height': '600px',
            'display': 'block',
            'border-left-width': '0px',
            'border-right-width': '0px',
            'border-top-width': '0px',
            'border-bottom-width': '0px',
            'background-color': '#111111',
        });
        await clearAndSet(await freshStyle('adu-plans-viewer-hint'), 'adu-plans-viewer-hint', {
            'position': 'absolute',
            'bottom': '16px',
            'left': '0px',
            'width': '100%',
            'text-align': 'center',
            'font-family': 'DM Sans',
            'font-size': '12px',
            'letter-spacing': '0.08em',
            'text-transform': 'uppercase',
            'color': 'rgba(240,237,232,0.42)',
            'pointer-events': 'none',
        });
        await clearAndSet(await freshStyle('adu-plans-info'), 'adu-plans-info', {
            'width': '45%',
        });
        await clearAndSet(await freshStyle('adu-plans-plan-label'), 'adu-plans-plan-label', {
            'font-family': 'DM Sans',
            'font-size': '13px',
            'font-weight': '600',
            'letter-spacing': '0.23em',
            'text-transform': 'uppercase',
            'color': '#c8a86e',
            'margin-bottom': '12px',
        });
        await clearAndSet(await freshStyle('adu-plans-plan-name'), 'adu-plans-plan-name', {
            'font-family': 'DM Serif Display',
            'font-size': '56px',
            'line-height': '1.1',
            'font-weight': '400',
            'color': v['av-dark'],
            'margin-top': '0px',
            'margin-bottom': '16px',
        });
        await clearAndSet(await freshStyle('adu-plans-sqft-badge'), 'adu-plans-sqft-badge', {
            'display': 'inline-flex',
            'align-items': 'center',
            'padding-top': '6px',
            'padding-bottom': '6px',
            'padding-left': '20px',
            'padding-right': '20px',
            'border-top-left-radius': '999px',
            'border-top-right-radius': '999px',
            'border-bottom-left-radius': '999px',
            'border-bottom-right-radius': '999px',
            'border-top-width': '1px',
            'border-right-width': '1px',
            'border-bottom-width': '1px',
            'border-left-width': '1px',
            'border-top-color': '#c8a86e',
            'border-right-color': '#c8a86e',
            'border-bottom-color': '#c8a86e',
            'border-left-color': '#c8a86e',
            'font-family': 'DM Sans',
            'font-size': '14px',
            'font-weight': '600',
            'letter-spacing': '0.08em',
            'text-transform': 'uppercase',
            'color': '#c8a86e',
            'margin-bottom': '24px',
        });
        await clearAndSet(await freshStyle('adu-plans-plan-desc'), 'adu-plans-plan-desc', {
            'font-family': 'DM Sans',
            'font-size': '16px',
            'line-height': '1.7',
            'color': 'rgba(17,17,17,0.7)',
            'margin-top': '0px',
            'margin-bottom': '28px',
        });
        await clearAndSet(await freshStyle('adu-plans-room-tags'), 'adu-plans-room-tags', {
            'display': 'flex',
            'flex-wrap': 'wrap',
            'grid-column-gap': '8px',
            'grid-row-gap': '8px',
            'margin-bottom': '32px',
        });
        await clearAndSet(await freshStyle('adu-plans-room-tag'), 'adu-plans-room-tag', {
            'display': 'inline-flex',
            'align-items': 'center',
            'padding-top': '6px',
            'padding-bottom': '6px',
            'padding-left': '16px',
            'padding-right': '16px',
            'background-color': 'rgba(200,168,110,0.1)',
            'border-top-width': '1px',
            'border-right-width': '1px',
            'border-bottom-width': '1px',
            'border-left-width': '1px',
            'border-top-color': 'rgba(200,168,110,0.25)',
            'border-right-color': 'rgba(200,168,110,0.25)',
            'border-bottom-color': 'rgba(200,168,110,0.25)',
            'border-left-color': 'rgba(200,168,110,0.25)',
            'border-top-left-radius': '999px',
            'border-top-right-radius': '999px',
            'border-bottom-left-radius': '999px',
            'border-bottom-right-radius': '999px',
            'font-family': 'DM Sans',
            'font-size': '13px',
            'font-weight': '500',
            'color': v['av-dark'],
        });
        await clearAndSet(await freshStyle('adu-plans-use-title'), 'adu-plans-use-title', {
            'font-family': 'DM Serif Display',
            'font-size': '20px',
            'font-weight': '400',
            'color': v['av-dark'],
            'margin-top': '0px',
            'margin-bottom': '12px',
        });
        await clearAndSet(await freshStyle('adu-plans-use-list'), 'adu-plans-use-list', {
            'list-style-type': 'disc',
            'padding-left': '20px',
            'margin-top': '0px',
            'margin-bottom': '36px',
        });
        await clearAndSet(await freshStyle('adu-plans-use-item'), 'adu-plans-use-item', {
            'font-family': 'DM Sans',
            'font-size': '15px',
            'line-height': '2',
            'color': 'rgba(17,17,17,0.7)',
        });
        await clearAndSet(await freshStyle('adu-plans-gallery'), 'adu-plans-gallery', {
            'margin-top': '36px',
        });
        await clearAndSet(await freshStyle('adu-plans-gallery-hero'), 'adu-plans-gallery-hero', {
            'height': '320px',
            'border-top-left-radius': '10px',
            'border-top-right-radius': '10px',
            'border-bottom-left-radius': '10px',
            'border-bottom-right-radius': '10px',
            'overflow-x': 'hidden',
            'overflow-y': 'hidden',
            'margin-bottom': '12px',
            'border-top-width': '1px',
            'border-right-width': '1px',
            'border-bottom-width': '1px',
            'border-left-width': '1px',
            'border-top-color': 'rgba(200,168,110,0.1)',
            'border-right-color': 'rgba(200,168,110,0.1)',
            'border-bottom-color': 'rgba(200,168,110,0.1)',
            'border-left-color': 'rgba(200,168,110,0.1)',
            'background-color': '#ece8e1',
        });
        await clearAndSet(await freshStyle('adu-plans-gallery-hero-img'), 'adu-plans-gallery-hero-img', {
            'width': '100%',
            'height': '100%',
            'display': 'block',
            'object-fit': 'cover',
        });
        await clearAndSet(await freshStyle('adu-plans-gallery-thumbs'), 'adu-plans-gallery-thumbs', {
            'display': 'grid',
            'grid-template-columns': '1fr 1fr 1fr 1fr',
            'grid-column-gap': '10px',
            'grid-row-gap': '10px',
        });
        await clearAndSet(await freshStyle('adu-plans-gallery-thumb'), 'adu-plans-gallery-thumb', {
            'height': '100px',
            'padding-top': '0px',
            'padding-bottom': '0px',
            'padding-left': '0px',
            'padding-right': '0px',
            'border-top-left-radius': '8px',
            'border-top-right-radius': '8px',
            'border-bottom-left-radius': '8px',
            'border-bottom-right-radius': '8px',
            'overflow-x': 'hidden',
            'overflow-y': 'hidden',
            'background-color': 'transparent',
            'border-top-width': '1px',
            'border-right-width': '1px',
            'border-bottom-width': '1px',
            'border-left-width': '1px',
            'border-top-color': 'rgba(200,168,110,0.1)',
            'border-right-color': 'rgba(200,168,110,0.1)',
            'border-bottom-color': 'rgba(200,168,110,0.1)',
            'border-left-color': 'rgba(200,168,110,0.1)',
        });
        await clearAndSet(await freshStyle('adu-plans-gallery-thumb-img'), 'adu-plans-gallery-thumb-img', {
            'width': '100%',
            'height': '100%',
            'display': 'block',
            'object-fit': 'cover',
        });
        await applyCTAStyleProps(v);
    }
    const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
    hero.setTag('section');
    hero.setStyles([heroStyle]);
    hero.setAttribute('id', 'adu-plans-hero');
    const heroInner = hero.append(webflow.elementPresets.DOM);
    heroInner.setTag('div');
    heroInner.setStyles([heroInnerStyle]);
    heroInner.setAttribute('data-adu-role', 'hero-inner');
    const heroCopy = heroInner.append(webflow.elementPresets.DOM);
    heroCopy.setTag('div');
    heroCopy.setStyles([heroCopyStyle]);
    createTextEl(heroCopy, 'div', '// Our Plans', { 'data-adu-animate': 'hero-copy' }, [heroLabelStyle]);
    createTextEl(heroCopy, 'h1', 'ADU Floor Plan Collection', { 'data-adu-animate': 'hero-copy' }, [heroTitleStyle]);
    createTextEl(heroCopy, 'p', 'Explore our signature floor plans — each designed for Orange County living.', { 'data-adu-animate': 'hero-copy' }, [heroSubtitleStyle]);
    const heroMedia = heroInner.append(webflow.elementPresets.DOM);
    heroMedia.setTag('div');
    heroMedia.setStyles([heroMediaStyle]);
    heroMedia.setAttribute('data-adu-role', 'hero-media');
    const heroCanvas = heroMedia.append(webflow.elementPresets.DOM);
    heroCanvas.setTag('canvas');
    heroCanvas.setStyles([heroMediaImgStyle]);
    heroCanvas.setAttribute('id', 'adu-plans-hero-canvas');
    heroCanvas.setAttribute('aria-label', 'ADU plan wireframe animation');
    heroCanvas.setAttribute('data-adu-animate', 'hero-media');
    const scroll = hero.append(webflow.elementPresets.DOM);
    scroll.setTag('div');
    scroll.setStyles([heroScrollStyle]);
    scroll.setAttribute('data-adu-animate', 'hero-copy');
    createTextEl(scroll, 'span', 'Scroll');
    const scrollLine = scroll.append(webflow.elementPresets.DOM);
    scrollLine.setTag('div');
    scrollLine.setStyles([heroScrollLineStyle]);
    await body.append(hero);
    for (const plan of PLAN_SECTIONS) {
        const section = webflow.elementBuilder(webflow.elementPresets.DOM);
        section.setTag('section');
        section.setStyles([sectionStyle]);
        section.setAttribute('data-adu-plan-section', plan.key);
        const inner = section.append(webflow.elementPresets.DOM);
        inner.setTag('div');
        inner.setStyles([sectionInnerStyle]);
        const layout = inner.append(webflow.elementPresets.DOM);
        layout.setTag('div');
        layout.setStyles([planLayoutStyle]);
        layout.setAttribute('data-adu-role', 'plan-layout');
        const viewerWrap = layout.append(webflow.elementPresets.DOM);
        viewerWrap.setTag('div');
        viewerWrap.setStyles([viewerWrapStyle]);
        viewerWrap.setAttribute('data-adu-role', 'plan-stage');
        const viewerFrame = viewerWrap.append(webflow.elementPresets.DOM);
        viewerFrame.setTag('div');
        viewerFrame.setStyles([viewerFrameStyle]);
        const iframe = viewerFrame.append(webflow.elementPresets.DOM);
        iframe.setTag('iframe');
        iframe.setStyles([viewerStyle]);
        iframe.setAttribute('data-adu-embed', plan.key);
        iframe.setAttribute('title', `${plan.title} 3D Viewer`);
        iframe.setAttribute('loading', 'lazy');
        iframe.setAttribute('src', plan.iframe);
        const hint = viewerWrap.append(webflow.elementPresets.DOM);
        hint.setTag('div');
        hint.setStyles([viewerHintStyle]);
        hint.setTextContent('Drag to rotate · Scroll to zoom');
        const info = layout.append(webflow.elementPresets.DOM);
        info.setTag('div');
        info.setStyles([infoStyle]);
        info.setAttribute('data-adu-role', 'plan-panel');
        createTextEl(info, 'div', plan.label, { 'data-adu-animate': 'section-copy' }, [planLabelStyle]);
        createTextEl(info, 'h2', plan.title, { 'data-adu-animate': 'section-copy' }, [planNameStyle]);
        createTextEl(info, 'div', plan.sqft, { 'data-adu-animate': 'section-copy' }, [sqftBadgeStyle]);
        createTextEl(info, 'p', plan.desc, { 'data-adu-animate': 'section-copy' }, [planDescStyle]);
        const tags = info.append(webflow.elementPresets.DOM);
        tags.setTag('div');
        tags.setStyles([roomTagsStyle]);
        tags.setAttribute('data-adu-animate', 'section-copy');
        plan.tags.forEach(tag => createTextEl(tags, 'span', tag, {}, [roomTagStyle]));
        createTextEl(info, 'div', 'Ideal Use Cases', { 'data-adu-animate': 'section-copy' }, [useTitleStyle]);
        const useList = info.append(webflow.elementPresets.DOM);
        useList.setTag('ul');
        useList.setStyles([useListStyle]);
        useList.setAttribute('data-adu-animate', 'section-copy');
        plan.useCases.forEach(item => {
            const li = useList.append(webflow.elementPresets.DOM);
            li.setTag('li');
            li.setStyles([useItemStyle]);
            li.setTextContent(item);
        });
        const gallery = info.append(webflow.elementPresets.DOM);
        gallery.setTag('div');
        gallery.setStyles([galleryStyle]);
        gallery.setAttribute('data-adu-animate', 'section-gallery');
        const heroMediaWrap = gallery.append(webflow.elementPresets.DOM);
        heroMediaWrap.setTag('div');
        heroMediaWrap.setStyles([galleryHeroStyle]);
        const mainImg = heroMediaWrap.append(webflow.elementPresets.DOM);
        mainImg.setTag('img');
        mainImg.setStyles([galleryHeroImgStyle]);
        mainImg.setAttribute('data-adu-main-image', 'true');
        mainImg.setAttribute('src', plan.rooms[0].img);
        mainImg.setAttribute('alt', `${plan.title} render`);
        const thumbs = gallery.append(webflow.elementPresets.DOM);
        thumbs.setTag('div');
        thumbs.setStyles([galleryThumbsStyle]);
        thumbs.setAttribute('data-adu-thumbs', plan.key);
        plan.rooms.slice(1).forEach(room => {
            const thumb = thumbs.append(webflow.elementPresets.DOM);
            thumb.setTag('button');
            thumb.setStyles([galleryThumbStyle]);
            thumb.setAttribute('type', 'button');
            thumb.setAttribute('data-adu-thumb', room.name);
            const thumbImg = thumb.append(webflow.elementPresets.DOM);
            thumbImg.setTag('img');
            thumbImg.setStyles([galleryThumbImgStyle]);
            thumbImg.setAttribute('src', room.img);
            thumbImg.setAttribute('alt', room.name);
        });
        await body.append(section);
    }
    await buildCTASection(body, v, 'Ready to Build Your ADU?', 'Get a Free Estimate', '/free-estimate', 'Call (714) 900-3676', 'tel:7149003676');
    await applyStyleProperties();
    log('ADU Plans Samples page built!', 'success');
    await webflow.notify({ type: 'Success', message: 'ADU Plans Samples page created!' });
}
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
        const text = type === 'head' ? HEAD_CODE : type === 'footer' ? getFooterCode() : '';
        if (type === 'footer' && footerCodeEl)
            footerCodeEl.textContent = text;
        navigator.clipboard.writeText(text).then(() => {
            btn.textContent = 'Copied!';
            setTimeout(() => {
                btn.textContent = 'Copy';
            }, 2000);
        });
    });
});
document.getElementById('build-page')?.addEventListener('click', async () => {
    const btn = document.getElementById('build-page');
    btn.disabled = true;
    try {
        renderCodeSnippets();
        await buildPlansPage();
    }
    catch (err) {
        log(`Error: ${err.message || err}`, 'error');
        await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
    }
    finally {
        btn.disabled = false;
    }
});
