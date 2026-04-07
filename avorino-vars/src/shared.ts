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

  // v2 redesign: new shared styles
  const split6040 = await getOrCreateStyle('av-split-60-40');
  const split4060 = await getOrCreateStyle('av-split-40-60');
  const imgHero = await getOrCreateStyle('av-img-hero');
  const imgLandscape = await getOrCreateStyle('av-img-landscape');
  const imgTall = await getOrCreateStyle('av-img-tall');
  const divider = await getOrCreateStyle('av-divider');
  const dividerLight = await getOrCreateStyle('av-divider-light');
  const inputClean = await getOrCreateStyle('av-input-clean');
  const textareaClean = await getOrCreateStyle('av-textarea-clean');
  const selectClean = await getOrCreateStyle('av-select-clean');
  const formLabel = await getOrCreateStyle('av-form-label');
  const formGrid2 = await getOrCreateStyle('av-form-grid-2');
  const submitBtn = await getOrCreateStyle('av-submit-btn');

  Object.assign(styles, {
    section, body, headingXL, headingLG, headingMD, label,
    grid2, grid3, cardDark, cardLight,
    btnPrimary, btnSecondary,
    flexCol, flexCenter, flexWrap,
    sectionWarm, sectionDark, sectionCream, bodyMuted,
    split6040, split4060,
    imgHero, imgLandscape, imgTall,
    divider, dividerLight,
    inputClean, textareaClean, selectClean, formLabel, formGrid2, submitBtn,
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

  // Flex utility (used by form builder etc.)
  await clearAndSet(await freshStyle('av-flex-col'), 'av-flex-col', {
    'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '24px',
  });
  await wait(200);

  // v2 redesign: asymmetric grid layouts
  logDetail('Setting v2 layout props...', 'info');
  await clearAndSet(await freshStyle('av-split-60-40'), 'av-split-60-40', {
    'display': 'grid', 'grid-template-columns': '1.5fr 1fr',
    'grid-column-gap': '96px', 'grid-row-gap': '64px', 'align-items': 'start',
  });
  await clearAndSet(await freshStyle('av-split-40-60'), 'av-split-40-60', {
    'display': 'grid', 'grid-template-columns': '1fr 1.5fr',
    'grid-column-gap': '96px', 'grid-row-gap': '64px', 'align-items': 'start',
  });
  await wait(500);

  // v2: image placeholders
  logDetail('Setting v2 image placeholder props...', 'info');
  const imgBase: Record<string, any> = {
    'background-color': '#1a1a1a',
    'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
    'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
    'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
  };
  await clearAndSet(await freshStyle('av-img-hero'), 'av-img-hero', { ...imgBase, 'min-height': '60vh' });
  await clearAndSet(await freshStyle('av-img-landscape'), 'av-img-landscape', { ...imgBase, 'min-height': '400px' });
  await clearAndSet(await freshStyle('av-img-tall'), 'av-img-tall', { ...imgBase, 'min-height': '560px' });
  await wait(500);

  // v2: dividers
  logDetail('Setting v2 divider props...', 'info');
  await clearAndSet(await freshStyle('av-divider'), 'av-divider', {
    'width': '100%', 'height': '1px', 'background-color': v['av-dark-10'],
    'margin-top': '48px', 'margin-bottom': '48px',
  });
  await clearAndSet(await freshStyle('av-divider-light'), 'av-divider-light', {
    'width': '100%', 'height': '1px', 'background-color': v['av-cream-06'],
    'margin-top': '48px', 'margin-bottom': '48px',
  });
  await wait(500);

  // v2: clean bordered form inputs (DMDC inquiry style)
  logDetail('Setting v2 form input props...', 'info');
  const inputBase: Record<string, any> = {
    'font-family': 'DM Sans', 'font-size': v['av-text-body'],
    'padding-top': '18px', 'padding-bottom': '18px',
    'padding-left': '20px', 'padding-right': '20px',
    'background-color': v['av-cream'], 'color': v['av-dark'],
    'border-top-width': '1px', 'border-bottom-width': '1px',
    'border-left-width': '1px', 'border-right-width': '1px',
    'border-top-style': 'solid', 'border-bottom-style': 'solid',
    'border-left-style': 'solid', 'border-right-style': 'solid',
    'border-top-color': v['av-dark-10'], 'border-bottom-color': v['av-dark-10'],
    'border-left-color': v['av-dark-10'], 'border-right-color': v['av-dark-10'],
    'border-top-left-radius': '6px', 'border-top-right-radius': '6px',
    'border-bottom-left-radius': '6px', 'border-bottom-right-radius': '6px',
    'width': '100%',
  };
  await clearAndSet(await freshStyle('av-input-clean'), 'av-input-clean', inputBase);
  await clearAndSet(await freshStyle('av-select-clean'), 'av-select-clean', inputBase);
  await clearAndSet(await freshStyle('av-textarea-clean'), 'av-textarea-clean', { ...inputBase, 'min-height': '140px' });
  await clearAndSet(await freshStyle('av-form-label'), 'av-form-label', {
    'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
    'font-weight': '500', 'margin-bottom': '8px', 'display': 'block',
  });
  await clearAndSet(await freshStyle('av-form-grid-2'), 'av-form-grid-2', {
    'display': 'grid', 'grid-template-columns': '1fr 1fr',
    'grid-column-gap': '16px', 'grid-row-gap': '16px',
  });
  await clearAndSet(await freshStyle('av-submit-btn'), 'av-submit-btn', {
    'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
    'font-weight': '500', 'letter-spacing': '0.04em',
    'display': 'inline-flex', 'align-items': 'center', 'justify-content': 'center',
    'color': v['av-cream'], 'background-color': v['av-dark'],
    'padding-top': v['av-btn-pad-y'], 'padding-bottom': v['av-btn-pad-y'],
    'padding-left': v['av-btn-pad-x'], 'padding-right': v['av-btn-pad-x'],
    'border-top-left-radius': v['av-radius-pill'], 'border-top-right-radius': v['av-radius-pill'],
    'border-bottom-left-radius': v['av-radius-pill'], 'border-bottom-right-radius': v['av-radius-pill'],
    'border-top-width': '0px', 'border-bottom-width': '0px',
    'border-left-width': '0px', 'border-right-width': '0px',
    'cursor': 'pointer', 'width': '100%', 'margin-top': '16px',
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

// ── Magazine embed section (dark bg, click-to-interact iframe) ──
export interface MagazineConfig {
  url: string;
  title: string;
  heading: string;
  desc: string;
}

export async function buildMagazineSection(
  body: any,
  v: Record<string, any>,
  config: MagazineConfig,
) {
  const magSection = await getOrCreateStyle('av-mag-section');
  const magInner = await getOrCreateStyle('av-mag-inner');
  const magHeader = await getOrCreateStyle('av-mag-header');
  const magLabel = await getOrCreateStyle('av-mag-label');
  const magHeading = await getOrCreateStyle('av-mag-heading');
  const magDesc = await getOrCreateStyle('av-mag-desc');
  const magFrame = await getOrCreateStyle('av-mag-frame');
  const magHolder = await getOrCreateStyle('av-mag-holder');

  const section = webflow.elementBuilder(webflow.elementPresets.DOM);
  section.setTag('section');
  section.setStyles([magSection]);
  section.setAttribute('id', 'av-magazine');

  const inner = section.append(webflow.elementPresets.DOM);
  inner.setTag('div');
  inner.setStyles([magInner]);

  // Header
  const header = inner.append(webflow.elementPresets.DOM);
  header.setTag('div');
  header.setStyles([magHeader]);

  const labelEl = header.append(webflow.elementPresets.DOM);
  labelEl.setTag('div');
  labelEl.setStyles([magLabel]);
  labelEl.setTextContent('// Magazine');
  labelEl.setAttribute('data-animate', 'fade-up');

  const headingEl = header.append(webflow.elementPresets.DOM);
  headingEl.setTag('h2');
  headingEl.setStyles([magHeading]);
  headingEl.setTextContent(config.heading);
  headingEl.setAttribute('data-animate', 'blur-focus');

  const descEl = header.append(webflow.elementPresets.DOM);
  descEl.setTag('p');
  descEl.setStyles([magDesc]);
  descEl.setTextContent(config.desc);
  descEl.setAttribute('data-animate', 'fade-up');

  // Frame (holds the iframe placeholder)
  const frame = inner.append(webflow.elementPresets.DOM);
  frame.setTag('div');
  frame.setStyles([magFrame]);
  frame.setAttribute('data-animate', 'fade-up');

  const holder = frame.append(webflow.elementPresets.DOM);
  holder.setTag('div');
  holder.setStyles([magHolder]);
  holder.setAttribute('id', 'magazine-holder');
  holder.setAttribute('data-magazine-url', config.url);
  holder.setAttribute('data-magazine-title', config.title);

  await safeCall('append:magazine', () => body.append(section));
  logDetail('Magazine section appended', 'ok');
}

export async function applyMagazineStyleProps(v: Record<string, any>) {
  await clearAndSet(await freshStyle('av-mag-section'), 'av-mag-section', {
    'padding-top': v['av-section-pad-y'], 'padding-bottom': v['av-section-pad-y'],
    'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
    'background-color': v['av-dark'], 'color': v['av-cream'],
    'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
  });
  await clearAndSet(await freshStyle('av-mag-inner'), 'av-mag-inner', {
    'max-width': '1280px', 'margin-left': 'auto', 'margin-right': 'auto',
  });
  await clearAndSet(await freshStyle('av-mag-header'), 'av-mag-header', {
    'margin-bottom': v['av-gap-md'],
  });
  await clearAndSet(await freshStyle('av-mag-label'), 'av-mag-label', {
    'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
    'font-weight': '400', 'letter-spacing': '0.3em', 'text-transform': 'uppercase',
    'color': v['av-cream'], 'opacity': '0.35', 'margin-bottom': '28px',
  });
  await clearAndSet(await freshStyle('av-mag-heading'), 'av-mag-heading', {
    'font-family': 'DM Serif Display', 'font-size': v['av-text-h2'],
    'line-height': '1.12', 'letter-spacing': '-0.02em', 'font-weight': '400',
    'margin-bottom': '16px', 'color': v['av-cream'],
  });
  await clearAndSet(await freshStyle('av-mag-desc'), 'av-mag-desc', {
    'font-family': 'DM Sans', 'font-size': v['av-text-body'],
    'line-height': '1.7', 'opacity': '0.5', 'color': v['av-cream'],
    'max-width': '560px',
  });
  await clearAndSet(await freshStyle('av-mag-frame'), 'av-mag-frame', {
    'position': 'relative', 'width': '100%', 'height': '85vh', 'min-height': '600px',
    'border-top-left-radius': '16px', 'border-top-right-radius': '16px',
    'border-bottom-left-radius': '16px', 'border-bottom-right-radius': '16px',
    'overflow-x': 'hidden', 'overflow-y': 'hidden',
    'border-top-width': '1px', 'border-bottom-width': '1px',
    'border-left-width': '1px', 'border-right-width': '1px',
    'border-top-style': 'solid', 'border-bottom-style': 'solid',
    'border-left-style': 'solid', 'border-right-style': 'solid',
    'border-top-color': 'rgba(201, 169, 110, 0.1)', 'border-bottom-color': 'rgba(201, 169, 110, 0.1)',
    'border-left-color': 'rgba(201, 169, 110, 0.1)', 'border-right-color': 'rgba(201, 169, 110, 0.1)',
    'background-color': '#0a0a0a',
  });
  await clearAndSet(await freshStyle('av-mag-holder'), 'av-mag-holder', {
    'width': '100%', 'height': '100%',
  });
}

// ── Calendly integration ──
export const CALENDLY_URL = 'https://calendly.com/avorino/client-meetings';
export const CALENDLY_CSS = '<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">';
export const CALENDLY_JS = '<script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async><\/script>';

// Inline Calendly embed section (cream bg, centered heading + widget)
export async function buildCalendlySection(
  body: any,
  v: Record<string, any>,
  heading: string = 'Book a Free Consultation',
) {
  const calSection = await getOrCreateStyle('av-cal-section');
  const calHeading = await getOrCreateStyle('av-cal-heading');
  const calWidget = await getOrCreateStyle('av-cal-widget');

  const section = webflow.elementBuilder(webflow.elementPresets.DOM);
  section.setTag('section');
  section.setStyles([calSection]);
  section.setAttribute('id', 'av-calendly');

  const h2 = section.append(webflow.elementPresets.DOM);
  h2.setTag('h2');
  h2.setStyles([calHeading]);
  h2.setTextContent(heading);
  h2.setAttribute('data-animate', 'word-stagger-elastic');

  const widget = section.append(webflow.elementPresets.DOM);
  widget.setTag('div');
  widget.setStyles([calWidget]);
  widget.setAttribute('class', 'calendly-inline-widget');
  widget.setAttribute('data-url', CALENDLY_URL + '?hide_gdpr_banner=1&background_color=f0ede8&text_color=111111&primary_color=111111');
  widget.setAttribute('style', 'min-height:1100px;width:100%;');

  await safeCall('append:calendly', () => body.append(section));
  logDetail('Calendly section appended', 'ok');
}

export async function applyCalendlyStyleProps(v: Record<string, any>) {
  await clearAndSet(await freshStyle('av-cal-section'), 'av-cal-section', {
    'padding-top': v['av-section-pad-y'], 'padding-bottom': v['av-section-pad-y'],
    'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
    'background-color': v['av-cream'], 'color': v['av-dark'],
    'text-align': 'center',
  });
  await clearAndSet(await freshStyle('av-cal-heading'), 'av-cal-heading', {
    'font-family': 'DM Serif Display', 'font-size': v['av-text-h2'],
    'line-height': '1.08', 'letter-spacing': '-0.02em', 'font-weight': '400',
    'margin-bottom': v['av-gap-md'], 'color': v['av-dark'],
  });
  await clearAndSet(await freshStyle('av-cal-widget'), 'av-cal-widget', {
    'min-height': '1100px', 'width': '100%',
    'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
    'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
    'overflow-x': 'hidden', 'overflow-y': 'auto',
  });
}

// ── Shared form builder (DOM-based, only preset supported) ──
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'file';
  placeholder?: string;
  options?: string[];
  halfWidth?: boolean; // pair with next field in 2-col row
}

export async function buildCleanForm(
  parent: any,
  fields: FormField[],
  s: Record<string, any>,
  submitText: string = 'Send Message',
  formName: string = 'Contact Form',
) {
  const formWrap = parent.append(webflow.elementPresets.DOM);
  formWrap.setTag('div');
  formWrap.setStyles([s.flexCol]);
  formWrap.setAttribute('class', 'av-form');
  formWrap.setAttribute('data-form', formName);
  formWrap.setAttribute('data-animate', 'fade-up');

  let i = 0;
  while (i < fields.length) {
    const field = fields[i];
    const next = fields[i + 1];

    if (field.halfWidth && next?.halfWidth) {
      const row = formWrap.append(webflow.elementPresets.DOM);
      row.setTag('div');
      row.setAttribute('class', 'av-form-row');

      _buildField(row, field, s);
      _buildField(row, next, s);
      i += 2;
    } else {
      _buildField(formWrap, field, s);
      i += 1;
    }
  }

  // Submit button
  const submitBtn = formWrap.append(webflow.elementPresets.DOM);
  submitBtn.setTag('button');
  submitBtn.setAttribute('class', 'av-form-submit');
  submitBtn.setTextContent(submitText);
  submitBtn.setAttribute('type', 'submit');

  return formWrap;
}

function _buildField(parent: any, field: FormField, s: Record<string, any>) {
  const wrap = parent.append(webflow.elementPresets.DOM);
  wrap.setTag('div');
  wrap.setAttribute('class', 'av-form-field');

  const label = wrap.append(webflow.elementPresets.DOM);
  label.setTag('label');
  label.setAttribute('class', 'av-form-label');
  label.setTextContent(field.label);

  if (field.type === 'textarea') {
    const el = wrap.append(webflow.elementPresets.DOM);
    el.setTag('textarea');
    el.setAttribute('class', 'av-form-textarea');
    el.setAttribute('name', field.name);
    if (field.placeholder) el.setAttribute('placeholder', field.placeholder);
  } else if (field.type === 'select') {
    const el = wrap.append(webflow.elementPresets.DOM);
    el.setTag('select');
    el.setAttribute('class', 'av-form-select');
    el.setAttribute('name', field.name);
    // Add options if provided
    if (field.options) {
      const blank = el.append(webflow.elementPresets.DOM);
      blank.setTag('option');
      blank.setTextContent('Select...');
      blank.setAttribute('value', '');
      blank.setAttribute('disabled', 'true');
      blank.setAttribute('selected', 'true');
      for (const opt of field.options) {
        const o = el.append(webflow.elementPresets.DOM);
        o.setTag('option');
        o.setTextContent(opt);
        o.setAttribute('value', opt);
      }
    }
  } else if (field.type === 'file') {
    const el = wrap.append(webflow.elementPresets.DOM);
    el.setTag('input');
    el.setAttribute('class', 'av-form-input');
    el.setAttribute('type', 'file');
    el.setAttribute('name', field.name);
    el.setAttribute('accept', '.pdf,.jpg,.jpeg,.png,.doc,.docx,.dwg');
  } else {
    const el = wrap.append(webflow.elementPresets.DOM);
    el.setTag('input');
    el.setAttribute('class', 'av-form-input');
    el.setAttribute('type', field.type);
    el.setAttribute('name', field.name);
    if (field.placeholder) el.setAttribute('placeholder', field.placeholder);
  }
}

// ════════════════════════════════════════════════════════════════
// City ADU Page — Shared Builder
// Each index-city-*.ts passes unique CityData to this function.
// ════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// SERVICE PAGE BUILDER (for Custom Homes, Renovations, etc.)
// ═══════════════════════════════════════════════════════════════

export interface ServiceType {
  number: string;
  title: string;
  desc: string;
  features?: string[];
}

export interface ServiceProcess {
  number: string;
  title: string;
  desc: string;
}

export interface ServiceData {
  slug: string;
  pageName: string;
  title: string;
  seoDesc: string;
  heroLabel: string;
  heroTitle: string;
  heroSubtitle: string;
  approach: { heading: string; body: string; highlights?: string[] };
  serviceTypes: ServiceType[];
  process: ServiceProcess[];
  whyAvorino: { heading: string; body: string; stats?: { value: string; label: string }[] };
  ctaHeading: string;
  magazine?: MagazineConfig;
}

export interface CommercialPageData {
  slug: string;
  pageName: string;
  title: string;
  seoDesc: string;

  hero: {
    label: string;
    title: string;
    subtitle: string;
  };

  trustStrip: {
    words: string[];
    proof: { value: string; label: string };
  };

  comparison: {
    heading: string;
    items: { typical: string; avorino: string }[];
    proof: { number: string; text: string; subtext?: string };
  };

  preconstruction: {
    heading: string;
    subtitle: string;
    layers: { title: string; desc: string }[];
  };

  projectTypes: {
    heading: string;
    subtitle: string;
    types: { number: string; title: string; desc: string }[];
  };

  idealFit: {
    heading: string;
    body: string;
    fits: string[];
    proofLine: string;
  };

  process: {
    heading: string;
    steps: { number: string; title: string; desc: string }[];
  };

  cta: {
    heading: string;
    primaryBtn: { text: string; href: string };
    secondaryBtn: { text: string; href: string };
  };
}

export async function buildServicePage(data: ServiceData) {
  const v = await getAvorinVars();
  logDetail('Loaded Avorino variable collection', 'ok');

  log('Creating shared styles...');
  const s = await createSharedStyles();

  // ── Service page styles ──
  log('Creating service page styles...');

  // Hero
  const svHero = await getOrCreateStyle('sv-hero');
  const svHeroContent = await getOrCreateStyle('sv-hero-content');
  const svHeroLabel = await getOrCreateStyle('sv-hero-label');
  const svHeroGoldLine = await getOrCreateStyle('sv-hero-gold-line');
  const svHeroSubtitle = await getOrCreateStyle('sv-hero-subtitle');
  const svHeroScrollHint = await getOrCreateStyle('sv-hero-scroll-hint');
  const svHeroScrollLine = await getOrCreateStyle('sv-hero-scroll-line');
  const svCanvasWrap = await getOrCreateStyle('sv-canvas-wrap');
  const svContentOverlay = await getOrCreateStyle('sv-content-overlay');

  // Approach section
  const svApproach = await getOrCreateStyle('sv-approach');
  const svApproachGrid = await getOrCreateStyle('sv-approach-grid');
  const svApproachLeft = await getOrCreateStyle('sv-approach-left');
  const svApproachRight = await getOrCreateStyle('sv-approach-right');
  const svHighlight = await getOrCreateStyle('sv-highlight');
  const svHighlightNum = await getOrCreateStyle('sv-highlight-num');
  const svHighlightText = await getOrCreateStyle('sv-highlight-text');

  // Types/services grid
  const svTypesGrid = await getOrCreateStyle('sv-types-grid');
  const svTypeCard = await getOrCreateStyle('sv-type-card');
  const svTypeNum = await getOrCreateStyle('sv-type-num');
  const svTypeTitle = await getOrCreateStyle('sv-type-title');
  const svTypeDesc = await getOrCreateStyle('sv-type-desc');
  const svTypeFeatureList = await getOrCreateStyle('sv-type-feature-list');

  // Process section
  const svProcessSection = await getOrCreateStyle('sv-process');
  const svProcessSteps = await getOrCreateStyle('sv-process-steps');
  const svProcessStep = await getOrCreateStyle('sv-process-step');
  const svProcessStepNum = await getOrCreateStyle('sv-process-step-num');
  const svProcessStepBody = await getOrCreateStyle('sv-process-step-body');
  const svProcessStepTitle = await getOrCreateStyle('sv-process-step-title');
  const svProcessStepDesc = await getOrCreateStyle('sv-process-step-desc');
  const svProcessBar = await getOrCreateStyle('sv-process-bar');
  const svProcessBarTrack = await getOrCreateStyle('sv-process-bar-track');
  const svProcessBarFill = await getOrCreateStyle('sv-process-bar-fill');
  const svProcessBarDots = await getOrCreateStyle('sv-process-bar-dots');
  const svProcessBarDot = await getOrCreateStyle('sv-process-bar-dot');

  // Why Avorino
  const svWhy = await getOrCreateStyle('sv-why');
  const svWhyContent = await getOrCreateStyle('sv-why-content');
  const svStatsGrid = await getOrCreateStyle('sv-stats-grid');
  const svStatItem = await getOrCreateStyle('sv-stat-item');
  const svStatValue = await getOrCreateStyle('sv-stat-value');
  const svStatLabel = await getOrCreateStyle('sv-stat-label');

  // ── Create page ──
  const { body } = await createPageWithSlug(
    data.pageName, data.slug, data.title, data.seoDesc,
  );

  // ── Style properties ──
  async function applyStyleProperties() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    await wait(1000);

    log('Setting service page style properties...');

    // Hero
    await clearAndSet(await freshStyle('sv-hero'), 'sv-hero', {
      'min-height': '80vh',
      'display': 'flex', 'align-items': 'flex-end',
      'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('sv-canvas-wrap'), 'sv-canvas-wrap', {
      'position': 'absolute', 'top': '0px', 'left': '0px',
      'width': '100%', 'height': '100%',
      'z-index': '1', 'pointer-events': 'none',
      'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('sv-content-overlay'), 'sv-content-overlay', {
      'position': 'relative', 'z-index': '2',
    });
    await clearAndSet(await freshStyle('sv-hero-content'), 'sv-hero-content', {
      'max-width': '800px',
    });
    await clearAndSet(await freshStyle('sv-hero-label'), 'sv-hero-label', {
      'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
      'letter-spacing': '0.3em', 'text-transform': 'uppercase',
      'opacity': '0', 'margin-bottom': '32px', 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('sv-hero-gold-line'), 'sv-hero-gold-line', {
      'width': '0px', 'height': '1px',
      'background-color': '#c9a96e', 'margin-bottom': '24px',
    });
    await clearAndSet(await freshStyle('sv-hero-subtitle'), 'sv-hero-subtitle', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0', 'margin-top': '24px',
      'color': v['av-cream'], 'max-width': '560px',
    });
    await clearAndSet(await freshStyle('sv-hero-scroll-hint'), 'sv-hero-scroll-hint', {
      'position': 'absolute', 'bottom': '40px', 'left': '50%',
      'z-index': '3', 'display': 'flex', 'flex-direction': 'column',
      'align-items': 'center', 'grid-row-gap': '8px', 'opacity': '0',
    });
    await clearAndSet(await freshStyle('sv-hero-scroll-line'), 'sv-hero-scroll-line', {
      'width': '1px', 'height': '40px', 'background-color': '#c9a96e',
    });
    await wait(500);

    // Approach section
    await clearAndSet(await freshStyle('sv-approach'), 'sv-approach', {
      'padding-top': v['av-section-pad-y'], 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
    });
    await clearAndSet(await freshStyle('sv-approach-grid'), 'sv-approach-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr',
      'grid-column-gap': '80px', 'grid-row-gap': '48px',
      'max-width': '1200px', 'margin-left': 'auto', 'margin-right': 'auto',
    });
    await clearAndSet(await freshStyle('sv-approach-left'), 'sv-approach-left', {
      'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '24px',
    });
    await clearAndSet(await freshStyle('sv-approach-right'), 'sv-approach-right', {
      'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '24px',
    });
    await clearAndSet(await freshStyle('sv-highlight'), 'sv-highlight', {
      'display': 'flex', 'grid-column-gap': '20px', 'align-items': 'flex-start',
      'padding-top': '20px', 'padding-bottom': '20px',
      'border-top': `1px solid ${v['av-dark-06']}`,
    });
    await clearAndSet(await freshStyle('sv-highlight-num'), 'sv-highlight-num', {
      'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
      'letter-spacing': '0.2em', 'opacity': '0.3', 'min-width': '32px',
      'padding-top': '4px',
    });
    await clearAndSet(await freshStyle('sv-highlight-text'), 'sv-highlight-text', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'line-height': '1.7',
    });
    await wait(500);

    // Types/services grid
    await clearAndSet(await freshStyle('sv-types-grid'), 'sv-types-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr',
      'grid-column-gap': '32px', 'grid-row-gap': '32px',
      'max-width': '1100px', 'margin-left': 'auto', 'margin-right': 'auto',
    });
    await clearAndSet(await freshStyle('sv-type-card'), 'sv-type-card', {
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'padding-top': '48px', 'padding-bottom': '48px',
      'padding-left': '40px', 'padding-right': '40px',
      'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '12px',
    });
    await clearAndSet(await freshStyle('sv-type-num'), 'sv-type-num', {
      'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
      'letter-spacing': '0.2em', 'text-transform': 'uppercase',
      'opacity': '0.4', 'margin-bottom': '4px',
    });
    await clearAndSet(await freshStyle('sv-type-title'), 'sv-type-title', {
      'font-family': 'DM Serif Display', 'font-size': '28px',
      'line-height': '1.2', 'margin-bottom': '4px', 'font-weight': '400',
    });
    await clearAndSet(await freshStyle('sv-type-desc'), 'sv-type-desc', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'line-height': '1.7', 'opacity': '0.5',
    });
    await clearAndSet(await freshStyle('sv-type-feature-list'), 'sv-type-feature-list', {
      'padding-left': '0px', 'margin-top': '16px',
      'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '10px',
    });
    await wait(500);

    // Process section
    await clearAndSet(await freshStyle('sv-process'), 'sv-process', {
      'padding-top': v['av-section-pad-y'], 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'min-height': '100vh', 'display': 'flex', 'flex-direction': 'column', 'align-items': 'center',
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('sv-process-steps'), 'sv-process-steps', {
      'position': 'relative', 'width': '100%', 'max-width': '1100px',
      'flex-grow': '1', 'flex-shrink': '1', 'flex-basis': 'auto',
      'margin-left': 'auto', 'margin-right': 'auto',
      'border-top-width': '1px', 'border-top-style': 'solid', 'border-top-color': 'rgba(240,237,232,0.08)',
      'border-bottom-width': '1px', 'border-bottom-style': 'solid', 'border-bottom-color': 'rgba(240,237,232,0.08)',
    });
    await clearAndSet(await freshStyle('sv-process-step'), 'sv-process-step', {
      'display': 'grid', 'grid-template-columns': '80px 1fr 160px',
      'grid-column-gap': '48px', 'padding-top': '48px', 'padding-bottom': '48px',
      'align-items': 'center', 'position': 'absolute', 'top': '50%',
      'left': '0', 'width': '100%', 'opacity': '0',
      'transition-property': 'opacity', 'transition-duration': '0.5s', 'transition-timing-function': 'ease',
      'pointer-events': 'none',
    });
    await clearAndSet(await freshStyle('sv-process-step-num'), 'sv-process-step-num', {
      'font-family': 'DM Serif Display', 'font-size': '72px',
      'line-height': '1', 'font-weight': '400', 'text-align': 'center',
      'color': 'rgba(240,237,232,0.28)',
    });
    await clearAndSet(await freshStyle('sv-process-step-body'), 'sv-process-step-body', {
      'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '10px',
    });
    await clearAndSet(await freshStyle('sv-process-step-title'), 'sv-process-step-title', {
      'font-family': 'DM Serif Display', 'font-size': '28px',
      'line-height': '1.2', 'font-weight': '400', 'color': v['av-cream'],
      'margin-bottom': '0',
    });
    await clearAndSet(await freshStyle('sv-process-step-desc'), 'sv-process-step-desc', {
      'font-family': 'DM Sans', 'font-size': '15px',
      'line-height': '1.8', 'color': 'rgba(240,237,232,0.6)', 'max-width': '480px',
    });
    await clearAndSet(await freshStyle('sv-process-bar'), 'sv-process-bar', {
      'position': 'relative', 'width': '100%', 'max-width': '1100px',
      'margin-left': 'auto', 'margin-right': 'auto', 'margin-top': '48px',
      'display': 'flex', 'align-items': 'center', 'height': '48px',
    });
    await clearAndSet(await freshStyle('sv-process-bar-track'), 'sv-process-bar-track', {
      'position': 'absolute', 'top': '50%', 'left': '0', 'right': '0',
      'height': '1px', 'background-color': 'rgba(240,237,232,0.08)',
    });
    await clearAndSet(await freshStyle('sv-process-bar-fill'), 'sv-process-bar-fill', {
      'position': 'absolute', 'top': '50%', 'left': '0', 'right': '0',
      'height': '1px', 'background-color': '#c8222a', 'opacity': '0.5',
    });
    await clearAndSet(await freshStyle('sv-process-bar-dots'), 'sv-process-bar-dots', {
      'position': 'relative', 'width': '100%',
      'display': 'flex', 'align-items': 'center', 'justify-content': 'space-between',
    });
    await clearAndSet(await freshStyle('sv-process-bar-dot'), 'sv-process-bar-dot', {
      'position': 'relative', 'width': '10px', 'height': '10px',
      'border-radius': '50%',
      'border-top-width': '1.5px', 'border-top-style': 'solid', 'border-top-color': 'rgba(240,237,232,0.15)',
      'border-right-width': '1.5px', 'border-right-style': 'solid', 'border-right-color': 'rgba(240,237,232,0.15)',
      'border-bottom-width': '1.5px', 'border-bottom-style': 'solid', 'border-bottom-color': 'rgba(240,237,232,0.15)',
      'border-left-width': '1.5px', 'border-left-style': 'solid', 'border-left-color': 'rgba(240,237,232,0.15)',
      'background-color': '#111111', 'z-index': '1',
    });
    await wait(500);

    // Why Avorino
    await clearAndSet(await freshStyle('sv-why'), 'sv-why', {
      'padding-top': v['av-section-pad-y'], 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
    });
    await clearAndSet(await freshStyle('sv-why-content'), 'sv-why-content', {
      'max-width': '900px', 'margin-left': 'auto', 'margin-right': 'auto',
      'text-align': 'center',
    });
    await clearAndSet(await freshStyle('sv-stats-grid'), 'sv-stats-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr',
      'grid-column-gap': '48px', 'margin-top': '64px',
      'max-width': '800px', 'margin-left': 'auto', 'margin-right': 'auto',
    });
    await clearAndSet(await freshStyle('sv-stat-item'), 'sv-stat-item', {
      'display': 'flex', 'flex-direction': 'column', 'align-items': 'center',
      'grid-row-gap': '8px',
    });
    await clearAndSet(await freshStyle('sv-stat-value'), 'sv-stat-value', {
      'font-family': 'DM Serif Display', 'font-size': '48px',
      'line-height': '1', 'font-weight': '400',
    });
    await clearAndSet(await freshStyle('sv-stat-label'), 'sv-stat-label', {
      'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
      'letter-spacing': '0.2em', 'text-transform': 'uppercase',
      'opacity': '0.4',
    });
    await wait(500);

    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: HERO
  log('Building Section 1: Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([svHero]);
  hero.setAttribute('id', 'sv-hero');

  const heroCanvasWrap = hero.append(webflow.elementPresets.DOM);
  heroCanvasWrap.setTag('div');
  heroCanvasWrap.setStyles([svCanvasWrap]);
  heroCanvasWrap.setAttribute('id', 'hero-canvas');

  const heroOverlay = hero.append(webflow.elementPresets.DOM);
  heroOverlay.setTag('div');
  heroOverlay.setStyles([svContentOverlay, svHeroContent]);

  const heroLabel = heroOverlay.append(webflow.elementPresets.DOM);
  heroLabel.setTag('div');
  heroLabel.setStyles([svHeroLabel]);
  heroLabel.setTextContent(data.heroLabel);
  heroLabel.setAttribute('data-animate', 'fade-up');

  const heroH = heroOverlay.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setStyles([s.headingXL]);
  heroH.setTextContent(data.heroTitle);
  heroH.setAttribute('data-animate', 'char-cascade');

  const heroGoldLine = heroOverlay.append(webflow.elementPresets.DOM);
  heroGoldLine.setTag('div');
  heroGoldLine.setStyles([svHeroGoldLine]);

  const heroSub = heroOverlay.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setStyles([svHeroSubtitle]);
  heroSub.setTextContent(data.heroSubtitle);
  heroSub.setAttribute('data-animate', 'fade-up');

  const scrollHint = hero.append(webflow.elementPresets.DOM);
  scrollHint.setTag('div');
  scrollHint.setStyles([svHeroScrollHint]);
  scrollHint.setAttribute('data-animate', 'fade-up');
  const scrollHintText = scrollHint.append(webflow.elementPresets.DOM);
  scrollHintText.setTag('span');
  scrollHintText.setTextContent('Scroll');
  const scrollHintLine = scrollHint.append(webflow.elementPresets.DOM);
  scrollHintLine.setTag('div');
  scrollHintLine.setStyles([svHeroScrollLine]);

  await safeCall('append:hero', () => body.append(hero));
  logDetail('Section 1: Hero appended', 'ok');

  // SECTION 2: APPROACH — Split layout
  log('Building Section 2: Approach...');
  const approachSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  approachSection.setTag('section');
  approachSection.setStyles([svApproach]);
  approachSection.setAttribute('id', 'sv-approach');

  const approachGrid = approachSection.append(webflow.elementPresets.DOM);
  approachGrid.setTag('div');
  approachGrid.setStyles([svApproachGrid]);

  // Left: label + heading + body
  const approachLeft = approachGrid.append(webflow.elementPresets.DOM);
  approachLeft.setTag('div');
  approachLeft.setStyles([svApproachLeft]);

  const approachLabel = approachLeft.append(webflow.elementPresets.DOM);
  approachLabel.setTag('div');
  approachLabel.setStyles([s.label]);
  approachLabel.setAttribute('data-animate', 'fade-up');
  const approachLabelTxt = approachLabel.append(webflow.elementPresets.DOM);
  approachLabelTxt.setTag('div');
  approachLabelTxt.setTextContent('// Our Approach');

  const approachH = approachLeft.append(webflow.elementPresets.DOM);
  approachH.setTag('h2');
  approachH.setStyles([s.headingLG]);
  approachH.setTextContent(data.approach.heading);
  approachH.setAttribute('data-animate', 'word-stagger-elastic');

  const approachBody = approachLeft.append(webflow.elementPresets.DOM);
  approachBody.setTag('p');
  approachBody.setStyles([s.body]);
  approachBody.setTextContent(data.approach.body);
  approachBody.setAttribute('data-animate', 'fade-up');

  // Right: highlights
  const approachRight = approachGrid.append(webflow.elementPresets.DOM);
  approachRight.setTag('div');
  approachRight.setStyles([svApproachRight]);

  if (data.approach.highlights) {
    data.approach.highlights.forEach((h, i) => {
      const row = approachRight.append(webflow.elementPresets.DOM);
      row.setTag('div');
      row.setStyles([svHighlight]);
      row.setAttribute('data-animate', 'fade-up');

      const num = row.append(webflow.elementPresets.DOM);
      num.setTag('span');
      num.setStyles([svHighlightNum]);
      num.setTextContent(String(i + 1).padStart(2, '0'));

      const txt = row.append(webflow.elementPresets.DOM);
      txt.setTag('p');
      txt.setStyles([svHighlightText]);
      txt.setTextContent(h);
    });
  }

  await safeCall('append:approach', () => body.append(approachSection));
  logDetail('Section 2: Approach appended', 'ok');

  // SECTION 3: SERVICE TYPES — Warm bg, 2-col cards
  log('Building Section 3: Service Types...');
  const typesSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  typesSection.setTag('section');
  typesSection.setStyles([s.section, s.sectionWarm]);
  typesSection.setAttribute('id', 'sv-types');

  const typesHeader = typesSection.append(webflow.elementPresets.DOM);
  typesHeader.setTag('div');
  typesHeader.setStyles([await getOrCreateStyle('sv-types-header')]);

  const typesLabel = typesHeader.append(webflow.elementPresets.DOM);
  typesLabel.setTag('div');
  typesLabel.setStyles([s.label]);
  typesLabel.setAttribute('data-animate', 'fade-up');
  const typesLabelTxt = typesLabel.append(webflow.elementPresets.DOM);
  typesLabelTxt.setTag('div');
  typesLabelTxt.setTextContent('// What We Build');

  const typesH = typesHeader.append(webflow.elementPresets.DOM);
  typesH.setTag('h2');
  typesH.setStyles([s.headingLG]);
  typesH.setTextContent(`Our ${data.pageName} Services`);
  typesH.setAttribute('data-animate', 'word-stagger-elastic');

  await clearAndSet(await freshStyle('sv-types-header'), 'sv-types-header', {
    'text-align': 'center', 'margin-bottom': '64px',
    'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
  });

  const typesGrid = typesSection.append(webflow.elementPresets.DOM);
  typesGrid.setTag('div');
  typesGrid.setStyles([svTypesGrid]);

  data.serviceTypes.forEach(svc => {
    const card = typesGrid.append(webflow.elementPresets.DOM);
    card.setTag('div');
    card.setStyles([svTypeCard]);
    card.setAttribute('data-animate', 'fade-up');

    const numEl = card.append(webflow.elementPresets.DOM);
    numEl.setTag('div');
    numEl.setStyles([svTypeNum]);
    numEl.setTextContent(svc.number);

    const titleEl = card.append(webflow.elementPresets.DOM);
    titleEl.setTag('h3');
    titleEl.setStyles([svTypeTitle]);
    titleEl.setTextContent(svc.title);

    const descEl = card.append(webflow.elementPresets.DOM);
    descEl.setTag('p');
    descEl.setStyles([svTypeDesc]);
    descEl.setTextContent(svc.desc);

    if (svc.features && svc.features.length) {
      const listEl = card.append(webflow.elementPresets.DOM);
      listEl.setTag('ul');
      listEl.setStyles([svTypeFeatureList]);
      svc.features.forEach(f => {
        const li = listEl.append(webflow.elementPresets.DOM);
        li.setTag('li');
        li.setTextContent(f);
      });
    }
  });

  await safeCall('append:types', () => body.append(typesSection));
  logDetail('Section 3: Service Types appended', 'ok');

  // SECTION 4: PROCESS — Dark bg, scroll-locked step carousel
  log('Building Section 4: Process...');
  const processSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  processSection.setTag('section');
  processSection.setStyles([svProcessSection]);
  processSection.setAttribute('id', 'sv-process');

  const processHeader = processSection.append(webflow.elementPresets.DOM);
  processHeader.setTag('div');
  processHeader.setStyles([await getOrCreateStyle('sv-process-header')]);

  const processLabel = processHeader.append(webflow.elementPresets.DOM);
  processLabel.setTag('div');
  processLabel.setStyles([s.label]);
  processLabel.setAttribute('data-animate', 'fade-up');
  const processLabelTxt = processLabel.append(webflow.elementPresets.DOM);
  processLabelTxt.setTag('div');
  processLabelTxt.setTextContent('// The Process');

  const processH = processHeader.append(webflow.elementPresets.DOM);
  processH.setTag('h2');
  processH.setStyles([s.headingLG]);
  processH.setTextContent('How It Works');
  processH.setAttribute('data-animate', 'fade-up');

  await clearAndSet(await freshStyle('sv-process-header'), 'sv-process-header', {
    'text-align': 'center', 'padding-bottom': '64px',
  });

  // Steps container (absolutely-positioned steps inside for scroll-driven carousel)
  const stepsContainer = processSection.append(webflow.elementPresets.DOM);
  stepsContainer.setTag('div');
  stepsContainer.setStyles([svProcessSteps]);

  data.process.forEach((step, i) => {
    const stepEl = stepsContainer.append(webflow.elementPresets.DOM);
    stepEl.setTag('div');
    stepEl.setStyles([svProcessStep]);

    const numEl = stepEl.append(webflow.elementPresets.DOM);
    numEl.setTag('div');
    numEl.setStyles([svProcessStepNum]);
    numEl.setTextContent(step.number);

    const bodyEl = stepEl.append(webflow.elementPresets.DOM);
    bodyEl.setTag('div');
    bodyEl.setStyles([svProcessStepBody]);

    const titleEl = bodyEl.append(webflow.elementPresets.DOM);
    titleEl.setTag('h3');
    titleEl.setStyles([svProcessStepTitle]);
    titleEl.setTextContent(step.title);

    const descEl = bodyEl.append(webflow.elementPresets.DOM);
    descEl.setTag('p');
    descEl.setStyles([svProcessStepDesc]);
    descEl.setTextContent(step.desc);
  });

  // Progress bar with dots
  const barEl = processSection.append(webflow.elementPresets.DOM);
  barEl.setTag('div');
  barEl.setStyles([svProcessBar]);

  const trackEl = barEl.append(webflow.elementPresets.DOM);
  trackEl.setTag('div');
  trackEl.setStyles([svProcessBarTrack]);

  const fillEl = barEl.append(webflow.elementPresets.DOM);
  fillEl.setTag('div');
  fillEl.setStyles([svProcessBarFill]);

  const dotsEl = barEl.append(webflow.elementPresets.DOM);
  dotsEl.setTag('div');
  dotsEl.setStyles([svProcessBarDots]);

  data.process.forEach((step) => {
    const dotEl = dotsEl.append(webflow.elementPresets.DOM);
    dotEl.setTag('div');
    dotEl.setStyles([svProcessBarDot]);

    const dotSpan = dotEl.append(webflow.elementPresets.DOM);
    dotSpan.setTag('span');
    dotSpan.setTextContent(step.title);
  });

  await safeCall('append:process', () => body.append(processSection));
  logDetail('Section 4: Process appended', 'ok');

  // SECTION 5: WHY AVORINO — Warm bg, centered with stats
  log('Building Section 5: Why Avorino...');
  const whySection = webflow.elementBuilder(webflow.elementPresets.DOM);
  whySection.setTag('section');
  whySection.setStyles([svWhy, s.sectionWarm]);
  whySection.setAttribute('id', 'sv-why');

  const whyContent = whySection.append(webflow.elementPresets.DOM);
  whyContent.setTag('div');
  whyContent.setStyles([svWhyContent]);

  const whyLabel = whyContent.append(webflow.elementPresets.DOM);
  whyLabel.setTag('div');
  whyLabel.setStyles([s.label]);
  whyLabel.setAttribute('data-animate', 'fade-up');
  const whyLabelTxt = whyLabel.append(webflow.elementPresets.DOM);
  whyLabelTxt.setTag('div');
  whyLabelTxt.setTextContent('// Why Avorino');

  const whyH = whyContent.append(webflow.elementPresets.DOM);
  whyH.setTag('h2');
  whyH.setStyles([s.headingLG]);
  whyH.setTextContent(data.whyAvorino.heading);
  whyH.setAttribute('data-animate', 'word-stagger-elastic');

  const whyBody = whyContent.append(webflow.elementPresets.DOM);
  whyBody.setTag('p');
  whyBody.setStyles([s.body]);
  whyBody.setTextContent(data.whyAvorino.body);
  whyBody.setAttribute('data-animate', 'fade-up');

  if (data.whyAvorino.stats && data.whyAvorino.stats.length) {
    const statsGrid = whyContent.append(webflow.elementPresets.DOM);
    statsGrid.setTag('div');
    statsGrid.setStyles([svStatsGrid]);
    statsGrid.setAttribute('data-animate', 'fade-up-stagger');

    data.whyAvorino.stats.forEach(stat => {
      const item = statsGrid.append(webflow.elementPresets.DOM);
      item.setTag('div');
      item.setStyles([svStatItem]);

      const val = item.append(webflow.elementPresets.DOM);
      val.setTag('div');
      val.setStyles([svStatValue]);
      val.setTextContent(stat.value);

      const label = item.append(webflow.elementPresets.DOM);
      label.setTag('div');
      label.setStyles([svStatLabel]);
      label.setTextContent(stat.label);
    });
  }

  await safeCall('append:why', () => body.append(whySection));
  logDetail('Section 5: Why Avorino appended', 'ok');

  // SECTION 6: MAGAZINE (optional)
  if (data.magazine) {
    log('Building Section 6: Magazine...');
    await buildMagazineSection(body, v, data.magazine);
    await applyMagazineStyleProps(v);
  }

  // SECTION 7: CTA
  log('Building Section 7: CTA...');
  await buildCTASection(
    body, v,
    data.ctaHeading,
    'Schedule a Meeting', '/schedule-a-meeting',
    'Call (714) 900-3676', 'tel:7149003676',
  );

  // ═══════════════ APPLY STYLES ═══════════════
  await applyStyleProperties();

  log(`${data.pageName} page built!`, 'success');
  await webflow.notify({ type: 'Success', message: `${data.pageName} page created!` });
}

// ═══════════════════════════════════════════════════════════════
// COMMERCIAL PAGE BUILDER
// ═══════════════════════════════════════════════════════════════

export async function buildCommercialPage(data: CommercialPageData) {
  const v = await getAvorinVars();
  logDetail('Loaded Avorino variable collection', 'ok');

  log('Creating shared styles...');
  const s = await createSharedStyles();

  // ── Commercial page styles (cm- namespace) ──
  log('Creating commercial page styles...');

  // Hero
  const cmHero = await getOrCreateStyle('cm-hero');
  const cmHeroContent = await getOrCreateStyle('cm-hero-content');
  const cmHeroLabel = await getOrCreateStyle('cm-hero-label');
  const cmHeroGoldLine = await getOrCreateStyle('cm-hero-gold-line');
  const cmHeroSubtitle = await getOrCreateStyle('cm-hero-subtitle');
  const cmHeroScrollHint = await getOrCreateStyle('cm-hero-scroll-hint');
  const cmHeroScrollLine = await getOrCreateStyle('cm-hero-scroll-line');
  const cmCanvasWrap = await getOrCreateStyle('cm-canvas-wrap');
  const cmContentOverlay = await getOrCreateStyle('cm-content-overlay');

  // Trust Strip
  const cmTrustStrip = await getOrCreateStyle('cm-trust-strip');
  const cmTrustWord = await getOrCreateStyle('cm-trust-word');
  const cmTrustDot = await getOrCreateStyle('cm-trust-dot');
  const cmTrustProof = await getOrCreateStyle('cm-trust-proof');
  const cmTrustProofValue = await getOrCreateStyle('cm-trust-proof-value');
  const cmTrustProofLabel = await getOrCreateStyle('cm-trust-proof-label');

  // Comparison
  const cmComparison = await getOrCreateStyle('cm-comparison');
  const cmCompInner = await getOrCreateStyle('cm-comparison-inner');
  const cmCompHeader = await getOrCreateStyle('cm-comparison-header');
  const cmCompRow = await getOrCreateStyle('cm-comparison-row');
  const cmCompTypical = await getOrCreateStyle('cm-comp-typical');
  const cmCompAvorino = await getOrCreateStyle('cm-comp-avorino');
  const cmProofStat = await getOrCreateStyle('cm-proof-stat');
  const cmProofStatNumber = await getOrCreateStyle('cm-proof-stat-number');
  const cmProofStatText = await getOrCreateStyle('cm-proof-stat-text');

  // Preconstruction
  const cmPrecon = await getOrCreateStyle('cm-precon');
  const cmPreconHeader = await getOrCreateStyle('cm-precon-header');
  const cmPreconDesktop = await getOrCreateStyle('cm-precon-desktop');
  const cmPreconCanvas = await getOrCreateStyle('cm-precon-canvas');
  const cmPreconCard = await getOrCreateStyle('cm-precon-card');
  const cmPreconCardNum = await getOrCreateStyle('cm-precon-card-num');
  const cmPreconCardTitle = await getOrCreateStyle('cm-precon-card-title');
  const cmPreconCardDesc = await getOrCreateStyle('cm-precon-card-desc');
  const cmPreconNav = await getOrCreateStyle('cm-precon-nav');
  const cmPreconMobile = await getOrCreateStyle('cm-precon-mobile');
  const cmPreconMobileStep = await getOrCreateStyle('cm-precon-mobile-step');
  const cmPreconMobileNum = await getOrCreateStyle('cm-precon-mobile-num');
  const cmPreconMobileTitle = await getOrCreateStyle('cm-precon-mobile-title');
  const cmPreconMobileDesc = await getOrCreateStyle('cm-precon-mobile-desc');

  // Project Types
  const cmTypes = await getOrCreateStyle('cm-types');
  const cmTypesInner = await getOrCreateStyle('cm-types-inner');
  const cmTypesSubtitle = await getOrCreateStyle('cm-types-subtitle');
  const cmTypesList = await getOrCreateStyle('cm-types-list');
  const cmTypeItem = await getOrCreateStyle('cm-type-item');
  const cmTypeNum = await getOrCreateStyle('cm-type-num');
  const cmTypeBody = await getOrCreateStyle('cm-type-body');
  const cmTypeTitle = await getOrCreateStyle('cm-type-title');
  const cmTypeDesc = await getOrCreateStyle('cm-type-desc');

  // Ideal Fit
  const cmFit = await getOrCreateStyle('cm-fit');
  const cmFitInner = await getOrCreateStyle('cm-fit-inner');
  const cmFitBody = await getOrCreateStyle('cm-fit-body');
  const cmFitItems = await getOrCreateStyle('cm-fit-items');
  const cmFitItem = await getOrCreateStyle('cm-fit-item');
  const cmFitNum = await getOrCreateStyle('cm-fit-num');
  const cmFitText = await getOrCreateStyle('cm-fit-text');
  const cmFitProof = await getOrCreateStyle('cm-fit-proof');

  // Process
  const cmProcess = await getOrCreateStyle('cm-process');
  const cmProcessInner = await getOrCreateStyle('cm-process-inner');
  const cmProcessGrid = await getOrCreateStyle('cm-process-grid');
  const cmProcessStep = await getOrCreateStyle('cm-process-step');
  const cmProcessNum = await getOrCreateStyle('cm-process-num');
  const cmProcessTitle = await getOrCreateStyle('cm-process-title');
  const cmProcessDesc = await getOrCreateStyle('cm-process-desc');

  // ── Create page ──
  const { body } = await createPageWithSlug(
    data.pageName, data.slug, data.title, data.seoDesc,
  );

  // ── Style properties (applied after elements are built) ──
  async function applyCommercialStyleProps() {
    log('Setting shared style properties...');
    await setSharedStyleProps(s, v);
    await wait(1000);

    log('Setting commercial page style properties...');

    // Hero
    await clearAndSet(await freshStyle('cm-hero'), 'cm-hero', {
      'min-height': '80vh',
      'display': 'flex', 'align-items': 'flex-end',
      'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('cm-canvas-wrap'), 'cm-canvas-wrap', {
      'position': 'absolute', 'top': '0px', 'left': '0px',
      'width': '100%', 'height': '100%',
      'z-index': '1', 'pointer-events': 'none',
      'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('cm-content-overlay'), 'cm-content-overlay', {
      'position': 'relative', 'z-index': '2',
    });
    await clearAndSet(await freshStyle('cm-hero-content'), 'cm-hero-content', {
      'max-width': '720px',
    });
    await clearAndSet(await freshStyle('cm-hero-label'), 'cm-hero-label', {
      'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
      'letter-spacing': '0.3em', 'text-transform': 'uppercase',
      'opacity': '0', 'margin-bottom': '32px', 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('cm-hero-gold-line'), 'cm-hero-gold-line', {
      'width': '0px', 'height': '1px',
      'background-color': '#c9a96e', 'margin-bottom': '24px',
    });
    await clearAndSet(await freshStyle('cm-hero-subtitle'), 'cm-hero-subtitle', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0', 'margin-top': '24px',
      'color': v['av-cream'], 'max-width': '560px',
    });
    await clearAndSet(await freshStyle('cm-hero-scroll-hint'), 'cm-hero-scroll-hint', {
      'position': 'absolute', 'bottom': '40px', 'left': '50%',
      'z-index': '3', 'display': 'flex', 'flex-direction': 'column',
      'align-items': 'center', 'grid-row-gap': '8px', 'opacity': '0',
    });
    await clearAndSet(await freshStyle('cm-hero-scroll-line'), 'cm-hero-scroll-line', {
      'width': '1px', 'height': '40px', 'background-color': '#c9a96e',
    });
    await wait(1000);

    // Trust Strip
    await clearAndSet(await freshStyle('cm-trust-strip'), 'cm-trust-strip', {
      'padding-top': '52px', 'padding-bottom': '52px',
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'display': 'flex', 'align-items': 'center', 'justify-content': 'center',
      'grid-column-gap': '28px', 'flex-wrap': 'wrap',
      'background-color': v['av-cream'], 'color': v['av-dark'],
    });
    await clearAndSet(await freshStyle('cm-trust-word'), 'cm-trust-word', {
      'font-family': 'DM Serif Display', 'font-size': '24px',
      'letter-spacing': '-0.01em',
    });
    await clearAndSet(await freshStyle('cm-trust-dot'), 'cm-trust-dot', {
      'width': '4px', 'height': '4px', 'border-radius': '50%',
      'background-color': '#c9a96e', 'opacity': '0.5',
    });
    await clearAndSet(await freshStyle('cm-trust-proof'), 'cm-trust-proof', {
      'margin-left': 'auto', 'text-align': 'right', 'padding-left': '28px',
      'border-left-width': '1px', 'border-left-style': 'solid', 'border-left-color': 'rgba(17,17,17,0.1)',
    });
    await clearAndSet(await freshStyle('cm-trust-proof-value'), 'cm-trust-proof-value', {
      'font-family': 'DM Sans', 'font-size': '13px',
      'font-weight': '600', 'letter-spacing': '0.02em',
    });
    await clearAndSet(await freshStyle('cm-trust-proof-label'), 'cm-trust-proof-label', {
      'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
      'letter-spacing': '0.12em', 'text-transform': 'uppercase',
      'opacity': '0.35', 'margin-top': '2px',
    });
    await wait(1000);

    // Comparison
    // Comparison — cream bg with dark text
    await clearAndSet(await freshStyle('cm-comparison'), 'cm-comparison', {
      'padding-top': v['av-section-pad-y'], 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-cream'], 'color': v['av-dark'],
    });
    await clearAndSet(await freshStyle('cm-comparison-inner'), 'cm-comparison-inner', {
      'max-width': '1000px', 'margin-left': 'auto', 'margin-right': 'auto',
    });
    await clearAndSet(await freshStyle('cm-comparison-header'), 'cm-comparison-header', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr', 'grid-column-gap': '48px',
      'padding-bottom': '20px',
      'border-bottom-width': '1px', 'border-bottom-style': 'solid', 'border-bottom-color': 'rgba(17,17,17,0.08)',
    });
    await clearAndSet(await freshStyle('cm-comparison-row'), 'cm-comparison-row', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr', 'grid-column-gap': '48px',
      'padding-top': '28px', 'padding-bottom': '28px',
      'border-bottom-width': '1px', 'border-bottom-style': 'solid', 'border-bottom-color': 'rgba(17,17,17,0.06)',
    });
    await clearAndSet(await freshStyle('cm-comp-typical'), 'cm-comp-typical', {
      'font-family': 'DM Sans', 'font-size': '15px', 'line-height': '1.7',
      'opacity': '0.4', 'font-style': 'italic', 'color': v['av-dark'],
    });
    await clearAndSet(await freshStyle('cm-comp-avorino'), 'cm-comp-avorino', {
      'font-family': 'DM Sans', 'font-size': '15px', 'line-height': '1.7',
      'opacity': '0.85', 'padding-left': '20px', 'color': v['av-dark'],
      'border-left-width': '2px', 'border-left-style': 'solid', 'border-left-color': '#c9a96e',
    });
    await clearAndSet(await freshStyle('cm-proof-stat'), 'cm-proof-stat', {
      'margin-top': '48px', 'padding-top': '28px', 'padding-bottom': '28px',
      'padding-left': '32px', 'padding-right': '32px',
      'background-color': 'rgba(201,169,110,0.04)',
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'border-left-width': '3px', 'border-left-style': 'solid', 'border-left-color': '#c9a96e',
      'display': 'flex', 'align-items': 'center', 'grid-column-gap': '24px',
    });
    await clearAndSet(await freshStyle('cm-proof-stat-number'), 'cm-proof-stat-number', {
      'font-family': 'DM Serif Display', 'font-size': '40px',
      'color': '#c9a96e', 'line-height': '1',
    });
    await clearAndSet(await freshStyle('cm-proof-stat-text'), 'cm-proof-stat-text', {
      'font-family': 'DM Sans', 'font-size': '15px', 'line-height': '1.6',
      'opacity': '0.6',
    });
    await wait(1000);

    // Preconstruction
    await clearAndSet(await freshStyle('cm-precon'), 'cm-precon', {
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'position': 'relative',
    });
    await clearAndSet(await freshStyle('cm-precon-header'), 'cm-precon-header', {
      'text-align': 'center', 'padding-top': v['av-section-pad-y'],
      'padding-bottom': '48px', 'padding-left': v['av-section-pad-x'],
      'padding-right': v['av-section-pad-x'],
      'border-top-width': '1px', 'border-top-style': 'solid', 'border-top-color': 'rgba(240,237,232,0.06)',
    });
    await clearAndSet(await freshStyle('cm-precon-desktop'), 'cm-precon-desktop', {
      'position': 'relative', 'width': '100%', 'min-height': '100vh',
      'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('cm-precon-canvas'), 'cm-precon-canvas', {
      'position': 'absolute', 'top': '0px', 'left': '0px',
      'width': '100%', 'height': '100%', 'z-index': '1',
    });
    await clearAndSet(await freshStyle('cm-precon-card'), 'cm-precon-card', {
      'position': 'absolute', 'z-index': '2',
      'max-width': '380px', 'padding-top': '36px', 'padding-bottom': '36px',
      'padding-left': '32px', 'padding-right': '32px',
      'background-color': 'rgba(17,17,17,0.88)',
      'border-top-left-radius': '16px', 'border-top-right-radius': '16px',
      'border-bottom-left-radius': '16px', 'border-bottom-right-radius': '16px',
      'border-width': '1px', 'border-style': 'solid', 'border-color': 'rgba(240,237,232,0.08)',
    });
    await clearAndSet(await freshStyle('cm-precon-card-num'), 'cm-precon-card-num', {
      'font-family': 'DM Sans', 'font-size': '12px',
      'letter-spacing': '0.2em', 'color': '#c9a96e', 'font-weight': '600',
      'margin-bottom': '12px',
    });
    await clearAndSet(await freshStyle('cm-precon-card-title'), 'cm-precon-card-title', {
      'font-family': 'DM Serif Display', 'font-size': '24px',
      'line-height': '1.2', 'font-weight': '400', 'margin-bottom': '12px',
    });
    await clearAndSet(await freshStyle('cm-precon-card-desc'), 'cm-precon-card-desc', {
      'font-family': 'DM Sans', 'font-size': '15px',
      'line-height': '1.8', 'opacity': '0.6',
    });
    await clearAndSet(await freshStyle('cm-precon-nav'), 'cm-precon-nav', {
      'text-align': 'center', 'padding-top': '32px', 'padding-bottom': '80px',
    });
    await clearAndSet(await freshStyle('cm-precon-mobile'), 'cm-precon-mobile', {
      'display': 'none', 'padding-left': v['av-section-pad-x'],
      'padding-right': v['av-section-pad-x'], 'padding-bottom': '80px',
    });
    await clearAndSet(await freshStyle('cm-precon-mobile-step'), 'cm-precon-mobile-step', {
      'padding-top': '32px', 'padding-bottom': '32px',
      'border-top-width': '1px', 'border-top-style': 'solid', 'border-top-color': 'rgba(240,237,232,0.06)',
    });
    await clearAndSet(await freshStyle('cm-precon-mobile-num'), 'cm-precon-mobile-num', {
      'font-family': 'DM Serif Display', 'font-size': '36px',
      'color': '#c9a96e', 'opacity': '0.3', 'line-height': '1', 'min-width': '48px',
    });
    await clearAndSet(await freshStyle('cm-precon-mobile-title'), 'cm-precon-mobile-title', {
      'font-family': 'DM Serif Display', 'font-size': '22px',
      'font-weight': '400', 'line-height': '1.2',
    });
    await clearAndSet(await freshStyle('cm-precon-mobile-desc'), 'cm-precon-mobile-desc', {
      'font-family': 'DM Sans', 'font-size': '15px',
      'line-height': '1.8', 'opacity': '0.55', 'padding-left': '64px',
    });
    await wait(1000);

    // Project Types
    await clearAndSet(await freshStyle('cm-types'), 'cm-types', {
      'padding-top': v['av-section-pad-y'], 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-warm'], 'color': v['av-dark'],
    });
    await clearAndSet(await freshStyle('cm-types-inner'), 'cm-types-inner', {
      'max-width': '1000px', 'margin-left': 'auto', 'margin-right': 'auto',
    });
    await clearAndSet(await freshStyle('cm-types-subtitle'), 'cm-types-subtitle', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.8', 'opacity': '0.55', 'margin-bottom': '56px',
      'max-width': '600px',
    });
    await clearAndSet(await freshStyle('cm-types-list'), 'cm-types-list', {
      'display': 'flex', 'flex-direction': 'column',
    });
    await clearAndSet(await freshStyle('cm-type-item'), 'cm-type-item', {
      'display': 'grid', 'grid-template-columns': '60px 1fr', 'grid-column-gap': '24px',
      'padding-top': '32px', 'padding-bottom': '32px', 'align-items': 'baseline',
      'border-top-width': '1px', 'border-top-style': 'solid', 'border-top-color': 'rgba(17,17,17,0.08)',
    });
    await clearAndSet(await freshStyle('cm-type-num'), 'cm-type-num', {
      'font-family': 'DM Serif Display', 'font-size': '28px',
      'color': '#c9a96e', 'opacity': '0.4', 'line-height': '1',
    });
    await clearAndSet(await freshStyle('cm-type-body'), 'cm-type-body', {});
    await clearAndSet(await freshStyle('cm-type-title'), 'cm-type-title', {
      'font-family': 'DM Serif Display', 'font-size': '24px',
      'font-weight': '400', 'line-height': '1.2', 'margin-bottom': '8px',
    });
    await clearAndSet(await freshStyle('cm-type-desc'), 'cm-type-desc', {
      'font-family': 'DM Sans', 'font-size': '15px',
      'line-height': '1.7', 'opacity': '0.55', 'max-width': '640px',
    });
    await wait(1000);

    // Ideal Fit
    await clearAndSet(await freshStyle('cm-fit'), 'cm-fit', {
      'padding-top': v['av-section-pad-y'], 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-cream'], 'color': v['av-dark'],
    });
    await clearAndSet(await freshStyle('cm-fit-inner'), 'cm-fit-inner', {
      'max-width': '900px', 'margin-left': 'auto', 'margin-right': 'auto',
      'text-align': 'center',
    });
    await clearAndSet(await freshStyle('cm-fit-body'), 'cm-fit-body', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.8', 'opacity': '0.65', 'margin-bottom': '48px',
    });
    await clearAndSet(await freshStyle('cm-fit-items'), 'cm-fit-items', {
      'text-align': 'left', 'max-width': '700px',
      'margin-left': 'auto', 'margin-right': 'auto',
    });
    await clearAndSet(await freshStyle('cm-fit-item'), 'cm-fit-item', {
      'display': 'flex', 'grid-column-gap': '20px', 'align-items': 'flex-start',
      'padding-top': '20px', 'padding-bottom': '20px',
      'border-top-width': '1px', 'border-top-style': 'solid', 'border-top-color': 'rgba(17,17,17,0.08)',
    });
    await clearAndSet(await freshStyle('cm-fit-num'), 'cm-fit-num', {
      'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
      'letter-spacing': '0.2em', 'color': '#c9a96e', 'font-weight': '600',
      'min-width': '32px', 'padding-top': '4px',
    });
    await clearAndSet(await freshStyle('cm-fit-text'), 'cm-fit-text', {
      'font-family': 'DM Sans', 'font-size': '15px', 'line-height': '1.7',
    });
    await clearAndSet(await freshStyle('cm-fit-proof'), 'cm-fit-proof', {
      'font-family': 'DM Sans', 'font-size': '14px', 'font-style': 'italic',
      'opacity': '0.45', 'margin-top': '48px', 'text-align': 'center',
    });
    await wait(1000);

    // Process
    // Process — warm bg with dark glass-morphism cards
    await clearAndSet(await freshStyle('cm-process'), 'cm-process', {
      'padding-top': v['av-section-pad-y'], 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-warm'], 'color': v['av-dark'],
    });
    await clearAndSet(await freshStyle('cm-process-inner'), 'cm-process-inner', {
      'max-width': '1100px', 'margin-left': 'auto', 'margin-right': 'auto',
    });
    await clearAndSet(await freshStyle('cm-process-grid'), 'cm-process-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr',
      'grid-column-gap': '24px', 'grid-row-gap': '24px',
    });
    await clearAndSet(await freshStyle('cm-process-step'), 'cm-process-step', {
      'padding-top': '40px', 'padding-bottom': '40px',
      'padding-left': '32px', 'padding-right': '32px',
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'border-top-width': '2px', 'border-top-style': 'solid', 'border-top-color': 'rgba(201,169,110,0.2)',
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('cm-process-num'), 'cm-process-num', {
      'font-family': 'DM Serif Display', 'font-size': '48px',
      'color': '#c9a96e', 'opacity': '0.2', 'line-height': '1', 'margin-bottom': '16px',
    });
    await clearAndSet(await freshStyle('cm-process-title'), 'cm-process-title', {
      'font-family': 'DM Serif Display', 'font-size': '24px',
      'font-weight': '400', 'line-height': '1.2', 'margin-bottom': '12px',
      'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('cm-process-desc'), 'cm-process-desc', {
      'font-family': 'DM Sans', 'font-size': '14px',
      'line-height': '1.8', 'color': v['av-cream'], 'opacity': '0.6',
    });
    await wait(1000);

    await applyCTAStyleProps(v);

    // CTA button variants (commercial-specific: primary red + ghost outline)
    await clearAndSet(await freshStyle('av-cta-subtitle'), 'av-cta-subtitle', {
      'font-family': 'DM Sans', 'font-size': '12px',
      'letter-spacing': '0.3em', 'text-transform': 'uppercase',
      'opacity': '0.4', 'margin-bottom': '32px', 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('av-cta-btn-primary'), 'av-cta-btn-primary', {
      'background-color': v['av-red'], 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('av-cta-btn-ghost'), 'av-cta-btn-ghost', {
      'background-color': 'rgba(240,237,232,0.08)', 'color': v['av-cream'],
      'border-top-width': '1px', 'border-top-style': 'solid', 'border-top-color': 'rgba(240,237,232,0.2)',
      'border-right-width': '1px', 'border-right-style': 'solid', 'border-right-color': 'rgba(240,237,232,0.2)',
      'border-bottom-width': '1px', 'border-bottom-style': 'solid', 'border-bottom-color': 'rgba(240,237,232,0.2)',
      'border-left-width': '1px', 'border-left-style': 'solid', 'border-left-color': 'rgba(240,237,232,0.2)',
    });
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: HERO
  log('Building Section 1: Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([cmHero]);
  hero.setAttribute('id', 'cm-hero');

  const heroCanvasWrap = hero.append(webflow.elementPresets.DOM);
  heroCanvasWrap.setTag('div');
  heroCanvasWrap.setStyles([cmCanvasWrap]);
  heroCanvasWrap.setAttribute('id', 'cm-hero-canvas');

  const heroOverlay = hero.append(webflow.elementPresets.DOM);
  heroOverlay.setTag('div');
  heroOverlay.setStyles([cmContentOverlay, cmHeroContent]);

  const heroLabel = heroOverlay.append(webflow.elementPresets.DOM);
  heroLabel.setTag('div');
  heroLabel.setStyles([cmHeroLabel]);
  heroLabel.setTextContent(data.hero.label);
  heroLabel.setAttribute('data-animate', 'fade-up');

  const heroH = heroOverlay.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setStyles([s.headingXL]);
  heroH.setTextContent(data.hero.title);
  heroH.setAttribute('data-animate', 'char-cascade');

  const heroGoldLine = heroOverlay.append(webflow.elementPresets.DOM);
  heroGoldLine.setTag('div');
  heroGoldLine.setStyles([cmHeroGoldLine]);

  const heroSub = heroOverlay.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setStyles([cmHeroSubtitle]);
  heroSub.setTextContent(data.hero.subtitle);
  heroSub.setAttribute('data-animate', 'fade-up');

  const scrollHint = hero.append(webflow.elementPresets.DOM);
  scrollHint.setTag('div');
  scrollHint.setStyles([cmHeroScrollHint]);
  scrollHint.setAttribute('data-animate', 'fade-up');
  const scrollHintText = scrollHint.append(webflow.elementPresets.DOM);
  scrollHintText.setTag('span');
  scrollHintText.setTextContent('Scroll');
  const scrollHintLine = scrollHint.append(webflow.elementPresets.DOM);
  scrollHintLine.setTag('div');
  scrollHintLine.setStyles([cmHeroScrollLine]);

  await safeCall('append:hero', () => body.append(hero));
  logDetail('Section 1: Hero appended', 'ok');

  // SECTION 2: TRUST STRIP
  log('Building Section 2: Trust Strip...');
  const trustSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  trustSection.setTag('section');
  trustSection.setStyles([cmTrustStrip]);
  trustSection.setAttribute('id', 'cm-trust-strip');

  data.trustStrip.words.forEach((word, i) => {
    if (i > 0) {
      const dot = trustSection.append(webflow.elementPresets.DOM);
      dot.setTag('span');
      dot.setStyles([cmTrustDot]);
    }
    const wordEl = trustSection.append(webflow.elementPresets.DOM);
    wordEl.setTag('span');
    wordEl.setStyles([cmTrustWord]);
    wordEl.setTextContent(word);
    wordEl.setAttribute('data-animate', 'fade-up');
  });

  const trustProof = trustSection.append(webflow.elementPresets.DOM);
  trustProof.setTag('div');
  trustProof.setStyles([cmTrustProof]);

  const trustProofVal = trustProof.append(webflow.elementPresets.DOM);
  trustProofVal.setTag('div');
  trustProofVal.setStyles([cmTrustProofValue]);
  trustProofVal.setTextContent(data.trustStrip.proof.value);

  const trustProofLbl = trustProof.append(webflow.elementPresets.DOM);
  trustProofLbl.setTag('div');
  trustProofLbl.setStyles([cmTrustProofLabel]);
  trustProofLbl.setTextContent(data.trustStrip.proof.label);

  await safeCall('append:trust', () => body.append(trustSection));
  logDetail('Section 2: Trust Strip appended', 'ok');

  // SECTION 3: COMPARISON
  log('Building Section 3: Comparison...');
  const compSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  compSection.setTag('section');
  compSection.setStyles([cmComparison]);
  compSection.setAttribute('id', 'cm-comparison');

  const compInner = compSection.append(webflow.elementPresets.DOM);
  compInner.setTag('div');
  compInner.setStyles([cmCompInner]);

  const compH = compInner.append(webflow.elementPresets.DOM);
  compH.setTag('h2');
  compH.setStyles([s.headingLG]);
  compH.setTextContent(data.comparison.heading);
  compH.setAttribute('data-animate', 'word-stagger-elastic');

  // Column headers
  const compHeaderRow = compInner.append(webflow.elementPresets.DOM);
  compHeaderRow.setTag('div');
  compHeaderRow.setStyles([cmCompHeader]);
  const compHeaderL = compHeaderRow.append(webflow.elementPresets.DOM);
  compHeaderL.setTag('span');
  compHeaderL.setStyles([s.label]);
  compHeaderL.setTextContent('Typical Contractor');
  const compHeaderR = compHeaderRow.append(webflow.elementPresets.DOM);
  compHeaderR.setTag('span');
  compHeaderR.setStyles([s.label]);
  compHeaderR.setTextContent('Avorino');

  // Comparison rows
  data.comparison.items.forEach(item => {
    const row = compInner.append(webflow.elementPresets.DOM);
    row.setTag('div');
    row.setStyles([cmCompRow]);
    row.setAttribute('data-animate', 'fade-up');

    const typicalEl = row.append(webflow.elementPresets.DOM);
    typicalEl.setTag('div');
    typicalEl.setStyles([cmCompTypical]);
    typicalEl.setTextContent(item.typical);

    const avorinoEl = row.append(webflow.elementPresets.DOM);
    avorinoEl.setTag('div');
    avorinoEl.setStyles([cmCompAvorino]);
    avorinoEl.setTextContent(item.avorino);
  });

  // Proof stat
  const proofStat = compInner.append(webflow.elementPresets.DOM);
  proofStat.setTag('div');
  proofStat.setStyles([cmProofStat]);
  proofStat.setAttribute('data-animate', 'fade-up');

  const proofNum = proofStat.append(webflow.elementPresets.DOM);
  proofNum.setTag('div');
  proofNum.setStyles([cmProofStatNumber]);
  proofNum.setTextContent(data.comparison.proof.number);

  const proofText = proofStat.append(webflow.elementPresets.DOM);
  proofText.setTag('div');
  proofText.setStyles([cmProofStatText]);
  proofText.setTextContent(data.comparison.proof.text);

  if (data.comparison.proof.subtext) {
    const proofSub = proofStat.append(webflow.elementPresets.DOM);
    proofSub.setTag('div');
    proofSub.setStyles([cmProofStatText]);
    proofSub.setTextContent(data.comparison.proof.subtext);
  }

  await safeCall('append:comparison', () => body.append(compSection));
  logDetail('Section 3: Comparison appended', 'ok');

  // SECTION 4: PRECONSTRUCTION
  log('Building Section 4: Preconstruction...');
  const preconSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  preconSection.setTag('section');
  preconSection.setStyles([cmPrecon]);
  preconSection.setAttribute('id', 'cm-precon');

  const preconHeader = preconSection.append(webflow.elementPresets.DOM);
  preconHeader.setTag('div');
  preconHeader.setStyles([cmPreconHeader]);

  const preconH = preconHeader.append(webflow.elementPresets.DOM);
  preconH.setTag('h2');
  preconH.setStyles([s.headingLG]);
  preconH.setTextContent(data.preconstruction.heading);
  preconH.setAttribute('data-animate', 'word-stagger-elastic');

  const preconSub = preconHeader.append(webflow.elementPresets.DOM);
  preconSub.setTag('p');
  preconSub.setStyles([s.body]);
  preconSub.setTextContent(data.preconstruction.subtitle);
  preconSub.setAttribute('data-animate', 'fade-up');

  // Desktop: pinned canvas + floating cards
  const preconDesktop = preconSection.append(webflow.elementPresets.DOM);
  preconDesktop.setTag('div');
  preconDesktop.setStyles([cmPreconDesktop]);

  const preconCanvas = preconDesktop.append(webflow.elementPresets.DOM);
  preconCanvas.setTag('div');
  preconCanvas.setStyles([cmPreconCanvas]);
  preconCanvas.setAttribute('id', 'cm-precon-canvas');

  // Precon cards (one per layer, positioned by JS)
  data.preconstruction.layers.forEach((layer, i) => {
    const card = preconDesktop.append(webflow.elementPresets.DOM);
    card.setTag('div');
    card.setStyles([cmPreconCard]);

    const cardNum = card.append(webflow.elementPresets.DOM);
    cardNum.setTag('div');
    cardNum.setStyles([cmPreconCardNum]);
    cardNum.setTextContent(`STEP ${String(i + 1).padStart(2, '0')} / ${String(data.preconstruction.layers.length).padStart(2, '0')}`);

    const cardTitle = card.append(webflow.elementPresets.DOM);
    cardTitle.setTag('h3');
    cardTitle.setStyles([cmPreconCardTitle]);
    cardTitle.setTextContent(layer.title);

    const cardDesc = card.append(webflow.elementPresets.DOM);
    cardDesc.setTag('p');
    cardDesc.setStyles([cmPreconCardDesc]);
    cardDesc.setTextContent(layer.desc);
  });

  // Navigation (step counter + progress bar)
  const preconNav = preconSection.append(webflow.elementPresets.DOM);
  preconNav.setTag('div');
  preconNav.setStyles([cmPreconNav]);

  // Mobile fallback
  const preconMobile = preconSection.append(webflow.elementPresets.DOM);
  preconMobile.setTag('div');
  preconMobile.setStyles([cmPreconMobile]);

  data.preconstruction.layers.forEach((layer, i) => {
    const step = preconMobile.append(webflow.elementPresets.DOM);
    step.setTag('div');
    step.setStyles([cmPreconMobileStep]);
    step.setAttribute('data-animate', 'fade-up');

    const stepNum = step.append(webflow.elementPresets.DOM);
    stepNum.setTag('div');
    stepNum.setStyles([cmPreconMobileNum]);
    stepNum.setTextContent(String(i + 1).padStart(2, '0'));

    const stepTitle = step.append(webflow.elementPresets.DOM);
    stepTitle.setTag('h3');
    stepTitle.setStyles([cmPreconMobileTitle]);
    stepTitle.setTextContent(layer.title);

    const stepDesc = step.append(webflow.elementPresets.DOM);
    stepDesc.setTag('p');
    stepDesc.setStyles([cmPreconMobileDesc]);
    stepDesc.setTextContent(layer.desc);
  });

  await safeCall('append:precon', () => body.append(preconSection));
  logDetail('Section 4: Preconstruction appended', 'ok');

  // SECTION 5: PROJECT TYPES
  log('Building Section 5: Project Types...');
  const typesSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  typesSection.setTag('section');
  typesSection.setStyles([cmTypes]);
  typesSection.setAttribute('id', 'cm-types');

  const typesInner = typesSection.append(webflow.elementPresets.DOM);
  typesInner.setTag('div');
  typesInner.setStyles([cmTypesInner]);

  const typesH = typesInner.append(webflow.elementPresets.DOM);
  typesH.setTag('h2');
  typesH.setStyles([s.headingLG]);
  typesH.setTextContent(data.projectTypes.heading);
  typesH.setAttribute('data-animate', 'word-stagger-elastic');

  const typesSub = typesInner.append(webflow.elementPresets.DOM);
  typesSub.setTag('p');
  typesSub.setStyles([cmTypesSubtitle]);
  typesSub.setTextContent(data.projectTypes.subtitle);
  typesSub.setAttribute('data-animate', 'fade-up');

  const typesList = typesInner.append(webflow.elementPresets.DOM);
  typesList.setTag('div');
  typesList.setStyles([cmTypesList]);

  data.projectTypes.types.forEach(t => {
    const item = typesList.append(webflow.elementPresets.DOM);
    item.setTag('div');
    item.setStyles([cmTypeItem]);
    item.setAttribute('data-animate', 'fade-up');

    const numEl = item.append(webflow.elementPresets.DOM);
    numEl.setTag('div');
    numEl.setStyles([cmTypeNum]);
    numEl.setTextContent(t.number);

    const bodyEl = item.append(webflow.elementPresets.DOM);
    bodyEl.setTag('div');
    bodyEl.setStyles([cmTypeBody]);

    const titleEl = bodyEl.append(webflow.elementPresets.DOM);
    titleEl.setTag('h3');
    titleEl.setStyles([cmTypeTitle]);
    titleEl.setTextContent(t.title);

    const descEl = bodyEl.append(webflow.elementPresets.DOM);
    descEl.setTag('p');
    descEl.setStyles([cmTypeDesc]);
    descEl.setTextContent(t.desc);
  });

  await safeCall('append:types', () => body.append(typesSection));
  logDetail('Section 5: Project Types appended', 'ok');

  // SECTION 6: IDEAL FIT
  log('Building Section 6: Ideal Fit...');
  const fitSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  fitSection.setTag('section');
  fitSection.setStyles([cmFit]);
  fitSection.setAttribute('id', 'cm-fit');

  const fitInner = fitSection.append(webflow.elementPresets.DOM);
  fitInner.setTag('div');
  fitInner.setStyles([cmFitInner]);

  const fitH = fitInner.append(webflow.elementPresets.DOM);
  fitH.setTag('h2');
  fitH.setStyles([s.headingLG]);
  fitH.setTextContent(data.idealFit.heading);
  fitH.setAttribute('data-animate', 'word-stagger-elastic');

  const fitBody = fitInner.append(webflow.elementPresets.DOM);
  fitBody.setTag('p');
  fitBody.setStyles([cmFitBody]);
  fitBody.setTextContent(data.idealFit.body);
  fitBody.setAttribute('data-animate', 'fade-up');

  const fitItems = fitInner.append(webflow.elementPresets.DOM);
  fitItems.setTag('div');
  fitItems.setStyles([cmFitItems]);

  data.idealFit.fits.forEach((fit, i) => {
    const item = fitItems.append(webflow.elementPresets.DOM);
    item.setTag('div');
    item.setStyles([cmFitItem]);
    item.setAttribute('data-animate', 'fade-up');

    const numEl = item.append(webflow.elementPresets.DOM);
    numEl.setTag('span');
    numEl.setStyles([cmFitNum]);
    numEl.setTextContent(String(i + 1).padStart(2, '0'));

    const textEl = item.append(webflow.elementPresets.DOM);
    textEl.setTag('span');
    textEl.setStyles([cmFitText]);
    textEl.setTextContent(fit);
  });

  const fitProof = fitInner.append(webflow.elementPresets.DOM);
  fitProof.setTag('p');
  fitProof.setStyles([cmFitProof]);
  fitProof.setTextContent(data.idealFit.proofLine);
  fitProof.setAttribute('data-animate', 'fade-up');

  await safeCall('append:fit', () => body.append(fitSection));
  logDetail('Section 6: Ideal Fit appended', 'ok');

  // SECTION 7: PROCESS
  log('Building Section 7: Process...');
  const processSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  processSection.setTag('section');
  processSection.setStyles([cmProcess]);
  processSection.setAttribute('id', 'cm-process');

  const processInner = processSection.append(webflow.elementPresets.DOM);
  processInner.setTag('div');
  processInner.setStyles([cmProcessInner]);

  const processH = processInner.append(webflow.elementPresets.DOM);
  processH.setTag('h2');
  processH.setStyles([s.headingLG]);
  processH.setTextContent(data.process.heading);
  processH.setAttribute('data-animate', 'word-stagger-elastic');

  const processGrid = processInner.append(webflow.elementPresets.DOM);
  processGrid.setTag('div');
  processGrid.setStyles([cmProcessGrid]);

  data.process.steps.forEach(step => {
    const stepEl = processGrid.append(webflow.elementPresets.DOM);
    stepEl.setTag('div');
    stepEl.setStyles([cmProcessStep]);
    stepEl.setAttribute('data-animate', 'fade-up');

    const numEl = stepEl.append(webflow.elementPresets.DOM);
    numEl.setTag('div');
    numEl.setStyles([cmProcessNum]);
    numEl.setTextContent(step.number);

    const titleEl = stepEl.append(webflow.elementPresets.DOM);
    titleEl.setTag('h3');
    titleEl.setStyles([cmProcessTitle]);
    titleEl.setTextContent(step.title);

    const descEl = stepEl.append(webflow.elementPresets.DOM);
    descEl.setTag('p');
    descEl.setStyles([cmProcessDesc]);
    descEl.setTextContent(step.desc);
  });

  await safeCall('append:process', () => body.append(processSection));
  logDetail('Section 7: Process appended', 'ok');

  // SECTION 8: CTA (inline — uses primary/ghost button variants)
  log('Building Section 8: CTA...');
  const cmCtaSection = await getOrCreateStyle('av-cta');
  const cmCtaContainer = await getOrCreateStyle('av-cta-container');
  const cmCtaHeading = await getOrCreateStyle('av-cta-heading');
  const cmCtaSubtitle = await getOrCreateStyle('av-cta-subtitle');
  const cmCtaBtn = await getOrCreateStyle('av-cta-btn');
  const cmCtaBtnPrimary = await getOrCreateStyle('av-cta-btn-primary');
  const cmCtaBtnGhost = await getOrCreateStyle('av-cta-btn-ghost');
  const cmCtaBtns = await getOrCreateStyle('av-cta-btns');

  const cta = webflow.elementBuilder(webflow.elementPresets.DOM);
  cta.setTag('section');
  cta.setStyles([cmCtaSection]);

  const ctaC = cta.append(webflow.elementPresets.DOM);
  ctaC.setTag('div');
  ctaC.setStyles([cmCtaContainer]);

  const ctaSub = ctaC.append(webflow.elementPresets.DOM);
  ctaSub.setTag('div');
  ctaSub.setStyles([cmCtaSubtitle]);
  ctaSub.setTextContent('// Get Started');

  const ctaH = ctaC.append(webflow.elementPresets.DOM);
  ctaH.setTag('h2');
  ctaH.setStyles([cmCtaHeading]);
  ctaH.setTextContent(data.cta.heading);
  ctaH.setAttribute('data-animate', 'word-stagger-elastic');

  const btnsWrap = ctaC.append(webflow.elementPresets.DOM);
  btnsWrap.setTag('div');
  btnsWrap.setStyles([cmCtaBtns]);
  btnsWrap.setAttribute('data-animate', 'fade-up');

  const a1 = btnsWrap.append(webflow.elementPresets.DOM);
  a1.setTag('a');
  a1.setStyles([cmCtaBtn, cmCtaBtnPrimary]);
  a1.setTextContent(data.cta.primaryBtn.text);
  a1.setAttribute('href', data.cta.primaryBtn.href);
  a1.setAttribute('data-magnetic', '');

  const a2 = btnsWrap.append(webflow.elementPresets.DOM);
  a2.setTag('a');
  a2.setStyles([cmCtaBtn, cmCtaBtnGhost]);
  a2.setTextContent(data.cta.secondaryBtn.text);
  a2.setAttribute('href', data.cta.secondaryBtn.href);
  a2.setAttribute('data-magnetic', '');

  await safeCall('append:cta', () => body.append(cta));
  logDetail('Section 8: CTA appended', 'ok');

  // ═══════════════ APPLY STYLES ═══════════════
  await applyCommercialStyleProps();

  log(`${data.pageName} page built!`, 'success');
  await webflow.notify({ type: 'Success', message: `${data.pageName} page created!` });
}

// ═══════════════════════════════════════════════════════════════
// CITY PAGE BUILDER
// ═══════════════════════════════════════════════════════════════

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
  showcaseDesc?: string;
}

export async function buildCityPage(data: CityData) {
  const v = await getAvorinVars();
  logDetail('Loaded Avorino variable collection', 'ok');

  log('Creating shared styles...');
  const s = await createSharedStyles();

  // ── City page styles (v3: animated city pages with Three.js) ──
  log('Creating city page styles...');

  // Hero
  const cyHero = await getOrCreateStyle('city-hero');
  const cyHeroContent = await getOrCreateStyle('city-hero-content');
  const cyHeroLabel = await getOrCreateStyle('city-hero-label');
  const cyHeroGoldLine = await getOrCreateStyle('city-hero-gold-line');
  const cyHeroSubtitle = await getOrCreateStyle('city-hero-subtitle');
  const cyHeroScrollHint = await getOrCreateStyle('city-hero-scroll-hint');
  const cyHeroScrollLine = await getOrCreateStyle('city-hero-scroll-line');
  const cyCanvasWrap = await getOrCreateStyle('canvas-wrap');
  const cyContentOverlay = await getOrCreateStyle('content-overlay');

  // Regulations (2-col card grid)
  const cyRegsHeader = await getOrCreateStyle('city-regs-header');
  const cyRegsGrid = await getOrCreateStyle('city-regs-grid');
  const cyRegCard = await getOrCreateStyle('city-reg-card');
  const cyRegCardLabel = await getOrCreateStyle('city-reg-card-label');
  const cyRegCardTitle = await getOrCreateStyle('city-reg-card-title');
  const cyRegCardDesc = await getOrCreateStyle('city-reg-card-desc');

  // City Showcase (full-width image section)
  const cyShowcase = await getOrCreateStyle('city-showcase');
  const cyShowcasePlaceholder = await getOrCreateStyle('city-showcase-placeholder');
  const cyShowcaseOverlay = await getOrCreateStyle('city-showcase-overlay');
  const cyShowcaseContent = await getOrCreateStyle('city-showcase-content');
  const cyShowcaseLabel = await getOrCreateStyle('city-showcase-label');
  const cyShowcaseTitle = await getOrCreateStyle('city-showcase-title');
  const cyShowcaseDesc = await getOrCreateStyle('city-showcase-desc');

  // Requirements (dark + Three.js + glass cards)
  const cyReqs = await getOrCreateStyle('city-reqs');
  const cyReqsContent = await getOrCreateStyle('city-reqs-content');
  const cyReqsHeader = await getOrCreateStyle('city-reqs-header');
  const cyReqsGrid = await getOrCreateStyle('city-reqs-grid');
  const cyGlassCard = await getOrCreateStyle('glass-card');
  const cyGlassCardNum = await getOrCreateStyle('glass-card-num');
  const cyGlassCardTitle = await getOrCreateStyle('glass-card-title');
  const cyGlassCardDesc = await getOrCreateStyle('glass-card-desc');
  const cyGlassCardList = await getOrCreateStyle('glass-card-list');

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

    // Hero: full-viewport dark with position relative for Three.js canvas
    await clearAndSet(await freshStyle('city-hero'), 'city-hero', {
      'min-height': '80vh',
      'display': 'flex', 'align-items': 'flex-end',
      'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('canvas-wrap'), 'canvas-wrap', {
      'position': 'absolute', 'top': '0px', 'left': '0px',
      'width': '100%', 'height': '100%',
      'z-index': '1', 'pointer-events': 'none',
      'overflow-x': 'hidden', 'overflow-y': 'hidden',
    });
    await clearAndSet(await freshStyle('content-overlay'), 'content-overlay', {
      'position': 'relative', 'z-index': '2',
    });
    await clearAndSet(await freshStyle('city-hero-content'), 'city-hero-content', {
      'max-width': '800px',
    });
    await clearAndSet(await freshStyle('city-hero-label'), 'city-hero-label', {
      'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
      'letter-spacing': '0.3em', 'text-transform': 'uppercase',
      'opacity': '0', 'margin-bottom': '32px', 'color': v['av-cream'],
    });
    await clearAndSet(await freshStyle('city-hero-gold-line'), 'city-hero-gold-line', {
      'width': '0px', 'height': '1px',
      'background-color': '#c9a96e', 'margin-bottom': '24px',
    });
    await clearAndSet(await freshStyle('city-hero-subtitle'), 'city-hero-subtitle', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.9', 'opacity': '0', 'margin-top': '24px',
      'color': v['av-cream'], 'max-width': '560px',
    });
    await clearAndSet(await freshStyle('city-hero-scroll-hint'), 'city-hero-scroll-hint', {
      'position': 'absolute', 'bottom': '40px', 'left': '50%',
      'z-index': '3', 'display': 'flex', 'flex-direction': 'column',
      'align-items': 'center', 'grid-row-gap': '8px', 'opacity': '0',
    });
    await clearAndSet(await freshStyle('city-hero-scroll-line'), 'city-hero-scroll-line', {
      'width': '1px', 'height': '40px', 'background-color': '#c9a96e',
    });
    await wait(500);

    // Regulations: warm bg, 2-col card grid
    await clearAndSet(await freshStyle('city-regs-header'), 'city-regs-header', {
      'text-align': 'center', 'margin-bottom': '80px',
    });
    await clearAndSet(await freshStyle('city-regs-grid'), 'city-regs-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr',
      'grid-column-gap': '32px', 'grid-row-gap': '32px',
      'max-width': '1100px', 'margin-left': 'auto', 'margin-right': 'auto',
    });
    await clearAndSet(await freshStyle('city-reg-card'), 'city-reg-card', {
      'background-color': v['av-dark'], 'color': v['av-cream'],
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'padding-top': '48px', 'padding-bottom': '48px',
      'padding-left': '40px', 'padding-right': '40px',
      'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '12px',
    });
    await clearAndSet(await freshStyle('city-reg-card-label'), 'city-reg-card-label', {
      'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
      'letter-spacing': '0.3em', 'text-transform': 'uppercase',
      'opacity': '0.4', 'margin-bottom': '4px',
    });
    await clearAndSet(await freshStyle('city-reg-card-title'), 'city-reg-card-title', {
      'font-family': 'DM Serif Display', 'font-size': '28px',
      'line-height': '1.2', 'margin-bottom': '4px',
    });
    await clearAndSet(await freshStyle('city-reg-card-desc'), 'city-reg-card-desc', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'line-height': '1.7', 'opacity': '0.5',
    });
    await wait(500);

    // City Showcase: full-width image with gradient overlay
    await clearAndSet(await freshStyle('city-showcase'), 'city-showcase', {
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
      'min-height': '70vh', 'display': 'flex', 'align-items': 'flex-end',
    });
    await clearAndSet(await freshStyle('city-showcase-placeholder'), 'city-showcase-placeholder', {
      'position': 'absolute', 'top': '0px', 'left': '0px',
      'width': '100%', 'height': '100%',
      'display': 'flex', 'flex-direction': 'column',
      'align-items': 'center', 'justify-content': 'center', 'grid-row-gap': '16px',
    });
    await clearAndSet(await freshStyle('city-showcase-overlay'), 'city-showcase-overlay', {
      'position': 'absolute', 'top': '0px', 'left': '0px',
      'width': '100%', 'height': '100%', 'pointer-events': 'none',
    });
    await clearAndSet(await freshStyle('city-showcase-content'), 'city-showcase-content', {
      'position': 'relative', 'z-index': '2',
      'padding-top': '64px', 'padding-bottom': '64px',
      'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
      'width': '100%', 'max-width': '700px',
    });
    await clearAndSet(await freshStyle('city-showcase-label'), 'city-showcase-label', {
      'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
      'letter-spacing': '0.25em', 'text-transform': 'uppercase',
      'opacity': '0', 'margin-bottom': '16px',
    });
    await clearAndSet(await freshStyle('city-showcase-title'), 'city-showcase-title', {
      'font-family': 'DM Serif Display', 'font-size': v['av-text-h2'],
      'line-height': '1.08', 'color': v['av-cream'],
      'margin-bottom': '16px', 'font-weight': '400',
    });
    await clearAndSet(await freshStyle('city-showcase-desc'), 'city-showcase-desc', {
      'font-family': 'DM Sans', 'font-size': v['av-text-body'],
      'line-height': '1.8', 'max-width': '520px',
    });
    await wait(500);

    // Requirements: dark with glass cards + Three.js backdrop
    await clearAndSet(await freshStyle('city-reqs'), 'city-reqs', {
      'position': 'relative', 'overflow-x': 'hidden', 'overflow-y': 'hidden',
      'min-height': '80vh',
    });
    await clearAndSet(await freshStyle('city-reqs-content'), 'city-reqs-content', {
      'max-width': '1100px', 'margin-left': 'auto', 'margin-right': 'auto',
    });
    await clearAndSet(await freshStyle('city-reqs-header'), 'city-reqs-header', {
      'margin-bottom': '64px',
    });
    await clearAndSet(await freshStyle('city-reqs-grid'), 'city-reqs-grid', {
      'display': 'grid', 'grid-template-columns': '1fr 1fr',
      'grid-column-gap': '32px', 'grid-row-gap': '32px',
    });
    await clearAndSet(await freshStyle('glass-card'), 'glass-card', {
      'color': v['av-cream'],
      'border-top-left-radius': v['av-radius'], 'border-top-right-radius': v['av-radius'],
      'border-bottom-left-radius': v['av-radius'], 'border-bottom-right-radius': v['av-radius'],
      'padding-top': '48px', 'padding-bottom': '48px',
      'padding-left': '40px', 'padding-right': '40px',
    });
    await clearAndSet(await freshStyle('glass-card-num'), 'glass-card-num', {
      'font-family': 'DM Sans', 'font-size': v['av-text-xs'],
      'letter-spacing': '0.2em', 'text-transform': 'uppercase',
      'opacity': '0.4', 'margin-bottom': '16px',
    });
    await clearAndSet(await freshStyle('glass-card-title'), 'glass-card-title', {
      'font-family': 'DM Serif Display', 'font-size': '28px',
      'line-height': '1.2', 'font-weight': '400', 'margin-bottom': '14px',
    });
    await clearAndSet(await freshStyle('glass-card-desc'), 'glass-card-desc', {
      'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
      'line-height': '1.7', 'opacity': '0.5',
    });
    await clearAndSet(await freshStyle('glass-card-list'), 'glass-card-list', {
      'padding-left': '0px', 'margin-top': '16px',
      'display': 'flex', 'flex-direction': 'column', 'grid-row-gap': '12px',
    });
    await wait(500);

    await applyCTAStyleProps(v);
  }

  // ═══════════════ BUILD ELEMENTS ═══════════════

  // SECTION 1: HERO — Full-viewport dark with Three.js zoning grid
  log('Building Section 1: Hero...');
  const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
  hero.setTag('section');
  hero.setStyles([cyHero]);
  hero.setAttribute('id', 'city-hero');

  // Canvas wrap (Three.js renders neighborhood grid into this)
  const heroCanvasWrap = hero.append(webflow.elementPresets.DOM);
  heroCanvasWrap.setTag('div');
  heroCanvasWrap.setStyles([cyCanvasWrap]);
  heroCanvasWrap.setAttribute('id', 'hero-canvas');

  // Content overlay
  const heroOverlay = hero.append(webflow.elementPresets.DOM);
  heroOverlay.setTag('div');
  heroOverlay.setStyles([cyContentOverlay, cyHeroContent]);

  // Label
  const heroLabel = heroOverlay.append(webflow.elementPresets.DOM);
  heroLabel.setTag('div');
  heroLabel.setStyles([cyHeroLabel]);
  heroLabel.setTextContent(`// ${data.city}`);
  heroLabel.setAttribute('data-animate', 'fade-up');

  // H1 with char-cascade animation
  const heroH = heroOverlay.append(webflow.elementPresets.DOM);
  heroH.setTag('h1');
  heroH.setStyles([s.headingXL]);
  heroH.setTextContent(`${data.city} ADU Regulations`);
  heroH.setAttribute('data-animate', 'char-cascade');

  // Gold decorative line
  const heroGoldLine = heroOverlay.append(webflow.elementPresets.DOM);
  heroGoldLine.setTag('div');
  heroGoldLine.setStyles([cyHeroGoldLine]);

  // Subtitle
  const heroSub = heroOverlay.append(webflow.elementPresets.DOM);
  heroSub.setTag('p');
  heroSub.setStyles([cyHeroSubtitle]);
  heroSub.setTextContent(data.whyBuild);
  heroSub.setAttribute('data-animate', 'fade-up');

  // Scroll hint
  const scrollHint = hero.append(webflow.elementPresets.DOM);
  scrollHint.setTag('div');
  scrollHint.setStyles([cyHeroScrollHint]);
  scrollHint.setAttribute('data-animate', 'fade-up');

  const scrollHintText = scrollHint.append(webflow.elementPresets.DOM);
  scrollHintText.setTag('span');
  scrollHintText.setTextContent('Scroll');

  const scrollHintLine = scrollHint.append(webflow.elementPresets.DOM);
  scrollHintLine.setTag('div');
  scrollHintLine.setStyles([cyHeroScrollLine]);

  await safeCall('append:hero', () => body.append(hero));
  logDetail('Section 1: Hero appended', 'ok');

  // SECTION 2: REGULATIONS — Warm bg, 2-col info card grid
  log('Building Section 2: Regulations...');
  const regsSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  regsSection.setTag('section');
  regsSection.setStyles([s.section, s.sectionWarm]);
  regsSection.setAttribute('id', 'city-regs');

  // Header: label + heading (centered)
  const regsHeaderDiv = regsSection.append(webflow.elementPresets.DOM);
  regsHeaderDiv.setTag('div');
  regsHeaderDiv.setStyles([cyRegsHeader]);

  const regsLabel = regsHeaderDiv.append(webflow.elementPresets.DOM);
  regsLabel.setTag('div');
  regsLabel.setStyles([s.label]);
  regsLabel.setAttribute('data-animate', 'fade-up');
  const regsLabelTxt = regsLabel.append(webflow.elementPresets.DOM);
  regsLabelTxt.setTag('div');
  regsLabelTxt.setTextContent(`${data.city} ADU Regulations`);

  const regsH = regsHeaderDiv.append(webflow.elementPresets.DOM);
  regsH.setTag('h2');
  regsH.setStyles([s.headingLG]);
  regsH.setTextContent('What You Need to Know');
  regsH.setAttribute('data-animate', 'line-wipe');

  // 6-card regulation grid
  const regsGrid = regsSection.append(webflow.elementPresets.DOM);
  regsGrid.setTag('div');
  regsGrid.setStyles([cyRegsGrid]);

  const regCards = [
    { label: 'Max ADU Size', title: data.costs.typicalSize, desc: `State law permits ADUs up to 1,200 sqft for detached units. ${data.regulations.lotSize}` },
    { label: 'Height Limit', title: data.regulations.height.split('.')[0], desc: data.regulations.height },
    { label: 'Setbacks', title: data.regulations.setbacks.split('.')[0], desc: data.regulations.setbacks },
    { label: 'Parking', title: data.regulations.parking.split('.')[0], desc: data.regulations.parking },
    { label: 'Owner Occupancy', title: data.regulations.ownerOccupancy.split('.')[0], desc: data.regulations.ownerOccupancy },
    { label: 'Fees & Timeline', title: data.permitting.timeline, desc: `Estimated cost ${data.costs.constructionRange}. Permit fees ${data.costs.permitFees}. Impact fees: ${data.costs.impactFees}.` },
  ];

  regCards.forEach((card, i) => {
    const cardEl = regsGrid.append(webflow.elementPresets.DOM);
    cardEl.setTag('div');
    cardEl.setStyles([cyRegCard]);
    cardEl.setAttribute('data-card', String(i));

    const lbl = cardEl.append(webflow.elementPresets.DOM);
    lbl.setTag('div');
    lbl.setStyles([cyRegCardLabel]);
    lbl.setTextContent(card.label);

    const ttl = cardEl.append(webflow.elementPresets.DOM);
    ttl.setTag('div');
    ttl.setStyles([cyRegCardTitle]);
    ttl.setTextContent(card.title);

    const desc = cardEl.append(webflow.elementPresets.DOM);
    desc.setTag('p');
    desc.setStyles([cyRegCardDesc]);
    desc.setTextContent(card.desc);
  });

  await safeCall('append:regulations', () => body.append(regsSection));
  logDetail('Section 2: Regulations appended', 'ok');

  // SECTION 3: CITY SHOWCASE — Full-width image with gradient overlay
  log('Building Section 3: City Showcase...');
  const showcase = webflow.elementBuilder(webflow.elementPresets.DOM);
  showcase.setTag('section');
  showcase.setStyles([cyShowcase]);
  showcase.setAttribute('id', 'city-showcase');

  // Image placeholder — unique combo class per city so each can have its own bg image
  const cityImgStyle = await getOrCreateStyle(`city-img-${data.slug}`);
  const showcasePlaceholder = showcase.append(webflow.elementPresets.DOM);
  showcasePlaceholder.setTag('div');
  showcasePlaceholder.setStyles([cyShowcasePlaceholder, cityImgStyle]);

  // Gradient overlay
  const showcaseOverlay = showcase.append(webflow.elementPresets.DOM);
  showcaseOverlay.setTag('div');
  showcaseOverlay.setStyles([cyShowcaseOverlay]);

  // Text content
  const showcaseContent = showcase.append(webflow.elementPresets.DOM);
  showcaseContent.setTag('div');
  showcaseContent.setStyles([cyShowcaseContent]);

  const showcaseLbl = showcaseContent.append(webflow.elementPresets.DOM);
  showcaseLbl.setTag('div');
  showcaseLbl.setStyles([cyShowcaseLabel]);
  showcaseLbl.setTextContent(`${data.city}, California`);
  showcaseLbl.setAttribute('data-animate', 'fade-up');

  const showcaseH = showcaseContent.append(webflow.elementPresets.DOM);
  showcaseH.setTag('h2');
  showcaseH.setStyles([cyShowcaseTitle]);
  showcaseH.setTextContent(`Building ADUs in ${data.city}`);
  showcaseH.setAttribute('data-animate', 'line-wipe');

  const showcaseDescEl = showcaseContent.append(webflow.elementPresets.DOM);
  showcaseDescEl.setTag('p');
  showcaseDescEl.setStyles([cyShowcaseDesc]);
  showcaseDescEl.setTextContent(data.showcaseDesc || data.overview);
  showcaseDescEl.setAttribute('data-animate', 'fade-up');

  await safeCall('append:showcase', () => body.append(showcase));
  logDetail('Section 3: City Showcase appended', 'ok');

  // SECTION 4: REQUIREMENTS — Dark with Three.js backdrop + glass cards
  log('Building Section 4: Requirements...');
  const reqsSection = webflow.elementBuilder(webflow.elementPresets.DOM);
  reqsSection.setTag('section');
  reqsSection.setStyles([s.section, s.sectionDark, cyReqs]);
  reqsSection.setAttribute('id', 'city-reqs');

  // Canvas wrap (Three.js wireframe backdrop)
  const reqsCanvasWrap = reqsSection.append(webflow.elementPresets.DOM);
  reqsCanvasWrap.setTag('div');
  reqsCanvasWrap.setStyles([cyCanvasWrap]);
  reqsCanvasWrap.setAttribute('id', 'reqs-canvas');

  // Content overlay
  const reqsOverlay = reqsSection.append(webflow.elementPresets.DOM);
  reqsOverlay.setTag('div');
  reqsOverlay.setStyles([cyContentOverlay, cyReqsContent]);

  // Header
  const reqsHeaderDiv = reqsOverlay.append(webflow.elementPresets.DOM);
  reqsHeaderDiv.setTag('div');
  reqsHeaderDiv.setStyles([cyReqsHeader]);

  const reqsLabel = reqsHeaderDiv.append(webflow.elementPresets.DOM);
  reqsLabel.setTag('div');
  reqsLabel.setStyles([s.label]);
  reqsLabel.setAttribute('data-animate', 'fade-up');
  const reqsLabelTxt = reqsLabel.append(webflow.elementPresets.DOM);
  reqsLabelTxt.setTag('div');
  reqsLabelTxt.setTextContent('Permit Requirements');

  const reqsH = reqsHeaderDiv.append(webflow.elementPresets.DOM);
  reqsH.setTag('h2');
  reqsH.setStyles([s.headingLG]);
  reqsH.setTextContent(`${data.city} Permit Requirements`);
  reqsH.setAttribute('data-animate', 'line-wipe');

  // 2x2 glass card grid
  const reqsGrid = reqsOverlay.append(webflow.elementPresets.DOM);
  reqsGrid.setTag('div');
  reqsGrid.setStyles([cyReqsGrid]);

  // Build 4 glass cards from permitting + cost data (with bullet lists)
  const glassCards: { num: string; title: string; desc: string; items: string[] }[] = [
    {
      num: '01 / Permitting',
      title: data.permitting.department,
      desc: `We handle all submissions, plan-check corrections, and approvals on your behalf.`,
      items: data.permitting.steps.slice(0, 4).map(s => s.title),
    },
    {
      num: '02 / Timeline',
      title: 'Design to Move-In',
      desc: `From initial consultation to a fully finished, move-in ready ADU in your backyard.`,
      items: [
        `Consultation and site assessment`,
        `Custom design and engineering`,
        `City plan check — ${data.permitting.timeline}`,
        `Construction — 6–8 months`,
        `Final inspection and certificate of occupancy`,
      ],
    },
    {
      num: '03 / Zoning',
      title: `${data.city} Zoning & Setbacks`,
      desc: `${data.city} follows California state ADU guidelines${data.regulations.additionalNotes ? '.' : ' with standard setbacks.'}`,
      items: [
        data.regulations.setbacks.split('.')[0],
        data.regulations.height.split('.')[0],
        `Lot sizes: ${data.regulations.lotSize.split('.')[0]}`,
        data.regulations.parking.split('.')[0],
      ],
    },
    {
      num: '04 / Investment',
      title: data.costs.constructionRange,
      desc: `Full design-build cost including architecture, engineering, permits, and construction.`,
      items: [
        `No hidden fees — fixed-price contracts`,
        `Permit fees: ${data.costs.permitFees}`,
        `Impact fees: ${data.costs.impactFees}`,
        `Rental income: ${data.rental.monthlyRange}`,
      ],
    },
  ];

  glassCards.forEach(card => {
    const cardEl = reqsGrid.append(webflow.elementPresets.DOM);
    cardEl.setTag('div');
    cardEl.setStyles([cyGlassCard]);
    cardEl.setAttribute('data-animate', 'fade-up');

    const numEl = cardEl.append(webflow.elementPresets.DOM);
    numEl.setTag('div');
    numEl.setStyles([cyGlassCardNum]);
    numEl.setTextContent(card.num);

    const titleEl = cardEl.append(webflow.elementPresets.DOM);
    titleEl.setTag('h3');
    titleEl.setStyles([cyGlassCardTitle]);
    titleEl.setTextContent(card.title);

    const descEl = cardEl.append(webflow.elementPresets.DOM);
    descEl.setTag('p');
    descEl.setStyles([cyGlassCardDesc]);
    descEl.setTextContent(card.desc);

    // Bullet list
    const listEl = cardEl.append(webflow.elementPresets.DOM);
    listEl.setTag('ul');
    listEl.setStyles([cyGlassCardList]);
    card.items.forEach(item => {
      const li = listEl.append(webflow.elementPresets.DOM);
      li.setTag('li');
      li.setTextContent(item);
    });
  });

  await safeCall('append:requirements', () => body.append(reqsSection));
  logDetail('Section 4: Requirements appended', 'ok');

  // SECTION 5: CTA
  log('Building Section 5: CTA...');
  await buildCTASection(
    body, v,
    `Start your ${data.city} ADU`,
    'Schedule a Meeting', '/schedule-a-meeting',
    'ADU Cost Calculator', '/adu-cost-estimator',
  );

  // ═══════════════ APPLY STYLES ═══════════════
  await applyStyleProperties();

  log(`${data.city} ADU page built!`, 'success');
  await webflow.notify({ type: 'Success', message: `${data.city} ADU page created!` });
}
