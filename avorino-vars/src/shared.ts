// ════════════════════════════════════════════════════════════════
// Avorino Builder — Shared Helpers
// Imported by each page builder (index-about.ts, index-services.ts, etc.)
// ════════════════════════════════════════════════════════════════

export const webflow = (globalThis as any).webflow;

// ── DOM refs ──
const statusEl = document.getElementById('status') as HTMLDivElement;
const errorLogEl = document.getElementById('error-log') as HTMLDivElement;

export function log(msg: string, type: 'info' | 'success' | 'error' = 'info') {
  statusEl.textContent = msg;
  statusEl.className = type;
}

export function logDetail(msg: string, type: 'err' | 'ok' | 'info' = 'info') {
  const line = document.createElement('div');
  line.className = `${type}-line`;
  line.textContent = msg;
  errorLogEl.appendChild(line);
  errorLogEl.scrollTop = errorLogEl.scrollHeight;
}

export function clearErrorLog() {
  errorLogEl.innerHTML = '';
}

// ── Timing ──
export const wait = (ms: number) => new Promise(r => setTimeout(r, ms));
export const API_DELAY = 150;

// ── Safe API call wrapper: delay + retry + error logging ──
export async function safeCall<T>(label: string, fn: () => Promise<T>, retries = 2): Promise<T> {
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      await wait(API_DELAY);
      const result = await fn();
      return result;
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (attempt <= retries) {
        logDetail(`RETRY ${attempt}/${retries}: ${label} — ${msg}`, 'err');
        await wait(API_DELAY * 3);
      } else {
        logDetail(`FAILED: ${label} — ${msg}`, 'err');
        throw err;
      }
    }
  }
  throw new Error(`Unreachable: ${label}`);
}

// ── Variables ──
export const EXPECTED_VARS = [
  'av-dark', 'av-cream', 'av-warm', 'av-red',
  'av-text-dark', 'av-text-light',
  'av-dark-06', 'av-dark-10', 'av-dark-15',
  'av-cream-06', 'av-cream-40', 'av-teal', 'av-brown',
  'av-font-display', 'av-font-body',
  'av-section-pad-y', 'av-section-pad-x', 'av-page-pad',
  'av-gap-xl', 'av-gap-lg', 'av-gap-md', 'av-gap-sm', 'av-gap-xs',
  'av-radius', 'av-radius-pill',
  'av-text-h1', 'av-text-h2', 'av-text-h3',
  'av-text-body', 'av-text-sm', 'av-text-label', 'av-text-xs',
  'av-btn-pad-y', 'av-btn-pad-x',
];

export async function getAvorinVars() {
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

  const loadedNames = Object.keys(vars);
  logDetail(`Loaded ${loadedNames.length} variables: ${loadedNames.join(', ')}`, 'info');

  const missing = EXPECTED_VARS.filter(n => !vars[n]);
  if (missing.length > 0) {
    logDetail(`MISSING ${missing.length} variables: ${missing.join(', ')}`, 'err');
  } else {
    logDetail('All expected variables found', 'ok');
  }

  return vars;
}

// ── Style helpers ──
export async function getOrCreateStyle(name: string): Promise<any> {
  return safeCall(`style:${name}`, async () => {
    const existing = await webflow.getStyleByName(name);
    if (existing) return existing;
    return webflow.createStyle(name);
  });
}

export async function setProps(style: any, name: string, props: Record<string, any>): Promise<void> {
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

export async function freshStyle(name: string): Promise<any> {
  const style = await webflow.getStyleByName(name);
  if (!style) throw new Error(`Style "${name}" not found`);
  return style;
}

export async function clearAndSet(style: any, name: string, props: Record<string, any>): Promise<void> {
  try {
    await style.removeAllProperties();
    await wait(200);
  } catch (err: any) {
    logDetail(`WARN clear ${name}: ${err?.message || err}`, 'err');
  }
  await setProps(style, name, props);
}

export async function clearAndSetBatch(style: any, name: string, props: Record<string, any>): Promise<void> {
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

// ── Shared styles (reused across all pages) ──
export async function createSharedStyles() {
  const styles: Record<string, any> = {};

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

  Object.assign(styles, {
    section, body, headingXL, headingLG, headingMD, label,
    grid2, grid3, cardDark, cardLight,
    btnPrimary, btnSecondary,
    flexCol, flexCenter, flexWrap,
    sectionWarm, sectionDark, sectionCream, bodyMuted,
  });

  return styles;
}

export async function setSharedStyleProps(styles: Record<string, any>, v: Record<string, any>) {
  log('Setting shared style properties...');

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
  await clearAndSet(await freshStyle('av-section-cream'), 'av-section-cream', {
    'padding-top': v['av-section-pad-y'], 'padding-bottom': v['av-section-pad-y'],
    'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
    'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    'background-color': v['av-cream'], 'color': v['av-dark'],
  });
  await wait(500);

  logDetail('Setting text style props...', 'info');
  await clearAndSet(await freshStyle('av-body'), 'av-body', {
    'font-family': 'DM Sans', 'font-size': v['av-text-body'],
    'line-height': '1.9', 'font-weight': '400',
    'margin-top': '0px', 'margin-bottom': '0px', 'color': 'inherit',
  });
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
  await clearAndSet(await freshStyle('av-grid-3col'), 'av-grid-3col', {
    'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr',
    'grid-column-gap': '32px', 'grid-row-gap': '32px',
  });
  await wait(500);

  logDetail('Setting card style props...', 'info');
  await clearAndSet(await freshStyle('av-card-dark'), 'av-card-dark', {
    'background-color': v['av-dark'], 'color': v['av-cream'],
    'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
    'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
    'padding-top': v['av-gap-md'], 'padding-bottom': v['av-gap-md'],
    'padding-left': v['av-gap-md'], 'padding-right': v['av-gap-md'],
  });
  await clearAndSet(await freshStyle('av-card-light'), 'av-card-light', {
    'background-color': v['av-cream'], 'color': v['av-dark'],
    'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
    'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
    'padding-top': v['av-gap-md'], 'padding-bottom': v['av-gap-md'],
    'padding-left': v['av-gap-md'], 'padding-right': v['av-gap-md'],
  });
  await wait(500);

  logDetail('Setting button style props...', 'info');
  await clearAndSet(await freshStyle('av-btn-primary'), 'av-btn-primary', {
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
  await clearAndSet(await freshStyle('av-btn-outline'), 'av-btn-outline', {
    'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
    'font-weight': '500', 'letter-spacing': '0.04em',
    'display': 'inline-flex', 'align-items': 'center', 'grid-column-gap': '12px',
    'color': v['av-cream'], 'background-color': 'transparent',
    'border-top-width': '1px', 'border-bottom-width': '1px',
    'border-left-width': '1px', 'border-right-width': '1px',
    'border-top-style': 'solid', 'border-bottom-style': 'solid',
    'border-left-style': 'solid', 'border-right-style': 'solid',
    'border-top-color': v['av-cream-40'], 'border-bottom-color': v['av-cream-40'],
    'border-left-color': v['av-cream-40'], 'border-right-color': v['av-cream-40'],
    'padding-top': v['av-btn-pad-y'], 'padding-bottom': v['av-btn-pad-y'],
    'padding-left': v['av-btn-pad-x'], 'padding-right': v['av-btn-pad-x'],
    'border-top-left-radius': v['av-radius-pill'], 'border-top-right-radius': v['av-radius-pill'],
    'border-bottom-left-radius': v['av-radius-pill'], 'border-bottom-right-radius': v['av-radius-pill'],
    'text-decoration': 'none',
  });
  await wait(500);

  logDetail('Shared style properties set', 'ok');
}

// ── Variables injector ──
export async function createAllVariables() {
  log('Creating variable collection...');
  const col = await webflow.createVariableCollection('Avorino');
  if (!col) throw new Error('Failed to create collection');

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

  await col.createFontFamilyVariable('av-font-display', 'DM Serif Display');
  await col.createFontFamilyVariable('av-font-body',    'DM Sans');

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
}

// ── Page creation helpers ──
export async function createPageWithSlug(pageName: string, slug: string, title: string, description: string) {
  log(`Creating ${pageName} page...`);

  const allItems: any[] = await safeCall('getAllPagesAndFolders', () => webflow.getAllPagesAndFolders());
  for (const item of allItems) {
    try {
      const name = await (item as any).getName();
      if (name === pageName) {
        throw new Error(`${pageName} page already exists! Delete it in the Pages panel first, then try again.`);
      }
    } catch (e: any) {
      if (e.message?.includes('already exists')) throw e;
    }
  }

  const page: any = await safeCall('createPage', () => webflow.createPage());
  await safeCall('setName', () => page.setName(pageName));
  await safeCall('setSlug', () => page.setSlug(slug));
  logDetail(`Created new ${pageName} page`, 'ok');

  await safeCall('setTitle', () => page.setTitle(title));
  await safeCall('setDescription', () => page.setDescription(description));
  logDetail('Set page title & description', 'ok');

  await safeCall('switchPage', () => webflow.switchPage(page));
  logDetail(`Switched to ${pageName} page`, 'ok');

  const allElements: any[] = await safeCall('getAllElements', () => webflow.getAllElements());
  const body = allElements[0];
  logDetail(`Got body element (${allElements.length} elements on page)`, 'ok');

  return { page, body };
}

// ── Reusable CTA section builder (v7 landing page style) ──
export async function buildCTASection(
  body: any,
  v: Record<string, any>,
  heading: string,
  btnText: string,
  btnHref: string,
  btn2Text?: string,
  btn2Href?: string,
) {
  const ctaSection = await getOrCreateStyle('av-cta');
  const ctaContainer = await getOrCreateStyle('av-cta-container');
  const ctaHeading = await getOrCreateStyle('av-cta-heading');
  const ctaBtn = await getOrCreateStyle('av-cta-btn');
  const ctaBtns = await getOrCreateStyle('av-cta-btns');

  const cta = webflow.elementBuilder(webflow.elementPresets.DOM);
  cta.setTag('section');
  cta.setStyles([ctaSection]);

  const ctaC = cta.append(webflow.elementPresets.DOM);
  ctaC.setTag('div');
  ctaC.setStyles([ctaContainer]);

  const ctaH = ctaC.append(webflow.elementPresets.DOM);
  ctaH.setTag('h2');
  ctaH.setStyles([ctaHeading]);
  ctaH.setTextContent(heading);
  ctaH.setAttribute('data-animate', 'word-stagger-elastic');

  const btnsWrap = ctaC.append(webflow.elementPresets.DOM);
  btnsWrap.setTag('div');
  btnsWrap.setStyles([ctaBtns]);
  btnsWrap.setAttribute('data-animate', 'fade-up');

  const a1 = btnsWrap.append(webflow.elementPresets.DOM);
  a1.setTag('a');
  a1.setStyles([ctaBtn]);
  a1.setTextContent(btnText);
  a1.setAttribute('href', btnHref);
  a1.setAttribute('data-magnetic', '');

  if (btn2Text && btn2Href) {
    const a2 = btnsWrap.append(webflow.elementPresets.DOM);
    a2.setTag('a');
    a2.setStyles([ctaBtn]);
    a2.setTextContent(btn2Text);
    a2.setAttribute('href', btn2Href);
    a2.setAttribute('data-magnetic', '');
  }

  await safeCall('append:cta', () => body.append(cta));
  logDetail('CTA section appended', 'ok');
}

// ── Apply CTA style properties ──
export async function applyCTAStyleProps(v: Record<string, any>) {
  await clearAndSet(await freshStyle('av-cta'), 'av-cta', {
    'padding-top': v['av-page-pad'], 'padding-bottom': v['av-page-pad'],
    'padding-left': v['av-page-pad'], 'padding-right': v['av-page-pad'],
  });
  await clearAndSet(await freshStyle('av-cta-container'), 'av-cta-container', {
    'background-color': v['av-dark'], 'color': v['av-cream'],
    'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
    'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
    'min-height': '56vh',
    'padding-top': v['av-gap-lg'], 'padding-bottom': v['av-gap-lg'],
    'padding-left': v['av-gap-md'], 'padding-right': v['av-gap-md'],
    'display': 'flex', 'flex-direction': 'column', 'align-items': 'center', 'justify-content': 'center',
    'text-align': 'center', 'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
  });
  await clearAndSet(await freshStyle('av-cta-heading'), 'av-cta-heading', {
    'font-family': 'DM Serif Display', 'font-size': v['av-text-h2'],
    'line-height': '1.08', 'letter-spacing': '-0.02em', 'font-weight': '400',
    'margin-bottom': v['av-gap-sm'], 'max-width': '12em', 'color': v['av-cream'],
  });
  await clearAndSet(await freshStyle('av-cta-btn'), 'av-cta-btn', {
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
  await clearAndSet(await freshStyle('av-cta-btns'), 'av-cta-btns', {
    'display': 'flex', 'grid-column-gap': '16px', 'grid-row-gap': '16px',
    'flex-wrap': 'wrap', 'justify-content': 'center', 'margin-top': '16px',
  });
}

// ════════════════════════════════════════════════════════════════
// City ADU Page — Shared Builder
// Each index-city-*.ts passes unique CityData to this function.
// ════════════════════════════════════════════════════════════════

export interface CityRegulations {
  setbacks: string;
  height: string;
  parking: string;
  lotSize: string;
  ownerOccupancy: string;
  additionalNotes?: string;
}

export interface CityPermitting {
  department: string;
  steps: { title: string; desc: string }[];
  fees: string;
  timeline: string;
  contact?: string;
  website?: string;
}

export interface CityCosts {
  constructionRange: string;
  permitFees: string;
  impactFees: string;
  typicalSize: string;
}

export interface CityRental {
  monthlyRange: string;
  demandDrivers: string;
}

export interface CityData {
  slug: string;
  city: string;
  title: string;
  seoDesc: string;
  overview: string;
  whyBuild: string;
  regulations: CityRegulations;
  permitting: CityPermitting;
  costs: CityCosts;
  rental: CityRental;
  guide: { title: string; desc: string }[];
}

export async function buildCityPage(data: CityData) {
  const v = await getAvorinVars();
  logDetail('Loaded Avorino variable collection', 'ok');

  log('Creating shared styles...');
  const s = await createSharedStyles();

  // ── City page styles (shared across all city pages, prefix: cy-) ──
  log('Creating city page styles...');
  const cyHero = await getOrCreateStyle('cy-hero');
  const cyHeroContent = await getOrCreateStyle('cy-hero-content');
  const cyHeroSub = await getOrCreateStyle('cy-hero-subtitle');
  const cyOverviewText = await getOrCreateStyle('cy-overview-text');
  const cyRegsGrid = await getOrCreateStyle('cy-regs-grid');
  const cyRegCard = await getOrCreateStyle('cy-reg-card');
  const cyRegLabel = await getOrCreateStyle('cy-reg-label');
  const cyRegValue = await getOrCreateStyle('cy-reg-value');
  const cyGuideGrid = await getOrCreateStyle('cy-guide-grid');
  const cyGuideStep = await getOrCreateStyle('cy-guide-step');
  const cyGuideStepNum = await getOrCreateStyle('cy-guide-step-num');
  const cyGuideStepTitle = await getOrCreateStyle('cy-guide-step-title');
  const cyGuideStepDesc = await getOrCreateStyle('cy-guide-step-desc');
  const cyInfoGrid = await getOrCreateStyle('cy-info-grid');
  const cyInfoCard = await getOrCreateStyle('cy-info-card');
  const cyInfoLabel = await getOrCreateStyle('cy-info-label');
  const cyInfoValue = await getOrCreateStyle('cy-info-value');
  const cyStatsGrid = await getOrCreateStyle('cy-stats-grid');
  const cyStatItem = await getOrCreateStyle('cy-stat-item');
  const cyStatNum = await getOrCreateStyle('cy-stat-num');
  const cyStatLabel = await getOrCreateStyle('cy-stat-label');
  const cyPermitCard = await getOrCreateStyle('cy-permit-card');
  const cyPermitRow = await getOrCreateStyle('cy-permit-row');
  const cyMb16 = await getOrCreateStyle('cy-mb-16');
  const cyMb32 = await getOrCreateStyle('cy-mb-32');
  const cyMb64 = await getOrCreateStyle('cy-mb-64');
  const cyLabelLine = await getOrCreateStyle('cy-label-line');
  const cyMaxW = await getOrCreateStyle('cy-max-w');

  // ── Create page ──
  const { body } = await createPageWithSlug(
    `${data.city} ADU`, data.slug, data.title, data.seoDesc,
  );

  // ── Style properties ──
  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    await wait(1000);

    log('Setting city page style properties...');

    // Hero
    await clearAndSet(await freshStyle('cy-hero'), 'cy-hero', {
      'min-height': '55vh', 'display': 'flex', 'align-items': 'flex-end',
      'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('cy-hero-content'), 'cy-hero-content', {
      'position': 'relative', 'z-index': '2', 'max-width': '800px',
    });
    await clearAndSet(await freshStyle('cy-hero-subtitle'), 'cy-hero-subtitle', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0.6', 'margin-top': '24px', 'color': v['av-cream'],
    });
    await wait(500);

    // Overview text
    await clearAndSet(await freshStyle('cy-overview-text'), 'cy-overview-text', {
      'max-width': '720px',
    });
    await wait(200);

    // Regulations grid (3-col cards)
    await clearAndSet(await freshStyle('cy-regs-grid'), 'cy-regs-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr',
      'grid-column-gap': '24px', 'grid-row-gap': '24px',
    });
    await clearAndSet(await freshStyle('cy-reg-card'), 'cy-reg-card', {
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'padding-top': '40px', 'padding-bottom': '40px',
      'padding-left': '36px', 'padding-right': '36px',
    });
    await clearAndSet(await freshStyle('cy-reg-label'), 'cy-reg-label', {
      'font-family': 'DM Sans', 'font-size': v['av-text-label'],
      'letter-spacing': '0.3em', 'text-transform': 'uppercase',
      'opacity': '0.4', 'margin-bottom': '12px',
    });
    await clearAndSet(await freshStyle('cy-reg-value'), 'cy-reg-value', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.7', 'color': v['av-cream'],
    });
    await wait(500);

    // Guide steps
    await clearAndSet(await freshStyle('cy-guide-grid'), 'cy-guide-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr',
      'grid-column-gap': '32px', 'grid-row-gap': '32px',
    });
    await clearAndSet(await freshStyle('cy-guide-step'), 'cy-guide-step', {
      'display': 'flex', 'flex-direction': 'column',
    });
    await clearAndSet(await freshStyle('cy-guide-step-num'), 'cy-guide-step-num', {
      'font-family': 'DM Sans', 'font-size': v['av-text-label'],
      'letter-spacing': '0.3em', 'text-transform': 'uppercase',
      'opacity': '0.3', 'margin-bottom': '24px',
    });
    await clearAndSet(await freshStyle('cy-guide-step-title'), 'cy-guide-step-title', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
      'line-height': '1.12', 'font-weight': '400', 'margin-bottom': '16px',
    });
    await clearAndSet(await freshStyle('cy-guide-step-desc'), 'cy-guide-step-desc', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0.6',
    });
    await wait(500);

    // Info grid (2-col: permit details + costs)
    await clearAndSet(await freshStyle('cy-info-grid'), 'cy-info-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr',
      'grid-column-gap': '24px', 'grid-row-gap': '24px',
    });
    await clearAndSet(await freshStyle('cy-info-card'), 'cy-info-card', {
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'padding-top': v['av-gap-md'], 'padding-bottom': v['av-gap-md'],
      'padding-left': '48px', 'padding-right': '48px',
      'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '32px',
    });
    await clearAndSet(await freshStyle('cy-info-label'), 'cy-info-label', {
      'font-family': 'DM Sans', 'font-size': v['av-text-label'],
      'letter-spacing': '0.3em', 'text-transform': 'uppercase', 'opacity': '0.4',
      'margin-bottom': '8px',
    });
    await clearAndSet(await freshStyle('cy-info-value'), 'cy-info-value', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.7', 'color': v['av-cream'],
    });
    await wait(500);

    // Stats row (3-col: cost, rental, size)
    await clearAndSet(await freshStyle('cy-stats-grid'), 'cy-stats-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr',
      'grid-column-gap': '64px', 'grid-row-gap': '64px', 'text-align': 'center',
    });
    await clearAndSet(await freshStyle('cy-stat-item'), 'cy-stat-item', {
      'display': 'flex', 'flex-direction': 'column', 'align-items': 'center', 'grid-row-gap': '24px',
    });
    await clearAndSet(await freshStyle('cy-stat-num'), 'cy-stat-num', {
      'font-family': 'DM Serif Display',
      'font-size': 'clamp(32px, 4vw, 56px)',
      'line-height': '1', 'letter-spacing': '-0.03em', 'font-weight': '400',
      'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('cy-stat-label'), 'cy-stat-label', {
      'font-family': 'DM Sans', 'font-size': v['av-text-label'],
      'letter-spacing': '0.25em', 'text-transform': 'uppercase',
      'opacity': '0.4', 'color': v['av-cream'],
    });
    await wait(500);

    // Permit card
    await clearAndSet(await freshStyle('cy-permit-card'), 'cy-permit-card', {
      'background-color': v['av-cream'], 'color': v['av-dark'],
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'padding-top': '40px', 'padding-bottom': '40px',
      'padding-left': '48px', 'padding-right': '48px',
      'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '16px',
    });
    await clearAndSet(await freshStyle('cy-permit-row'), 'cy-permit-row', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'line-height': '1.7', 'opacity': '0.7',
    });
    await wait(500);

    // Utility
    await clearAndSet(await freshStyle('cy-mb-16'), 'cy-mb-16', { 'margin-bottom': '16px' });
    await clearAndSet(await freshStyle('cy-mb-32'), 'cy-mb-32', { 'margin-bottom': v['av-gap-sm'] });
    await clearAndSet(await freshStyle('cy-mb-64'), 'cy-mb-64', { 'margin-bottom': v['av-gap-md'] });
    await clearAndSet(await freshStyle('cy-label-line'), 'cy-label-line', { 'flex-grow': '1', 'height': '1px', 'background-color': v['av-dark-15'] });
    await clearAndSet(await freshStyle('cy-max-w'), 'cy-max-w', { 'max-width': '720px' });

    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: HERO
  log('Building Section 1: Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([cyHero]);
  hero.setAttribute('id', 'cy-hero');

  const heroC = hero.append(webflow.elementPresets.DOM);
  heroC.setTag('div');
  heroC.setStyles([cyHeroContent]);

  const heroLabel = heroC.append(webflow.elementPresets.DOM);
  heroLabel.setTag('div');
  heroLabel.setStyles([s.label]);
  heroLabel.setAttribute('data-animate', 'fade-up');
  const heroLabelTxt = heroLabel.append(webflow.elementPresets.DOM);
  heroLabelTxt.setTag('div');
  heroLabelTxt.setTextContent(`// ${data.city}`);

  const heroH = heroC.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setStyles([s.headingXL]);
  heroH.setTextContent(`ADU Construction in ${data.city}`);
  heroH.setAttribute('data-animate', 'opacity-sweep');

  const heroSub = heroC.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setStyles([cyHeroSub]);
  heroSub.setTextContent(data.whyBuild);
  heroSub.setAttribute('data-animate', 'fade-up');

  await safeCall('append:hero', () => body.append(hero));

  // SECTION 2: CITY OVERVIEW (warm bg)
  log('Building Section 2: Overview...');
  const overSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  overSection.setTag('section');
  overSection.setStyles([s.section, s.sectionWarm]);
  overSection.setAttribute('id', 'cy-overview');

  const overHeader = overSection.append(webflow.elementPresets.DOM);
  overHeader.setTag('div');
  overHeader.setStyles([cyMb64]);
  const overLabel = overHeader.append(webflow.elementPresets.DOM);
  overLabel.setTag('div');
  overLabel.setStyles([s.label, cyMb32]);
  overLabel.setAttribute('data-animate', 'fade-up');
  const overLabelTxt = overLabel.append(webflow.elementPresets.DOM);
  overLabelTxt.setTag('div');
  overLabelTxt.setTextContent(`${data.city} Overview`);
  const overLabelLine = overLabel.append(webflow.elementPresets.DOM);
  overLabelLine.setTag('div');
  overLabelLine.setStyles([cyLabelLine]);

  const overP = overSection.append(webflow.elementPresets.DOM);
  overP.setTag('p');
  overP.setStyles([s.body, s.bodyMuted, cyOverviewText]);
  overP.setTextContent(data.overview);
  overP.setAttribute('data-animate', 'fade-up');

  await safeCall('append:overview', () => body.append(overSection));

  // SECTION 3: ADU REGULATIONS (cream bg, card grid)
  log('Building Section 3: Regulations...');
  const regsSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  regsSection.setTag('section');
  regsSection.setStyles([s.section, s.sectionCream]);
  regsSection.setAttribute('id', 'cy-regulations');

  const regsHeader = regsSection.append(webflow.elementPresets.DOM);
  regsHeader.setTag('div');
  regsHeader.setStyles([cyMb64]);
  const regsLabel = regsHeader.append(webflow.elementPresets.DOM);
  regsLabel.setTag('div');
  regsLabel.setStyles([s.label, cyMb32]);
  regsLabel.setAttribute('data-animate', 'fade-up');
  const regsLabelTxt = regsLabel.append(webflow.elementPresets.DOM);
  regsLabelTxt.setTag('div');
  regsLabelTxt.setTextContent(`${data.city} ADU Regulations`);
  const regsLabelLine = regsLabel.append(webflow.elementPresets.DOM);
  regsLabelLine.setTag('div');
  regsLabelLine.setStyles([cyLabelLine]);

  const regsH = regsHeader.append(webflow.elementPresets.DOM);
  regsH.setTag('h2');
  regsH.setStyles([s.headingXL]);
  regsH.setTextContent('Zoning & requirements');
  regsH.setAttribute('data-animate', 'blur-focus');

  const regsGrid = regsSection.append(webflow.elementPresets.DOM);
  regsGrid.setTag('div');
  regsGrid.setStyles([cyRegsGrid]);
  regsGrid.setAttribute('data-animate', 'fade-up-stagger');

  const regItems = [
    { label: 'Setbacks', value: data.regulations.setbacks },
    { label: 'Height Limits', value: data.regulations.height },
    { label: 'Parking', value: data.regulations.parking },
    { label: 'Lot Size Range', value: data.regulations.lotSize },
    { label: 'Owner Occupancy', value: data.regulations.ownerOccupancy },
  ];
  if (data.regulations.additionalNotes) {
    regItems.push({ label: 'Additional Notes', value: data.regulations.additionalNotes });
  }

  regItems.forEach(reg => {
    const card = regsGrid.append(webflow.elementPresets.DOM);
    card.setTag('div');
    card.setStyles([cyRegCard]);
    card.setAttribute('data-animate', 'fade-up');

    const lbl = card.append(webflow.elementPresets.DOM);
    lbl.setTag('div');
    lbl.setStyles([cyRegLabel]);
    lbl.setTextContent(reg.label);

    const val = card.append(webflow.elementPresets.DOM);
    val.setTag('div');
    val.setStyles([cyRegValue]);
    val.setTextContent(reg.value);
  });

  await safeCall('append:regulations', () => body.append(regsSection));

  // SECTION 4: PERMITTING GUIDE (warm bg, steps + permit details)
  log('Building Section 4: Permitting Guide...');
  const permitSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  permitSection.setTag('section');
  permitSection.setStyles([s.section, s.sectionWarm]);
  permitSection.setAttribute('id', 'cy-permitting');

  const permitHeader = permitSection.append(webflow.elementPresets.DOM);
  permitHeader.setTag('div');
  permitHeader.setStyles([cyMb64]);
  const permitLabel = permitHeader.append(webflow.elementPresets.DOM);
  permitLabel.setTag('div');
  permitLabel.setStyles([s.label, cyMb32]);
  permitLabel.setAttribute('data-animate', 'fade-up');
  const permitLabelTxt = permitLabel.append(webflow.elementPresets.DOM);
  permitLabelTxt.setTag('div');
  permitLabelTxt.setTextContent('Permitting Guide');
  const permitLabelLine = permitLabel.append(webflow.elementPresets.DOM);
  permitLabelLine.setTag('div');
  permitLabelLine.setStyles([cyLabelLine]);

  const permitH = permitHeader.append(webflow.elementPresets.DOM);
  permitH.setTag('h2');
  permitH.setStyles([s.headingXL]);
  permitH.setTextContent(`How to permit your ADU in ${data.city}`);
  permitH.setAttribute('data-animate', 'blur-focus');

  // Steps
  const guideGrid = permitSection.append(webflow.elementPresets.DOM);
  guideGrid.setTag('div');
  guideGrid.setStyles([cyGuideGrid, cyMb64]);
  guideGrid.setAttribute('data-animate', 'fade-up-stagger');

  data.permitting.steps.forEach((step, i) => {
    const el = guideGrid.append(webflow.elementPresets.DOM);
    el.setTag('div');
    el.setStyles([cyGuideStep]);
    el.setAttribute('data-animate', 'fade-up');

    const num = el.append(webflow.elementPresets.DOM);
    num.setTag('div');
    num.setStyles([cyGuideStepNum]);
    num.setTextContent(String(i + 1).padStart(2, '0'));

    const title = el.append(webflow.elementPresets.DOM);
    title.setTag('h3');
    title.setStyles([cyGuideStepTitle]);
    title.setTextContent(step.title);

    const desc = el.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setStyles([cyGuideStepDesc]);
    desc.setTextContent(step.desc);
  });

  // Permit details card
  const permitInfo = permitSection.append(webflow.elementPresets.DOM);
  permitInfo.setTag('div');
  permitInfo.setStyles([cyPermitCard]);
  permitInfo.setAttribute('data-animate', 'fade-up');

  const detailRows = [
    `Department: ${data.permitting.department}`,
    `Typical fees: ${data.permitting.fees}`,
    `Processing time: ${data.permitting.timeline}`,
  ];
  if (data.permitting.contact) detailRows.push(`Contact: ${data.permitting.contact}`);
  if (data.permitting.website) detailRows.push(`Website: ${data.permitting.website}`);

  detailRows.forEach(row => {
    const r = permitInfo.append(webflow.elementPresets.DOM);
    r.setTag('p');
    r.setStyles([cyPermitRow]);
    r.setTextContent(row);
  });

  await safeCall('append:permitting', () => body.append(permitSection));

  // SECTION 5: COSTS & RENTAL (dark bg, stats + 2-col info)
  log('Building Section 5: Costs & Market...');
  const costSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  costSection.setTag('section');
  costSection.setStyles([s.section, s.sectionDark]);
  costSection.setAttribute('id', 'cy-costs');

  // Stats row
  const statsG = costSection.append(webflow.elementPresets.DOM);
  statsG.setTag('div');
  statsG.setStyles([cyStatsGrid, cyMb64]);

  const stats = [
    { number: data.costs.constructionRange, label: 'Construction Cost' },
    { number: data.rental.monthlyRange, label: 'Monthly Rental' },
    { number: data.costs.typicalSize, label: 'Typical ADU Size' },
  ];

  stats.forEach(stat => {
    const item = statsG.append(webflow.elementPresets.DOM);
    item.setTag('div');
    item.setStyles([cyStatItem]);
    item.setAttribute('data-animate', 'fade-up');

    const num = item.append(webflow.elementPresets.DOM);
    num.setTag('div');
    num.setStyles([cyStatNum]);
    num.setTextContent(stat.number);

    const lbl = item.append(webflow.elementPresets.DOM);
    lbl.setTag('div');
    lbl.setStyles([cyStatLabel]);
    lbl.setTextContent(stat.label);
  });

  // 2-col info cards
  const infoG = costSection.append(webflow.elementPresets.DOM);
  infoG.setTag('div');
  infoG.setStyles([cyInfoGrid]);

  // Cost details card
  const costCard = infoG.append(webflow.elementPresets.DOM);
  costCard.setTag('div');
  costCard.setStyles([cyInfoCard]);
  costCard.setAttribute('data-animate', 'fade-up');

  const costItems = [
    { label: 'Permit Fees', value: data.costs.permitFees },
    { label: 'Impact Fees', value: data.costs.impactFees },
  ];
  costItems.forEach(info => {
    const wrap = costCard.append(webflow.elementPresets.DOM);
    wrap.setTag('div');
    const lbl = wrap.append(webflow.elementPresets.DOM);
    lbl.setTag('div');
    lbl.setStyles([cyInfoLabel]);
    lbl.setTextContent(info.label);
    const val = wrap.append(webflow.elementPresets.DOM);
    val.setTag('div');
    val.setStyles([cyInfoValue]);
    val.setTextContent(info.value);
  });

  // Rental market card
  const rentalCard = infoG.append(webflow.elementPresets.DOM);
  rentalCard.setTag('div');
  rentalCard.setStyles([cyInfoCard]);
  rentalCard.setAttribute('data-animate', 'fade-up');

  const rentalWrap = rentalCard.append(webflow.elementPresets.DOM);
  rentalWrap.setTag('div');
  const rentalLbl = rentalWrap.append(webflow.elementPresets.DOM);
  rentalLbl.setTag('div');
  rentalLbl.setStyles([cyInfoLabel]);
  rentalLbl.setTextContent('Rental Market');
  const rentalVal = rentalWrap.append(webflow.elementPresets.DOM);
  rentalVal.setTag('div');
  rentalVal.setStyles([cyInfoValue]);
  rentalVal.setTextContent(data.rental.demandDrivers);

  await safeCall('append:costs', () => body.append(costSection));

  // SECTION 6: HOW-TO GUIDE (cream bg, steps)
  if (data.guide.length > 0) {
    log('Building Section 6: Guide...');
    const guideSection = webflow.elementBuilder(webflow.elementPresets.DOM);
    guideSection.setTag('section');
    guideSection.setStyles([s.section, s.sectionCream]);
    guideSection.setAttribute('id', 'cy-guide');

    const guideHeader = guideSection.append(webflow.elementPresets.DOM);
    guideHeader.setTag('div');
    guideHeader.setStyles([cyMb64]);
    const guideLbl = guideHeader.append(webflow.elementPresets.DOM);
    guideLbl.setTag('div');
    guideLbl.setStyles([s.label, cyMb32]);
    guideLbl.setAttribute('data-animate', 'fade-up');
    const guideLblTxt = guideLbl.append(webflow.elementPresets.DOM);
    guideLblTxt.setTag('div');
    guideLblTxt.setTextContent('Your ADU Guide');
    const guideLblLine = guideLbl.append(webflow.elementPresets.DOM);
    guideLblLine.setTag('div');
    guideLblLine.setStyles([cyLabelLine]);

    const guideHdr = guideHeader.append(webflow.elementPresets.DOM);
    guideHdr.setTag('h2');
    guideHdr.setStyles([s.headingXL]);
    guideHdr.setTextContent(`How to build an ADU in ${data.city}`);
    guideHdr.setAttribute('data-animate', 'blur-focus');

    const gg = guideSection.append(webflow.elementPresets.DOM);
    gg.setTag('div');
    gg.setStyles([cyGuideGrid]);
    gg.setAttribute('data-animate', 'fade-up-stagger');

    data.guide.forEach((step, i) => {
      const el = gg.append(webflow.elementPresets.DOM);
      el.setTag('div');
      el.setStyles([cyGuideStep]);
      el.setAttribute('data-animate', 'fade-up');

      const num = el.append(webflow.elementPresets.DOM);
      num.setTag('div');
      num.setStyles([cyGuideStepNum]);
      num.setTextContent(String(i + 1).padStart(2, '0'));

      const title = el.append(webflow.elementPresets.DOM);
      title.setTag('h3');
      title.setStyles([cyGuideStepTitle]);
      title.setTextContent(step.title);

      const desc = el.append(webflow.elementPresets.DOM);
      desc.setTag('p');
      desc.setStyles([cyGuideStepDesc]);
      desc.setTextContent(step.desc);
    });

    await safeCall('append:guide', () => body.append(guideSection));
  }

  // SECTION 7: CTA
  log('Building Section 7: CTA...');
  await buildCTASection(
    body, v,
    `Get your ${data.city} ADU estimate`,
    'ADU Cost Calculator', '/adu-cost-estimator',
    'Get a Free Estimate', '/free-estimate',
  );

  // ═══════════════ APPLY STYLES ═══════════════
  await applyStyleProperties();

  log(`${data.city} ADU page built!`, 'success');
  await webflow.notify({ type: 'Success', message: `${data.city} ADU page created!` });
}
