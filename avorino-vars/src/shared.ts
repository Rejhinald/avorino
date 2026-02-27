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
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea';
  placeholder?: string;
  options?: string[];
  halfWidth?: boolean; // pair with next field in 2-col row
}

export function buildCleanForm(
  parent: any,
  fields: FormField[],
  s: Record<string, any>,
  submitText: string = 'Send Message',
) {
  // Use <div> not <form> — Webflow auto-injects default form fields on <form> tags
  const formWrap = parent.append(webflow.elementPresets.DOM);
  formWrap.setTag('div');
  formWrap.setStyles([s.flexCol]);
  formWrap.setAttribute('data-animate', 'fade-up');

  let i = 0;
  while (i < fields.length) {
    const field = fields[i];
    const next = fields[i + 1];

    if (field.halfWidth && next?.halfWidth) {
      const row = formWrap.append(webflow.elementPresets.DOM);
      row.setTag('div');
      row.setStyles([s.formGrid2]);

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
  submitBtn.setStyles([s.submitBtn]);
  submitBtn.setTextContent(submitText);
  submitBtn.setAttribute('type', 'submit');

  return formWrap;
}

function _buildField(parent: any, field: FormField, s: Record<string, any>) {
  const wrap = parent.append(webflow.elementPresets.DOM);
  wrap.setTag('div');

  const label = wrap.append(webflow.elementPresets.DOM);
  label.setTag('label');
  label.setStyles([s.formLabel]);
  label.setTextContent(field.label);

  if (field.type === 'textarea') {
    const el = wrap.append(webflow.elementPresets.DOM);
    el.setTag('textarea');
    el.setStyles([s.textareaClean]);
    el.setAttribute('name', field.name);
    if (field.placeholder) el.setAttribute('placeholder', field.placeholder);
  } else if (field.type === 'select') {
    const el = wrap.append(webflow.elementPresets.DOM);
    el.setTag('select');
    el.setStyles([s.selectClean]);
    el.setAttribute('name', field.name);
  } else {
    const el = wrap.append(webflow.elementPresets.DOM);
    el.setTag('input');
    el.setStyles([s.inputClean]);
    el.setAttribute('type', field.type);
    el.setAttribute('name', field.name);
    if (field.placeholder) el.setAttribute('placeholder', field.placeholder);
  }
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

  // Image placeholder (replace with actual city image in Webflow Designer)
  const showcasePlaceholder = showcase.append(webflow.elementPresets.DOM);
  showcasePlaceholder.setTag('div');
  showcasePlaceholder.setStyles([cyShowcasePlaceholder]);

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

  // Build 4 glass cards from permitting + cost data
  const glassCards = [
    {
      num: '01 / Permitting',
      title: data.permitting.department,
      desc: `${data.permitting.steps.length} steps from application to certificate of occupancy. We handle all submissions and plan-check corrections on your behalf.`,
    },
    {
      num: '02 / Timeline',
      title: 'Design to Move-In',
      desc: `Plan check: ${data.permitting.timeline}. Fees: ${data.permitting.fees}. Contact: ${data.permitting.contact || data.permitting.department}.`,
    },
    {
      num: '03 / Zoning',
      title: data.regulations.setbacks.split('.')[0],
      desc: `${data.regulations.setbacks} Height: ${data.regulations.height}`,
    },
    {
      num: '04 / Investment',
      title: data.costs.constructionRange,
      desc: `Full design-build cost including architecture, engineering, permits, and construction. Typical size: ${data.costs.typicalSize}. Rental: ${data.rental.monthlyRange}.`,
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
