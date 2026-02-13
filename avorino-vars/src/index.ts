// Avorino Builder — Variables + Page Builders
// Webflow Designer Extension

declare const webflow: any;

const statusEl = document.getElementById('status') as HTMLDivElement;
const errorLogEl = document.getElementById('error-log') as HTMLDivElement;

function log(msg: string, type: 'info' | 'success' | 'error' = 'info') {
  statusEl.textContent = msg;
  statusEl.className = type;
}

function logDetail(msg: string, type: 'err' | 'ok' | 'info' = 'info') {
  const line = document.createElement('div');
  line.className = `${type}-line`;
  line.textContent = msg;
  errorLogEl.appendChild(line);
  errorLogEl.scrollTop = errorLogEl.scrollHeight;
}

function clearErrorLog() {
  errorLogEl.innerHTML = '';
}

// Delay helper — gives Webflow API time to settle between calls
const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

// API call delay in ms between each operation
const API_DELAY = 150;

// Safe API call wrapper: delay + retry + error logging
async function safeCall<T>(label: string, fn: () => Promise<T>, retries = 2): Promise<T> {
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      await wait(API_DELAY);
      const result = await fn();
      return result;
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (attempt <= retries) {
        logDetail(`RETRY ${attempt}/${retries}: ${label} — ${msg}`, 'err');
        await wait(API_DELAY * 3); // longer wait before retry
      } else {
        logDetail(`FAILED: ${label} — ${msg}`, 'err');
        throw err;
      }
    }
  }
  throw new Error(`Unreachable: ${label}`);
}

// ════════════════════════════════════════════════════════════════
// VARIABLES INJECTOR (existing)
// ════════════════════════════════════════════════════════════════

document.getElementById('inject-btn')?.addEventListener('click', async () => {
  const btn = document.getElementById('inject-btn') as HTMLButtonElement;
  btn.disabled = true;
  log('Creating variable collection...');

  try {
    const col = await webflow.createVariableCollection('Avorino');
    if (!col) throw new Error('Failed to create collection');

    // Colors
    const avDark  = await col.createColorVariable('av-dark',  '#111111');
    const avCream = await col.createColorVariable('av-cream', '#f0ede8');
    await col.createColorVariable('av-warm',  '#e8e4df');
    await col.createColorVariable('av-red',   '#c8222a');
    await col.createColorVariable('av-text-dark',  avDark);
    await col.createColorVariable('av-text-light', avCream);
    await col.createColorVariable('av-dark-06',  'rgba(17,17,17,0.06)');
    await col.createColorVariable('av-dark-10',  'rgba(17,17,17,0.10)');
    await col.createColorVariable('av-dark-15',  'rgba(17,17,17,0.15)');
    await col.createColorVariable('av-cream-06', 'rgba(240,237,232,0.06)');
    await col.createColorVariable('av-cream-40', 'rgba(240,237,232,0.40)');
    await col.createColorVariable('av-teal',  '#2a3f4e');
    await col.createColorVariable('av-brown', '#8b7355');

    // Fonts
    await col.createFontFamilyVariable('av-font-display', 'DM Serif Display');
    await col.createFontFamilyVariable('av-font-body',    'DM Sans');

    // Sizes
    await col.createSizeVariable('av-section-pad-y', { unit: 'px', value: 128 });
    await col.createSizeVariable('av-section-pad-x', { unit: 'px', value: 80 });
    await col.createSizeVariable('av-page-pad',      { unit: 'px', value: 48 });
    await col.createSizeVariable('av-gap-xl',  { unit: 'px', value: 128 });
    await col.createSizeVariable('av-gap-lg',  { unit: 'px', value: 96 });
    await col.createSizeVariable('av-gap-md',  { unit: 'px', value: 64 });
    await col.createSizeVariable('av-gap-sm',  { unit: 'px', value: 32 });
    await col.createSizeVariable('av-gap-xs',  { unit: 'px', value: 16 });
    await col.createSizeVariable('av-radius',      { unit: 'px', value: 8 });
    await col.createSizeVariable('av-radius-pill', { unit: 'px', value: 100 });
    await col.createSizeVariable('av-text-h1', { type: 'custom', value: 'clamp(56px, 7vw, 96px)' });
    await col.createSizeVariable('av-text-h2', { type: 'custom', value: 'clamp(40px, 4.5vw, 64px)' });
    await col.createSizeVariable('av-text-h3', { type: 'custom', value: 'clamp(28px, 3vw, 44px)' });
    await col.createSizeVariable('av-text-body',  { unit: 'px', value: 17 });
    await col.createSizeVariable('av-text-sm',    { unit: 'px', value: 14 });
    await col.createSizeVariable('av-text-label', { unit: 'px', value: 11 });
    await col.createSizeVariable('av-text-xs',    { unit: 'px', value: 10 });
    await col.createSizeVariable('av-btn-pad-y', { unit: 'px', value: 18 });
    await col.createSizeVariable('av-btn-pad-x', { unit: 'px', value: 40 });

    // Numbers
    await col.createNumberVariable('av-leading-tight',   1.08);
    await col.createNumberVariable('av-leading-heading', 1.12);
    await col.createNumberVariable('av-leading-body',    1.9);
    await col.createNumberVariable('av-leading-quote',   1.7);
    await col.createNumberVariable('av-opacity-muted',   60);
    await col.createNumberVariable('av-opacity-subtle',  40);
    await col.createNumberVariable('av-opacity-faint',   20);
    await col.createNumberVariable('av-opacity-ghost',   7);

    log('All variables created!', 'success');
    await webflow.notify({ type: 'Success', message: 'Avorino variables created!' });
  } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
  } finally {
    btn.disabled = false;
  }
});

// ════════════════════════════════════════════════════════════════
// HELPER: Fetch variables from existing Avorino collection
// ════════════════════════════════════════════════════════════════

// All variable names the About page builder expects
const EXPECTED_VARS = [
  // Colors
  'av-dark', 'av-cream', 'av-warm', 'av-red',
  'av-text-dark', 'av-text-light',
  'av-dark-06', 'av-dark-10', 'av-dark-15',
  'av-cream-06', 'av-cream-40', 'av-teal', 'av-brown',
  // Fonts
  'av-font-display', 'av-font-body',
  // Sizes
  'av-section-pad-y', 'av-section-pad-x', 'av-page-pad',
  'av-gap-xl', 'av-gap-lg', 'av-gap-md', 'av-gap-sm', 'av-gap-xs',
  'av-radius', 'av-radius-pill',
  'av-text-h1', 'av-text-h2', 'av-text-h3',
  'av-text-body', 'av-text-sm', 'av-text-label', 'av-text-xs',
  'av-btn-pad-y', 'av-btn-pad-x',
];

async function getAvorinVars() {
  const collections = await webflow.getAllVariableCollections();
  let col = null;
  for (const c of collections) {
    const name = await c.getName();
    if (name === 'Avorino') { col = c; break; }
  }
  if (!col) throw new Error('Avorino variable collection not found. Create variables first.');

  const allVars = await col.getAllVariables();
  const vars: Record<string, any> = {};
  for (const v of allVars) {
    const name = await v.getName();
    vars[name] = v;
  }

  // Log all loaded variable names
  const loadedNames = Object.keys(vars);
  logDetail(`Loaded ${loadedNames.length} variables: ${loadedNames.join(', ')}`, 'info');

  // Check for missing variables
  const missing = EXPECTED_VARS.filter(n => !vars[n]);
  if (missing.length > 0) {
    logDetail(`MISSING ${missing.length} variables: ${missing.join(', ')}`, 'err');
  } else {
    logDetail('All expected variables found', 'ok');
  }

  return vars;
}

// ════════════════════════════════════════════════════════════════
// HELPER: Get or create a style
// ════════════════════════════════════════════════════════════════

async function getOrCreateStyle(name: string): Promise<any> {
  return safeCall(`style:${name}`, async () => {
    const existing = await webflow.getStyleByName(name);
    if (existing) return existing;
    return webflow.createStyle(name);
  });
}

// Set style properties using setProperty (singular) for each prop.
async function setProps(style: any, name: string, props: Record<string, any>): Promise<void> {
  for (const [prop, val] of Object.entries(props)) {
    if (val === undefined || val === null) {
      logDetail(`SKIP ${name}.${prop} — value is ${val}`, 'err');
      continue;
    }
    try {
      await wait(50);
      await style.setProperty(prop, val);
    } catch (err: any) {
      logDetail(`ERR ${name}.${prop} — ${err?.message || err}`, 'err');
    }
  }
}

// Re-fetch a style by name (avoids stale refs from previous builds)
async function freshStyle(name: string): Promise<any> {
  const style = await webflow.getStyleByName(name);
  if (!style) throw new Error(`Style "${name}" not found`);
  return style;
}

// Clear all existing properties, then set new ones using setProperty (singular).
// This avoids conflicts with properties left over from previous builds.
async function clearAndSet(style: any, name: string, props: Record<string, any>): Promise<void> {
  try {
    await style.removeAllProperties();
    await wait(200);
  } catch (err: any) {
    logDetail(`WARN clear ${name}: ${err?.message || err}`, 'err');
  }
  await setProps(style, name, props);
}

// Clear all existing properties, then set new ones using setProperties (batch).
async function clearAndSetBatch(style: any, name: string, props: Record<string, any>): Promise<void> {
  try {
    await style.removeAllProperties();
    await wait(200);
  } catch (err: any) {
    logDetail(`WARN clear ${name}: ${err?.message || err}`, 'err');
  }
  try {
    await wait(50);
    await style.setProperties(props);
  } catch (err: any) {
    logDetail(`ERR setProperties ${name}: ${err?.message || err}`, 'err');
  }
}

// ════════════════════════════════════════════════════════════════
// SHARED STYLES — reusable across all pages
// ════════════════════════════════════════════════════════════════

async function createSharedStyles() {
  const styles: Record<string, any> = {};

  // Create ALL style objects SEQUENTIALLY (no properties yet)
  log('Creating shared style objects...');
  const section = await getOrCreateStyle('av-section');
  const body = await getOrCreateStyle('av-body');
  const headingXL = await getOrCreateStyle('av-heading-xl');
  const headingLG = await getOrCreateStyle('av-heading-lg');
  const headingMD = await getOrCreateStyle('av-heading-md');
  const label = await getOrCreateStyle('av-label');
  const grid2 = await getOrCreateStyle('av-grid-2col');
  const grid3 = await getOrCreateStyle('av-grid-3col');
  const cardDark = await getOrCreateStyle('av-card-dark');
  const cardLight = await getOrCreateStyle('av-card-light');
  const btnPrimary = await getOrCreateStyle('av-btn-primary');
  const btnSecondary = await getOrCreateStyle('av-btn-outline');
  const flexCol = await getOrCreateStyle('av-flex-col');
  const flexCenter = await getOrCreateStyle('av-flex-center');
  const flexWrap = await getOrCreateStyle('av-flex-wrap');
  const sectionWarm = await getOrCreateStyle('av-section-warm');
  const sectionDark = await getOrCreateStyle('av-section-dark');
  const sectionCream = await getOrCreateStyle('av-section-cream');
  const bodyMuted = await getOrCreateStyle('av-body-muted');
  Object.assign(styles, { section, body, headingXL, headingLG, headingMD, label, grid2, grid3, cardDark, cardLight, btnPrimary, btnSecondary, flexCol, flexCenter, flexWrap, sectionWarm, sectionDark, sectionCream, bodyMuted });
  return styles;
}

// Set shared style properties (called AFTER page is created and switched to)
// Uses freshStyle() + clearAndSet() to avoid stale refs and leftover props.
async function setSharedStyleProps(styles: Record<string, any>, v: Record<string, any>) {
  log('Setting shared style properties...');
  // RULES:
  // 1. Always re-fetch style via freshStyle() — avoids stale refs from build phase
  // 2. Always clearAndSet() — removes leftover props from previous builds
  // 3. Use grid-column-gap / grid-row-gap (not gap / column-gap / row-gap)
  // 4. Use string font names (not FontFamilyVariable)
  // 5. SKIP styles not applied to any element on this page

  logDetail('Setting section variant props...', 'info');
  await clearAndSet(await freshStyle('av-section-warm'), 'av-section-warm', {
    'padding-top': v['av-section-pad-y'], 'padding-bottom': v['av-section-pad-y'],
    'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
    'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    'background-color': v['av-warm'], 'color': v['av-dark'],
  });
  await clearAndSet(await freshStyle('av-section-dark'), 'av-section-dark', {
    'padding-top': v['av-section-pad-y'], 'padding-bottom': v['av-section-pad-y'],
    'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
    'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    'background-color': v['av-dark'], 'color': v['av-cream'],
  });
  // SKIPPED: av-section — not applied to any element
  // SKIPPED: av-section-cream — not applied to any element
  await wait(500);

  logDetail('Setting text style props...', 'info');
  // SKIPPED: av-body — not applied (av-body-muted is used instead)
  await clearAndSet(await freshStyle('av-body-muted'), 'av-body-muted', { 'opacity': '0.6' });
  await clearAndSet(await freshStyle('av-heading-xl'), 'av-heading-xl', {
    'font-family': 'DM Serif Display', 'font-size': v['av-text-h1'],
    'line-height': '1.04', 'letter-spacing': '-0.03em', 'font-weight': '400',
    'margin-top': '0px', 'margin-bottom': '0px', 'color': 'inherit',
  });
  await clearAndSet(await freshStyle('av-heading-lg'), 'av-heading-lg', {
    'font-family': 'DM Serif Display', 'font-size': v['av-text-h2'],
    'line-height': '1.08', 'letter-spacing': '-0.02em', 'font-weight': '400',
    'margin-top': '0px', 'margin-bottom': '0px', 'color': 'inherit',
  });
  await clearAndSet(await freshStyle('av-heading-md'), 'av-heading-md', {
    'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
    'line-height': '1.12', 'font-weight': '400',
    'margin-top': '0px', 'margin-bottom': '0px', 'color': 'inherit',
  });
  await wait(500);

  logDetail('Setting label style props...', 'info');
  await clearAndSet(await freshStyle('av-label'), 'av-label', {
    'font-family': 'DM Sans', 'font-size': v['av-text-label'],
    'letter-spacing': '0.3em', 'text-transform': 'uppercase', 'font-weight': '400',
    'opacity': '0.2', 'display': 'flex', 'align-items': 'center', 'grid-column-gap': '24px',
    'margin-top': '0px', 'margin-bottom': '0px',
  });
  await wait(500);

  logDetail('Setting grid/layout props...', 'info');
  await clearAndSet(await freshStyle('av-grid-2col'), 'av-grid-2col', {
    'display': 'grid', 'grid-template-columns': '1fr 1fr',
    'grid-column-gap': '96px', 'grid-row-gap': '96px',
  });
  // SKIPPED: av-grid-3col — not applied to any element on About page
  await wait(500);

  logDetail('Setting card style props...', 'info');
  await clearAndSet(await freshStyle('av-card-dark'), 'av-card-dark', {
    'background-color': v['av-dark'], 'color': v['av-cream'],
    'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
    'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
    'padding-top': v['av-gap-md'], 'padding-bottom': v['av-gap-md'],
    'padding-left': v['av-gap-md'], 'padding-right': v['av-gap-md'],
  });
  // SKIPPED: av-card-light — not applied to any element on About page

  // SKIPPED: av-btn-primary, av-btn-outline — not applied to any element
  // SKIPPED: av-flex-col, av-flex-center, av-flex-wrap — not applied to any element

  return styles;
}

// ════════════════════════════════════════════════════════════════
// ABOUT PAGE BUILDER
// ════════════════════════════════════════════════════════════════

async function buildAboutPage() {
  clearErrorLog();
  logDetail('Starting About page build...', 'info');
  const v = await getAvorinVars();
  logDetail('Loaded Avorino variable collection', 'ok');
  log('Creating shared styles...');
  const s = await createSharedStyles();
  logDetail('Shared styles done', 'ok');

  // ── Page-specific styles: create ALL SEQUENTIALLY ──
  // IMPORTANT: Parallel getOrCreateStyle overwhelms Webflow API → red error spam.
  log('Creating page-specific styles...');
  const heroSection = await getOrCreateStyle('about-hero');
  const heroOverlay = await getOrCreateStyle('about-hero-overlay');
  const heroContent = await getOrCreateStyle('about-hero-content');
  const heroSubtitle = await getOrCreateStyle('about-hero-subtitle');
  const storyBody = await getOrCreateStyle('about-story-body');
  const maxWidth520 = await getOrCreateStyle('av-max-520');
  const maxWidth580 = await getOrCreateStyle('av-max-580');
  const mb48 = await getOrCreateStyle('av-mb-48');
  const mb64 = await getOrCreateStyle('av-mb-64');
  const mb96 = await getOrCreateStyle('av-mb-96');
  const cardLabel = await getOrCreateStyle('about-card-label');
  const cardHeading = await getOrCreateStyle('about-card-heading');
  const cardBody = await getOrCreateStyle('about-card-body');
  const ctaSection = await getOrCreateStyle('about-cta');
  const ctaContainer = await getOrCreateStyle('about-cta-container');
  const ctaHeading = await getOrCreateStyle('about-cta-heading');
  const ctaBtnLight = await getOrCreateStyle('about-cta-btn');
  const ctaBtns = await getOrCreateStyle('about-cta-btns');
  const valueNumber = await getOrCreateStyle('about-value-num');
  const valueTitle = await getOrCreateStyle('about-value-title');
  const valueDesc = await getOrCreateStyle('about-value-desc');
  const valuesZigzag = await getOrCreateStyle('about-values-zigzag');
  const valuesRow = await getOrCreateStyle('about-values-row');
  const valuesCard = await getOrCreateStyle('about-values-card');
  const valuesSpacer = await getOrCreateStyle('about-values-spacer');
  const valuesSnakeAnchor = await getOrCreateStyle('about-values-snake-anchor');
  const processPinned = await getOrCreateStyle('about-process-pinned');
  const processVisual = await getOrCreateStyle('about-process-visual');
  const processFx = await getOrCreateStyle('about-process-fx');
  const processCards = await getOrCreateStyle('about-process-cards');
  const processCard = await getOrCreateStyle('about-process-card');
  const processNav = await getOrCreateStyle('about-process-nav');
  const processCardNum = await getOrCreateStyle('about-process-card-num');
  const processCardTitle = await getOrCreateStyle('about-process-card-title');
  const processCardDesc = await getOrCreateStyle('about-process-card-desc');
  const commSection = await getOrCreateStyle('about-comm');
  const commGrid = await getOrCreateStyle('about-comm-grid');
  const commImgPlaceholder = await getOrCreateStyle('about-comm-img');
  const aduCard = await getOrCreateStyle('about-adu-card');
  const labelLine = await getOrCreateStyle('about-label-line');
  const storyLink = await getOrCreateStyle('about-story-link');
  const commHeadingWrap = await getOrCreateStyle('about-comm-heading');
  const cursorRing = await getOrCreateStyle('cursor-ring');
  const cursorDot = await getOrCreateStyle('cursor-dot');
  const statsGrid = await getOrCreateStyle('about-stats-grid');
  const statItem = await getOrCreateStyle('about-stat-item');
  const statNumber = await getOrCreateStyle('about-stat-number');
  const statLabel = await getOrCreateStyle('about-stat-label');
  const storyImg = await getOrCreateStyle('about-story-img');

  // ════════════════════════════════════════════════
  // CREATE PAGE (must exist before setting style properties)
  // ════════════════════════════════════════════════
  log('Creating About page...');
  const allItems: any[] = await safeCall('getAllPagesAndFolders', () => webflow.getAllPagesAndFolders());
  for (const item of allItems) {
    try {
      const name = await (item as any).getName();
      if (name === 'About') {
        throw new Error('About page already exists! Delete it in the Pages panel first, then try again.');
      }
    } catch (e: any) {
      if (e.message?.includes('already exists')) throw e;
    }
  }
  const page: any = await safeCall('createPage', () => webflow.createPage());
  await safeCall('setName', () => page.setName('About'));
  await safeCall('setSlug', () => page.setSlug('about'));
  logDetail('Created new About page', 'ok');

  await safeCall('setTitle', () => page.setTitle('About Avorino \u2014 Custom Home & ADU Builder in Orange County'));
  await safeCall('setDescription', () => page.setDescription('Learn about Avorino, a custom home and ADU builder in Orange County since 2010. Exceptional craftsmanship, innovative design, and unwavering commitment to quality.'));
  logDetail('Set page title & description', 'ok');

  await safeCall('switchPage', () => webflow.switchPage(page));
  logDetail('Switched to About page', 'ok');

  const allElements: any[] = await safeCall('getAllElements', () => webflow.getAllElements());
  const body = allElements[0];
  logDetail(`Got body element (${allElements.length} elements on page)`, 'ok');

  // Style property setter — called after all elements are built
  // Uses freshStyle() + clearAndSet() — re-fetches each style by name (avoids stale refs),
  // clears leftover props, then sets fresh values with proper MDN CSS property names.
  async function applyStyleProperties() {
  log('Setting shared style properties...');
  await setSharedStyleProps(s, v);
  logDetail('Shared style properties set', 'ok');
  await wait(1000);

  log('Setting page-specific style properties...');
  logDetail('Setting hero style props...', 'info');
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

  logDetail('Setting story/utility style props...', 'info');
  await clearAndSet(await freshStyle('about-story-body'), 'about-story-body', {
    'display': 'flex', 'flex-direction': 'column', 'justify-content': 'flex-end', 'padding-top': '8px',
  });
  await clearAndSet(await freshStyle('av-max-520'), 'av-max-520', { 'max-width': '520px' });
  await clearAndSet(await freshStyle('av-max-580'), 'av-max-580', { 'max-width': '580px' });
  await clearAndSet(await freshStyle('av-mb-48'), 'av-mb-48', { 'margin-bottom': '48px' });
  await clearAndSet(await freshStyle('av-mb-64'), 'av-mb-64', { 'margin-bottom': v['av-gap-md'] });
  await clearAndSet(await freshStyle('av-mb-96'), 'av-mb-96', { 'margin-bottom': v['av-gap-lg'] });
  await wait(500);

  logDetail('Setting card/CTA style props...', 'info');
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
  await clearAndSet(await freshStyle('about-cta'), 'about-cta', {
    'padding-top': v['av-page-pad'], 'padding-bottom': v['av-page-pad'],
    'padding-left': v['av-page-pad'], 'padding-right': v['av-page-pad'],
  });
  await clearAndSet(await freshStyle('about-cta-container'), 'about-cta-container', {
    'background-color': v['av-dark'], 'color': v['av-cream'],
    'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
    'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
    'padding-top': v['av-section-pad-y'], 'padding-bottom': v['av-section-pad-y'],
    'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
    'display': 'flex', 'flex-direction': 'column', 'align-items': 'center', 'text-align': 'center',
  });
  await clearAndSet(await freshStyle('about-cta-heading'), 'about-cta-heading', {
    'font-family': 'DM Serif Display', 'font-size': v['av-text-h2'],
    'line-height': '1.08', 'letter-spacing': '-0.02em', 'font-weight': '400',
    'margin-bottom': v['av-gap-sm'], 'max-width': '12em', 'color': v['av-cream'],
  });
  await clearAndSet(await freshStyle('about-cta-btn'), 'about-cta-btn', {
    'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
    'font-weight': '500', 'letter-spacing': '0.04em',
    'display': 'inline-flex', 'align-items': 'center', 'grid-column-gap': '12px',
    'color': v['av-dark'], 'background-color': v['av-cream'],
    'padding-top': v['av-btn-pad-y'], 'padding-bottom': v['av-btn-pad-y'],
    'padding-left': v['av-btn-pad-x'], 'padding-right': v['av-btn-pad-x'],
    'border-top-left-radius': v['av-radius-pill'], 'border-top-right-radius': v['av-radius-pill'],
    'border-bottom-left-radius': v['av-radius-pill'], 'border-bottom-right-radius': v['av-radius-pill'],
    'text-decoration': 'none',
  });
  await clearAndSet(await freshStyle('about-cta-btns'), 'about-cta-btns', {
    'display': 'flex', 'grid-column-gap': '16px', 'grid-row-gap': '16px',
    'flex-wrap': 'wrap', 'justify-content': 'center', 'margin-top': '16px',
  });
  await wait(500);

  logDetail('Setting values/process style props...', 'info');
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
  await clearAndSet(await freshStyle('about-values-spacer'), 'about-values-spacer', {
    'min-height': '1px',
  });
  await clearAndSet(await freshStyle('about-values-snake-anchor'), 'about-values-snake-anchor', {
    'position': 'absolute', 'top': '0px', 'left': '0px',
    'width': '100%', 'height': '100%', 'z-index': '1',
  });
  await wait(500);

  // Process section styles (revamped: scroll-lock + Three.js)
  await clearAndSet(await freshStyle('about-process-pinned'), 'about-process-pinned', {
    'height': '100vh', 'display': 'flex', 'position': 'relative',
    'overflow-x': 'hidden', 'overflow-y': 'hidden',
  });
  await clearAndSet(await freshStyle('about-process-visual'), 'about-process-visual', {
    'width': '100%', 'height': '100%', 'position': 'relative',
  });
  await clearAndSet(await freshStyle('about-process-fx'), 'about-process-fx', {
    'position': 'absolute', 'top': '0px', 'left': '0px',
    'width': '100%', 'height': '100%',
  });
  await clearAndSet(await freshStyle('about-process-cards'), 'about-process-cards', {
    'position': 'absolute', 'top': '0px', 'left': '0px',
    'width': '100%', 'height': '100%', 'z-index': '2',
  });
  await clearAndSet(await freshStyle('about-process-card'), 'about-process-card', {
    'position': 'absolute', 'background-color': v['av-dark'], 'color': v['av-cream'],
    'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
    'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
    'padding-top': '56px', 'padding-bottom': '56px',
    'padding-left': '48px', 'padding-right': '48px',
    'max-width': '500px', 'width': '100%',
    'top': '50%', 'left': '50%',
  });
  await clearAndSet(await freshStyle('about-process-nav'), 'about-process-nav', {
    'position': 'absolute', 'bottom': '32px', 'left': '0px',
    'width': '100%', 'text-align': 'center',
  });
  await clearAndSet(await freshStyle('about-process-card-num'), 'about-process-card-num', {
    'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
    'letter-spacing': '0.2em', 'text-transform': 'uppercase',
    'opacity': '0.4', 'margin-bottom': '16px',
    'color': v['av-cream'],
  });
  await clearAndSet(await freshStyle('about-process-card-title'), 'about-process-card-title', {
    'font-family': 'DM Serif Display', 'font-size': '28px',
    'line-height': '1.2', 'font-weight': '400', 'margin-bottom': '14px',
    'color': v['av-cream'],
  });
  await clearAndSet(await freshStyle('about-process-card-desc'), 'about-process-card-desc', {
    'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
    'line-height': '1.7', 'opacity': '0.5',
    'color': v['av-cream'],
  });
  await wait(500);

  logDetail('Setting comm/adu/stats style props...', 'info');
  await clearAndSet(await freshStyle('about-comm'), 'about-comm', {
    'padding-top': v['av-section-pad-y'], 'padding-bottom': v['av-section-pad-y'],
    'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
    'background-color': v['av-dark'], 'color': v['av-cream'],
  });
  await clearAndSet(await freshStyle('about-comm-grid'), 'about-comm-grid', {
    'display': 'grid', 'grid-template-columns': '1fr 1fr',
    'grid-column-gap': '96px', 'grid-row-gap': '64px', 'align-items': 'center',
  });
  await clearAndSet(await freshStyle('about-comm-img'), 'about-comm-img', {
    'width': '100%', 'height': '400px', 'background-color': 'rgba(240,237,232,0.06)',
    'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
    'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
  });
  await clearAndSet(await freshStyle('about-adu-card'), 'about-adu-card', {
    'background-color': v['av-dark'], 'color': v['av-cream'],
    'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
    'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
    'display': 'flex', 'flex-direction': 'column', 'align-items': 'center',
    'text-align': 'center',
    'padding-top': '96px', 'padding-bottom': '96px',
    'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
    'overflow-x': 'hidden', 'overflow-y': 'hidden',
  });
  await clearAndSet(await freshStyle('about-label-line'), 'about-label-line', {
    'flex-grow': '1', 'height': '1px', 'background-color': v['av-dark-15'],
  });
  await clearAndSet(await freshStyle('about-story-link'), 'about-story-link', {
    'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
    'color': v['av-dark'], 'text-decoration': 'none', 'opacity': '0.5',
    'margin-top': '24px', 'display': 'inline-block',
  });
  await clearAndSet(await freshStyle('about-comm-heading'), 'about-comm-heading', {
    'margin-bottom': '32px', 'color': v['av-cream'],
  });
  await clearAndSet(await freshStyle('about-stats-grid'), 'about-stats-grid', {
    'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr',
    'grid-column-gap': '64px', 'grid-row-gap': '64px',
    'text-align': 'center',
  });
  await clearAndSet(await freshStyle('about-stat-item'), 'about-stat-item', {
    'display': 'flex', 'flex-direction': 'column', 'align-items': 'center',
  });
  await clearAndSet(await freshStyle('about-stat-number'), 'about-stat-number', {
    'font-family': 'DM Serif Display', 'font-size': 'clamp(64px, 8vw, 120px)',
    'line-height': '1', 'letter-spacing': '-0.03em', 'font-weight': '400',
    'color': v['av-cream'], 'margin-bottom': '16px',
  });
  await clearAndSet(await freshStyle('about-stat-label'), 'about-stat-label', {
    'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
    'letter-spacing': '0.15em', 'text-transform': 'uppercase',
    'opacity': '0.4', 'color': v['av-cream'],
  });
  await clearAndSet(await freshStyle('about-story-img'), 'about-story-img', {
    'width': '100%', 'height': '100%', 'min-height': '400px',
    'background-color': v['av-dark-06'],
    'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
    'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
  });
  } // end applyStyleProperties

  // ════════════════════════════════════════════════
  // BUILD ELEMENTS (style properties applied after all appends)
  // ════════════════════════════════════════════════

  // Cursor elements (required by CDN footer JS)
  const cursorRingEl = webflow.elementBuilder(webflow.elementPresets.DOM);
  cursorRingEl.setTag('div');
  cursorRingEl.setStyles([cursorRing]);
  await safeCall('append:cursor-ring', () => body.append(cursorRingEl));
  const cursorDotEl = webflow.elementBuilder(webflow.elementPresets.DOM);
  cursorDotEl.setTag('div');
  cursorDotEl.setStyles([cursorDot]);
  await safeCall('append:cursor-dot', () => body.append(cursorDotEl));
  logDetail('Cursor elements added', 'ok');

  // ════════════════════════════════════════════════
  // SECTION 1: HERO
  // ════════════════════════════════════════════════
  log('Building Section 1: Hero...');
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
  logDetail('Section 1: Hero appended', 'ok');

  // ════════════════════════════════════════════════
  // SECTION 2: STORY
  // ════════════════════════════════════════════════
  log('Building Section 2: Story...');
  const story = webflow.elementBuilder(webflow.elementPresets.DOM);
  story.setTag('section');
  story.setStyles([s.section, s.sectionWarm]);
  story.setAttribute('id', 'about-story');

  const storyLabel = story.append(webflow.elementPresets.DOM);
  storyLabel.setTag('div');
  storyLabel.setStyles([s.label, mb64]);
  storyLabel.setAttribute('data-animate', 'fade-up');
  const storyLabelTxt = storyLabel.append(webflow.elementPresets.DOM);
  storyLabelTxt.setTag('div');
  storyLabelTxt.setTextContent('Our Story');
  const storyLabelLine = storyLabel.append(webflow.elementPresets.DOM);
  storyLabelLine.setTag('div');
  storyLabelLine.setStyles([labelLine]);

  const storyGrid = story.append(webflow.elementPresets.DOM);
  storyGrid.setTag('div');
  storyGrid.setStyles([s.grid2]);

  // Left: image placeholder (like reference sites — image beside text)
  const storyLeft = storyGrid.append(webflow.elementPresets.DOM);
  storyLeft.setTag('div');
  storyLeft.setAttribute('data-animate', 'fade-up');

  const storyImgEl = storyLeft.append(webflow.elementPresets.DOM);
  storyImgEl.setTag('div');
  storyImgEl.setStyles([storyImg]);

  // Right: heading + body + link
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
  logDetail('Section 2: Story appended', 'ok');

  // ════════════════════════════════════════════════
  // SECTION 2B: STATS (inspired by DMDC/Sobart counter sections)
  // ════════════════════════════════════════════════
  log('Building Section 2B: Stats...');
  const stats = webflow.elementBuilder(webflow.elementPresets.DOM);
  stats.setTag('section');
  stats.setStyles([s.section, s.sectionDark]);
  stats.setAttribute('id', 'about-stats');

  const statsG = stats.append(webflow.elementPresets.DOM);
  statsG.setTag('div');
  statsG.setStyles([statsGrid]);

  const statsData = [
    { number: '15+', label: 'Years of Experience' },
    { number: '200+', label: 'Projects Completed' },
    { number: '50+', label: 'ADUs Built' },
  ];
  statsData.forEach(stat => {
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
  logDetail('Section 2B: Stats appended', 'ok');

  // ════════════════════════════════════════════════
  // SECTION 3: MISSION & VISION
  // ════════════════════════════════════════════════
  log('Building Section 3: Mission & Vision...');
  const mv = webflow.elementBuilder(webflow.elementPresets.DOM);
  mv.setTag('section');
  mv.setStyles([s.section, s.sectionWarm]);
  mv.setAttribute('id', 'about-mission-vision');

  const mvGrid = mv.append(webflow.elementPresets.DOM);
  mvGrid.setTag('div');
  mvGrid.setStyles([s.grid2]);

  // Mission card
  const mCard = mvGrid.append(webflow.elementPresets.DOM);
  mCard.setTag('div');
  mCard.setStyles([s.cardDark]);
  mCard.setAttribute('data-animate', 'fade-up');

  const mLabel = mCard.append(webflow.elementPresets.DOM);
  mLabel.setTag('div');
  mLabel.setStyles([cardLabel]);
  mLabel.setTextContent('Mission');

  const mH = mCard.append(webflow.elementPresets.DOM);
  mH.setTag('h3');
  mH.setStyles([cardHeading]);
  mH.setTextContent('Bringing visionary dreams to life');

  const mP = mCard.append(webflow.elementPresets.DOM);
  mP.setTag('p');
  mP.setStyles([cardBody]);
  mP.setTextContent('Our mission is to bring visionary dreams to life through strong communication and transformative construction. As builders, we are committed to delivering exceptional projects that exceed expectations, inspire awe, and leave a lasting impact. With a focus on collaboration and innovation, we strive to create spaces that not only fulfill our clients\' visions but also enhance the lives of those who experience them.');

  // Vision card
  const vCard = mvGrid.append(webflow.elementPresets.DOM);
  vCard.setTag('div');
  vCard.setStyles([s.cardDark]);
  vCard.setAttribute('data-animate', 'fade-up');

  const vLabel = vCard.append(webflow.elementPresets.DOM);
  vLabel.setTag('div');
  vLabel.setStyles([cardLabel]);
  vLabel.setTextContent('Vision');

  const vH = vCard.append(webflow.elementPresets.DOM);
  vH.setTag('h3');
  vH.setStyles([cardHeading]);
  vH.setTextContent('The catalyst for transformation');

  const vP = vCard.append(webflow.elementPresets.DOM);
  vP.setTag('p');
  vP.setStyles([cardBody]);
  vP.setTextContent('Our vision is to be the catalyst for transformation in the construction industry. We aspire to be known as the go-to builders for visionary projects, where dreams become reality. Through our commitment to strong communication, we aim to foster deep understanding and collaboration with our clients, partners, and communities.');

  await safeCall('append:mission-vision', () => body.append(mv));
  logDetail('Section 3: Mission & Vision appended', 'ok');

  // ════════════════════════════════════════════════
  // SECTION 4: CTA BANNER
  // ════════════════════════════════════════════════
  log('Building Section 4: CTA Banner...');
  const cta1 = webflow.elementBuilder(webflow.elementPresets.DOM);
  cta1.setTag('section');
  cta1.setStyles([ctaSection]);

  const cta1C = cta1.append(webflow.elementPresets.DOM);
  cta1C.setTag('div');
  cta1C.setStyles([ctaContainer]);

  const cta1H = cta1C.append(webflow.elementPresets.DOM);
  cta1H.setTag('h2');
  cta1H.setStyles([ctaHeading]);
  cta1H.setTextContent('Create your dream home');
  cta1H.setAttribute('data-animate', 'word-stagger-elastic');

  const cta1Sub = cta1C.append(webflow.elementPresets.DOM);
  cta1Sub.setTag('p');
  cta1Sub.setStyles([cardBody]);
  cta1Sub.setTextContent('Tell us about your project today.');
  cta1Sub.setAttribute('data-animate', 'fade-up');

  const cta1Btns = cta1C.append(webflow.elementPresets.DOM);
  cta1Btns.setTag('div');
  cta1Btns.setStyles([ctaBtns]);
  cta1Btns.setAttribute('data-animate', 'fade-up');

  const cta1A = cta1Btns.append(webflow.elementPresets.DOM);
  cta1A.setTag('a');
  cta1A.setStyles([ctaBtnLight]);
  cta1A.setTextContent('Get a Free Estimate');
  cta1A.setAttribute('href', 'https://www.avorino.com/schedule-a-meeting');
  cta1A.setAttribute('data-magnetic', '');

  const cta1B = cta1Btns.append(webflow.elementPresets.DOM);
  cta1B.setTag('a');
  cta1B.setStyles([ctaBtnLight]);
  cta1B.setTextContent('Learn About ADUs');
  cta1B.setAttribute('href', 'https://www.avorino.com/adu');
  cta1B.setAttribute('data-magnetic', '');

  await safeCall('append:cta1', () => body.append(cta1));
  logDetail('Section 4: CTA Banner appended', 'ok');

  // ════════════════════════════════════════════════
  // SECTION 5: VALUES
  // ════════════════════════════════════════════════
  log('Building Section 5: Values (snake zigzag layout)...');
  const vals = webflow.elementBuilder(webflow.elementPresets.DOM);
  vals.setTag('section');
  vals.setStyles([s.section, s.sectionDark]);
  vals.setAttribute('id', 'about-values');

  // Section label
  const valsLabelWrap = vals.append(webflow.elementPresets.DOM);
  valsLabelWrap.setTag('div');
  valsLabelWrap.setStyles([s.label, mb64]);
  valsLabelWrap.setAttribute('data-animate', 'fade-up');
  const valsLabelTxt = valsLabelWrap.append(webflow.elementPresets.DOM);
  valsLabelTxt.setTag('div');
  valsLabelTxt.setTextContent('Our Values');
  const valsLabelLine = valsLabelWrap.append(webflow.elementPresets.DOM);
  valsLabelLine.setTag('div');
  valsLabelLine.setStyles([labelLine]);

  // Section heading
  const valsH = vals.append(webflow.elementPresets.DOM);
  valsH.setTag('h2');
  valsH.setStyles([s.headingLG, mb96]);
  valsH.setTextContent('What We Stand For');
  valsH.setAttribute('data-animate', 'line-wipe');

  // Zigzag container
  const valsZigzagEl = vals.append(webflow.elementPresets.DOM);
  valsZigzagEl.setTag('div');
  valsZigzagEl.setStyles([valuesZigzag]);

  // Snake path anchor (SVG injected at runtime by footer JS)
  const valsSnakeAnchorEl = valsZigzagEl.append(webflow.elementPresets.DOM);
  valsSnakeAnchorEl.setTag('div');
  valsSnakeAnchorEl.setStyles([valuesSnakeAnchor]);
  valsSnakeAnchorEl.setAttribute('id', 'values-snake-anchor');

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
    const row = valsZigzagEl.append(webflow.elementPresets.DOM);
    row.setTag('div');
    row.setStyles([valuesRow]);
    row.setAttribute('data-values-row', String(i));

    if (isLeft) {
      // Card in left column
      const card = row.append(webflow.elementPresets.DOM);
      card.setTag('div');
      card.setStyles([valuesCard]);
      card.setAttribute('data-animate', 'snake-card-left');

      const num = card.append(webflow.elementPresets.DOM);
      num.setTag('div');
      num.setStyles([valueNumber]);
      num.setTextContent(String(i + 1).padStart(2, '0'));
      const title = card.append(webflow.elementPresets.DOM);
      title.setTag('h3');
      title.setStyles([valueTitle]);
      title.setTextContent(val.title);
      const desc = card.append(webflow.elementPresets.DOM);
      desc.setTag('p');
      desc.setStyles([valueDesc]);
      desc.setTextContent(val.desc);

      // Empty spacer in right column
      const spacer = row.append(webflow.elementPresets.DOM);
      spacer.setTag('div');
      spacer.setStyles([valuesSpacer]);
    } else {
      // Empty spacer in left column
      const spacer = row.append(webflow.elementPresets.DOM);
      spacer.setTag('div');
      spacer.setStyles([valuesSpacer]);

      // Card in right column
      const card = row.append(webflow.elementPresets.DOM);
      card.setTag('div');
      card.setStyles([valuesCard]);
      card.setAttribute('data-animate', 'snake-card-right');

      const num = card.append(webflow.elementPresets.DOM);
      num.setTag('div');
      num.setStyles([valueNumber]);
      num.setTextContent(String(i + 1).padStart(2, '0'));
      const title = card.append(webflow.elementPresets.DOM);
      title.setTag('h3');
      title.setStyles([valueTitle]);
      title.setTextContent(val.title);
      const desc = card.append(webflow.elementPresets.DOM);
      desc.setTag('p');
      desc.setStyles([valueDesc]);
      desc.setTextContent(val.desc);
    }
  });

  await safeCall('append:values', () => body.append(vals));
  logDetail('Section 5: Values carousel appended', 'ok');

  // ════════════════════════════════════════════════
  // SECTION 6: PROCESS (scroll-lock + Three.js)
  // ════════════════════════════════════════════════
  log('Building Section 6: Process (scroll-lock)...');
  const proc = webflow.elementBuilder(webflow.elementPresets.DOM);
  proc.setTag('section');
  proc.setStyles([s.section, s.sectionWarm]);
  proc.setAttribute('id', 'about-process');

  // Header (scrolls normally before pin)
  const procLabel = proc.append(webflow.elementPresets.DOM);
  procLabel.setTag('div');
  procLabel.setStyles([s.label, mb64]);
  procLabel.setAttribute('data-animate', 'fade-up');
  const procLabelTxt = procLabel.append(webflow.elementPresets.DOM);
  procLabelTxt.setTag('div');
  procLabelTxt.setTextContent('How We Work');
  const procLabelLine = procLabel.append(webflow.elementPresets.DOM);
  procLabelLine.setTag('div');
  procLabelLine.setStyles([labelLine]);

  const procH = proc.append(webflow.elementPresets.DOM);
  procH.setTag('h2');
  procH.setStyles([s.headingLG, mb96]);
  procH.setTextContent("Avorino's Process");
  procH.setAttribute('data-animate', 'line-wipe');

  // Pinned viewport (scroll-locked by ScrollTrigger)
  const procPinnedEl = proc.append(webflow.elementPresets.DOM);
  procPinnedEl.setTag('div');
  procPinnedEl.setStyles([processPinned]);
  procPinnedEl.setAttribute('data-process-pinned', '');

  // Left: Visual area (Three.js canvas + 2D overlay)
  const procVisualEl = procPinnedEl.append(webflow.elementPresets.DOM);
  procVisualEl.setTag('div');
  procVisualEl.setStyles([processVisual]);
  procVisualEl.setAttribute('data-process-visual', '');

  // 2D FX overlay (for blueprint, money rain, stamp)
  const procFxEl = procVisualEl.append(webflow.elementPresets.DOM);
  procFxEl.setTag('div');
  procFxEl.setStyles([processFx]);
  procFxEl.setAttribute('data-process-fx', '');

  // Right: Cards area
  const procCardsEl = procPinnedEl.append(webflow.elementPresets.DOM);
  procCardsEl.setTag('div');
  procCardsEl.setStyles([processCards]);
  procCardsEl.setAttribute('data-process-cards', '');

  const processData = [
    { step: 'Step 01', title: 'Pre-construction Consultation', desc: 'It is essential to plan ahead and setting project goals, identifying future challenges, and creating a solid foundation for a successful construction project.' },
    { step: 'Step 02', title: 'Architectural & Structural Design', desc: 'Our engineers and architects will work with you to understand your vision and will design a unique project based on your needs and preferences.' },
    { step: 'Step 03', title: 'Financing', desc: 'Our financing partners offer up to 100% financing of your project with up to 30-year terms with the option to re-finance.' },
    { step: 'Step 04', title: 'Permitting', desc: 'Permits are crucial for almost all construction projects, ensuring compliance, safety, and legal authorization for the work to proceed successfully.' },
    { step: 'Step 05', title: 'Construction', desc: 'The construction phase is the heart of any project. It brings plans to life, involving skilled professionals executing with quality, coordination, and adherence to timelines.' },
    { step: 'Step 06', title: 'Post-construction Relationship', desc: 'At Avorino, we value long-lasting client relationships over one-time transactions. We are committed to nurturing and maintaining these connections.' },
  ];

  processData.forEach((item, idx) => {
    const card = procCardsEl.append(webflow.elementPresets.DOM);
    card.setTag('div');
    card.setStyles([processCard]);
    card.setAttribute('data-process-card', String(idx));

    const num = card.append(webflow.elementPresets.DOM);
    num.setTag('div');
    num.setStyles([processCardNum]);
    num.setTextContent(item.step);

    const title = card.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setStyles([processCardTitle]);
    title.setTextContent(item.title);

    const desc = card.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setStyles([processCardDesc]);
    desc.setTextContent(item.desc);
  });

  // Bottom nav (step counter + progress dots)
  const procNavEl = procPinnedEl.append(webflow.elementPresets.DOM);
  procNavEl.setTag('div');
  procNavEl.setStyles([processNav]);
  procNavEl.setAttribute('data-process-nav', '');

  await safeCall('append:process', () => body.append(proc));
  logDetail('Section 6: Process scroll-lock appended', 'ok');

  // ════════════════════════════════════════════════
  // SECTION 7: COMMUNICATION
  // ════════════════════════════════════════════════
  log('Building Section 7: Communication...');
  const comm = webflow.elementBuilder(webflow.elementPresets.DOM);
  comm.setTag('section');
  comm.setStyles([commSection]);
  comm.setAttribute('id', 'about-communication');

  const commG = comm.append(webflow.elementPresets.DOM);
  commG.setTag('div');
  commG.setStyles([commGrid]);

  const commLeft = commG.append(webflow.elementPresets.DOM);
  commLeft.setTag('div');

  const commH = commLeft.append(webflow.elementPresets.DOM);
  commH.setTag('h2');
  commH.setStyles([s.headingLG, commHeadingWrap]);
  commH.setTextContent('Effective Communication');
  commH.setAttribute('data-animate', 'split-text-reveal');

  const commP = commLeft.append(webflow.elementPresets.DOM);
  commP.setTag('p');
  commP.setStyles([cardBody]);
  commP.setTextContent('Effective communication is of paramount importance when collaborating with a construction company, and Avorino is dedicated to prioritizing this crucial aspect. With Avorino, clients can expect a company that places great emphasis on maintaining clear and open lines of communication throughout the entire project. By fostering a culture of attentive listening and proactive dialogue, Avorino strives to build strong working relationships with their clients.');
  commP.setAttribute('data-animate', 'fade-up');

  const commRight = commG.append(webflow.elementPresets.DOM);
  commRight.setTag('div');

  const commImg = commRight.append(webflow.elementPresets.DOM);
  commImg.setTag('div');
  commImg.setStyles([commImgPlaceholder]);
  commImg.setAttribute('data-animate', 'parallax-depth');

  await safeCall('append:communication', () => body.append(comm));
  logDetail('Section 7: Communication appended', 'ok');

  // ════════════════════════════════════════════════
  // SECTION 8: ADU ESTIMATOR
  // ════════════════════════════════════════════════
  log('Building Section 8: ADU Estimator...');
  const adu = webflow.elementBuilder(webflow.elementPresets.DOM);
  adu.setTag('section');
  adu.setStyles([s.section, s.sectionWarm]);
  adu.setAttribute('id', 'about-adu');

  const aduC = adu.append(webflow.elementPresets.DOM);
  aduC.setTag('div');
  aduC.setStyles([aduCard]);

  const aduH = aduC.append(webflow.elementPresets.DOM);
  aduH.setTag('h2');
  aduH.setStyles([s.headingLG, commHeadingWrap]);
  aduH.setTextContent('Get Estimated ADU Cost in Minutes');
  aduH.setAttribute('data-animate', 'word-stagger-elastic');

  const aduP = aduC.append(webflow.elementPresets.DOM);
  aduP.setTag('p');
  aduP.setStyles([cardBody]);
  aduP.setTextContent('Your trusted partner to plan and budget for ADU construction. Get detailed estimates, understand costs, and make informed decisions with Avorino.');
  aduP.setAttribute('data-animate', 'fade-up');

  const aduBtnWrap = aduC.append(webflow.elementPresets.DOM);
  aduBtnWrap.setTag('div');
  aduBtnWrap.setStyles([ctaBtns]);
  aduBtnWrap.setAttribute('data-animate', 'fade-up');

  const aduBtn = aduBtnWrap.append(webflow.elementPresets.DOM);
  aduBtn.setTag('a');
  aduBtn.setStyles([ctaBtnLight]);
  aduBtn.setTextContent('Calculate Your Estimate');
  aduBtn.setAttribute('href', 'https://www.avorino.com/adu-cost-estimator');
  aduBtn.setAttribute('data-magnetic', '');

  await safeCall('append:adu', () => body.append(adu));
  logDetail('Section 8: ADU Estimator appended', 'ok');

  // ════════════════════════════════════════════════
  // SECTION 9: FOOTER CTA (same as section 4)
  // ════════════════════════════════════════════════
  log('Building Section 9: Footer CTA...');
  const cta2 = webflow.elementBuilder(webflow.elementPresets.DOM);
  cta2.setTag('section');
  cta2.setStyles([ctaSection]);

  const cta2C = cta2.append(webflow.elementPresets.DOM);
  cta2C.setTag('div');
  cta2C.setStyles([ctaContainer]);

  const cta2H = cta2C.append(webflow.elementPresets.DOM);
  cta2H.setTag('h2');
  cta2H.setStyles([ctaHeading]);
  cta2H.setTextContent('Create your dream home');
  cta2H.setAttribute('data-animate', 'word-stagger-elastic');

  const cta2Sub = cta2C.append(webflow.elementPresets.DOM);
  cta2Sub.setTag('p');
  cta2Sub.setStyles([cardBody]);
  cta2Sub.setTextContent('Tell us about your project today.');
  cta2Sub.setAttribute('data-animate', 'fade-up');

  const cta2Btns = cta2C.append(webflow.elementPresets.DOM);
  cta2Btns.setTag('div');
  cta2Btns.setStyles([ctaBtns]);
  cta2Btns.setAttribute('data-animate', 'fade-up');

  const cta2A = cta2Btns.append(webflow.elementPresets.DOM);
  cta2A.setTag('a');
  cta2A.setStyles([ctaBtnLight]);
  cta2A.setTextContent('Get a Free Estimate');
  cta2A.setAttribute('href', 'https://www.avorino.com/schedule-a-meeting');
  cta2A.setAttribute('data-magnetic', '');

  const cta2B = cta2Btns.append(webflow.elementPresets.DOM);
  cta2B.setTag('a');
  cta2B.setStyles([ctaBtnLight]);
  cta2B.setTextContent('Learn About ADUs');
  cta2B.setAttribute('href', 'https://www.avorino.com/adu');
  cta2B.setAttribute('data-magnetic', '');

  await safeCall('append:cta2', () => body.append(cta2));
  logDetail('Section 9: Footer CTA appended', 'ok');

  // ════════════════════════════════════════════════
  // APPLY STYLE PROPERTIES (after all elements exist on page)
  // ════════════════════════════════════════════════
  await applyStyleProperties();

  // ════════════════════════════════════════════════
  // DONE — Manual steps needed for custom code
  // ════════════════════════════════════════════════
  // NOTE: The Designer Extension API does NOT support:
  //   - HtmlEmbed.setCode() / setHTML()
  //   - page.setHeadCode() / setFooterCode()
  // Custom code and responsive CSS must be added manually.

  log('About page built! Add custom code manually (see instructions below).', 'success');
  await webflow.notify({ type: 'Success', message: 'About page created! Now add custom code manually — see extension panel.' });
}

// ════════════════════════════════════════════════════════════════
// EVENT LISTENERS
// ════════════════════════════════════════════════════════════════

// Copy buttons for custom code instructions
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = (btn as HTMLElement).dataset.copy;
    let text = '';
    if (type === 'head') {
      text = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@COMMIT/avorino-about-head.css">';
    } else if (type === 'footer') {
      text = [
        '<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>',
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>',
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>',
        '<script src="https://cdn.jsdelivr.net/gh/Rejhinald/avorino@COMMIT/avorino-about-footer.js"><\/script>',
      ].join('\n');
    }
    navigator.clipboard.writeText(text).then(() => {
      (btn as HTMLElement).textContent = 'Copied!';
      setTimeout(() => { (btn as HTMLElement).textContent = 'Copy'; }, 2000);
    });
  });
});

document.getElementById('build-about')?.addEventListener('click', async () => {
  const btn = document.getElementById('build-about') as HTMLButtonElement;
  btn.disabled = true;
  try {
    await buildAboutPage();
  } catch (err: any) {
    log(`Error: ${err.message || err}`, 'error');
    await webflow.notify({ type: 'Error', message: `Failed: ${err.message || err}` });
  } finally {
    btn.disabled = false;
  }
});

