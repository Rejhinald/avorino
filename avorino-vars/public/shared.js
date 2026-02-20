// ════════════════════════════════════════════════════════════════
// Avorino Builder — Shared Helpers
// Imported by each page builder (index-about.ts, index-services.ts, etc.)
// ════════════════════════════════════════════════════════════════
export const webflow = globalThis.webflow;
// ── DOM refs ──
const statusEl = document.getElementById('status');
const errorLogEl = document.getElementById('error-log');
export function log(msg, type = 'info') {
    statusEl.textContent = msg;
    statusEl.className = type;
}
export function logDetail(msg, type = 'info') {
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
export const wait = (ms) => new Promise(r => setTimeout(r, ms));
export const API_DELAY = 150;
// ── Safe API call wrapper: delay + retry + error logging ──
export async function safeCall(label, fn, retries = 2) {
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
        try {
            await wait(API_DELAY);
            const result = await fn();
            return result;
        }
        catch (err) {
            const msg = err?.message || String(err);
            if (attempt <= retries) {
                logDetail(`RETRY ${attempt}/${retries}: ${label} — ${msg}`, 'err');
                await wait(API_DELAY * 3);
            }
            else {
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
        if (name === 'Avorino') {
            col = c;
            break;
        }
    }
    if (!col)
        throw new Error('Avorino variable collection not found. Create variables first.');
    const allVars = await col.getAllVariables();
    const vars = {};
    for (const v of allVars) {
        const name = await v.getName();
        vars[name] = v;
    }
    const loadedNames = Object.keys(vars);
    logDetail(`Loaded ${loadedNames.length} variables: ${loadedNames.join(', ')}`, 'info');
    const missing = EXPECTED_VARS.filter(n => !vars[n]);
    if (missing.length > 0) {
        logDetail(`MISSING ${missing.length} variables: ${missing.join(', ')}`, 'err');
    }
    else {
        logDetail('All expected variables found', 'ok');
    }
    return vars;
}
// ── Style helpers ──
export async function getOrCreateStyle(name) {
    return safeCall(`style:${name}`, async () => {
        const existing = await webflow.getStyleByName(name);
        if (existing)
            return existing;
        return webflow.createStyle(name);
    });
}
export async function setProps(style, name, props) {
    for (const [prop, val] of Object.entries(props)) {
        if (val === undefined || val === null) {
            logDetail(`SKIP ${name}.${prop} — value is ${val}`, 'err');
            continue;
        }
        try {
            await wait(50);
            await style.setProperty(prop, val);
        }
        catch (err) {
            logDetail(`ERR ${name}.${prop} — ${err?.message || err}`, 'err');
        }
    }
}
export async function freshStyle(name) {
    const style = await webflow.getStyleByName(name);
    if (!style)
        throw new Error(`Style "${name}" not found`);
    return style;
}
export async function clearAndSet(style, name, props) {
    try {
        await style.removeAllProperties();
        await wait(200);
    }
    catch (err) {
        logDetail(`WARN clear ${name}: ${err?.message || err}`, 'err');
    }
    await setProps(style, name, props);
}
export async function clearAndSetBatch(style, name, props) {
    try {
        await style.removeAllProperties();
        await wait(200);
    }
    catch (err) {
        logDetail(`WARN clear ${name}: ${err?.message || err}`, 'err');
    }
    try {
        await wait(50);
        await style.setProperties(props);
    }
    catch (err) {
        logDetail(`ERR setProperties ${name}: ${err?.message || err}`, 'err');
    }
}
// ── Shared styles (reused across all pages) ──
export async function createSharedStyles() {
    const styles = {};
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
export async function setSharedStyleProps(styles, v) {
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
    const imgBase = {
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
    const inputBase = {
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
    if (!col)
        throw new Error('Failed to create collection');
    const avDark = await col.createColorVariable('av-dark', '#111111');
    const avCream = await col.createColorVariable('av-cream', '#f0ede8');
    await col.createColorVariable('av-warm', '#e8e4df');
    await col.createColorVariable('av-red', '#c8222a');
    await col.createColorVariable('av-text-dark', avDark);
    await col.createColorVariable('av-text-light', avCream);
    await col.createColorVariable('av-dark-06', 'rgba(17,17,17,0.06)');
    await col.createColorVariable('av-dark-10', 'rgba(17,17,17,0.10)');
    await col.createColorVariable('av-dark-15', 'rgba(17,17,17,0.15)');
    await col.createColorVariable('av-cream-06', 'rgba(240,237,232,0.06)');
    await col.createColorVariable('av-cream-40', 'rgba(240,237,232,0.40)');
    await col.createColorVariable('av-teal', '#2a3f4e');
    await col.createColorVariable('av-brown', '#8b7355');
    await col.createFontFamilyVariable('av-font-display', 'DM Serif Display');
    await col.createFontFamilyVariable('av-font-body', 'DM Sans');
    await col.createSizeVariable('av-section-pad-y', { unit: 'px', value: 128 });
    await col.createSizeVariable('av-section-pad-x', { unit: 'px', value: 80 });
    await col.createSizeVariable('av-page-pad', { unit: 'px', value: 48 });
    await col.createSizeVariable('av-gap-xl', { unit: 'px', value: 128 });
    await col.createSizeVariable('av-gap-lg', { unit: 'px', value: 96 });
    await col.createSizeVariable('av-gap-md', { unit: 'px', value: 64 });
    await col.createSizeVariable('av-gap-sm', { unit: 'px', value: 32 });
    await col.createSizeVariable('av-gap-xs', { unit: 'px', value: 16 });
    await col.createSizeVariable('av-radius', { unit: 'px', value: 8 });
    await col.createSizeVariable('av-radius-pill', { unit: 'px', value: 100 });
    await col.createSizeVariable('av-text-h1', { type: 'custom', value: 'clamp(56px, 7vw, 96px)' });
    await col.createSizeVariable('av-text-h2', { type: 'custom', value: 'clamp(40px, 4.5vw, 64px)' });
    await col.createSizeVariable('av-text-h3', { type: 'custom', value: 'clamp(28px, 3vw, 44px)' });
    await col.createSizeVariable('av-text-body', { unit: 'px', value: 17 });
    await col.createSizeVariable('av-text-sm', { unit: 'px', value: 14 });
    await col.createSizeVariable('av-text-label', { unit: 'px', value: 11 });
    await col.createSizeVariable('av-text-xs', { unit: 'px', value: 10 });
    await col.createSizeVariable('av-btn-pad-y', { unit: 'px', value: 18 });
    await col.createSizeVariable('av-btn-pad-x', { unit: 'px', value: 40 });
    await col.createNumberVariable('av-leading-tight', 1.08);
    await col.createNumberVariable('av-leading-heading', 1.12);
    await col.createNumberVariable('av-leading-body', 1.9);
    await col.createNumberVariable('av-leading-quote', 1.7);
    await col.createNumberVariable('av-opacity-muted', 60);
    await col.createNumberVariable('av-opacity-subtle', 40);
    await col.createNumberVariable('av-opacity-faint', 20);
    await col.createNumberVariable('av-opacity-ghost', 7);
    log('All variables created!', 'success');
    await webflow.notify({ type: 'Success', message: 'Avorino variables created!' });
}
// ── Page creation helpers ──
export async function createPageWithSlug(pageName, slug, title, description) {
    log(`Creating ${pageName} page...`);
    const allItems = await safeCall('getAllPagesAndFolders', () => webflow.getAllPagesAndFolders());
    for (const item of allItems) {
        try {
            const name = await item.getName();
            if (name === pageName) {
                throw new Error(`${pageName} page already exists! Delete it in the Pages panel first, then try again.`);
            }
        }
        catch (e) {
            if (e.message?.includes('already exists'))
                throw e;
        }
    }
    const page = await safeCall('createPage', () => webflow.createPage());
    await safeCall('setName', () => page.setName(pageName));
    await safeCall('setSlug', () => page.setSlug(slug));
    logDetail(`Created new ${pageName} page`, 'ok');
    await safeCall('setTitle', () => page.setTitle(title));
    await safeCall('setDescription', () => page.setDescription(description));
    logDetail('Set page title & description', 'ok');
    await safeCall('switchPage', () => webflow.switchPage(page));
    logDetail(`Switched to ${pageName} page`, 'ok');
    const allElements = await safeCall('getAllElements', () => webflow.getAllElements());
    const body = allElements[0];
    logDetail(`Got body element (${allElements.length} elements on page)`, 'ok');
    return { page, body };
}
// ── Reusable CTA section builder (v7 landing page style) ──
export async function buildCTASection(body, v, heading, btnText, btnHref, btn2Text, btn2Href) {
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
export async function applyCTAStyleProps(v) {
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
export async function buildCalendlySection(body, v, heading = 'Book a Free Consultation') {
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
    await safeCall('append:calendly', () => body.append(section));
    logDetail('Calendly section appended', 'ok');
}
export async function applyCalendlyStyleProps(v) {
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
export function buildCleanForm(parent, fields, s, submitText = 'Send Message') {
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
        }
        else {
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
function _buildField(parent, field, s) {
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
        if (field.placeholder)
            el.setAttribute('placeholder', field.placeholder);
    }
    else if (field.type === 'select') {
        const el = wrap.append(webflow.elementPresets.DOM);
        el.setTag('select');
        el.setStyles([s.selectClean]);
        el.setAttribute('name', field.name);
    }
    else {
        const el = wrap.append(webflow.elementPresets.DOM);
        el.setTag('input');
        el.setStyles([s.inputClean]);
        el.setAttribute('type', field.type);
        el.setAttribute('name', field.name);
        if (field.placeholder)
            el.setAttribute('placeholder', field.placeholder);
    }
}
export async function buildCityPage(data) {
    const v = await getAvorinVars();
    logDetail('Loaded Avorino variable collection', 'ok');
    log('Creating shared styles...');
    const s = await createSharedStyles();
    // ── City page styles (v2: reduced from ~25 to ~15 styles) ──
    log('Creating city page styles...');
    const cyHero = await getOrCreateStyle('cy-hero');
    const cyHeroContent = await getOrCreateStyle('cy-hero-content');
    const cyOverview = await getOrCreateStyle('cy-overview');
    const cyRegRow = await getOrCreateStyle('cy-reg-row');
    const cyRegLabel = await getOrCreateStyle('cy-reg-label');
    const cyRegValue = await getOrCreateStyle('cy-reg-value');
    const cyStepRow = await getOrCreateStyle('cy-step-row');
    const cyStepNumCol = await getOrCreateStyle('cy-step-num-col');
    const cyStepNum = await getOrCreateStyle('cy-step-num');
    const cyStepContent = await getOrCreateStyle('cy-step-content');
    const cyStepTitle = await getOrCreateStyle('cy-step-title');
    const cyStepDesc = await getOrCreateStyle('cy-step-desc');
    const cyPermitMeta = await getOrCreateStyle('cy-permit-meta');
    // ── Create page ──
    const { body } = await createPageWithSlug(`${data.city} ADU`, data.slug, data.title, data.seoDesc);
    // ── Style properties ──
    async function applyStyleProperties() {
        log('Setting shared style properties...');
        await setSharedStyleProps(s, v);
        await wait(1000);
        log('Setting city page style properties...');
        // Hero: split layout (text left, image right)
        await clearAndSet(await freshStyle('cy-hero'), 'cy-hero', {
            'display': 'grid', 'grid-template-columns': '1.5fr 1fr',
            'grid-column-gap': '96px', 'grid-row-gap': '64px', 'align-items': 'center',
            'min-height': '70vh',
            'padding-top': '160px', 'padding-bottom': v['av-section-pad-y'],
            'padding-left': v['av-section-pad-x'], 'padding-right': v['av-section-pad-x'],
            'background-color': v['av-dark'], 'color': v['av-cream'],
        });
        await clearAndSet(await freshStyle('cy-hero-content'), 'cy-hero-content', {
            'max-width': '640px',
        });
        await wait(500);
        // Overview paragraph (centered, max-width)
        await clearAndSet(await freshStyle('cy-overview'), 'cy-overview', {
            'font-family': 'DM Sans', 'font-size': v['av-text-body'],
            'line-height': '1.9', 'opacity': '0.6', 'max-width': '800px',
            'margin-bottom': '64px',
        });
        // Regulation definition rows (label left, value right)
        await clearAndSet(await freshStyle('cy-reg-row'), 'cy-reg-row', {
            'display': 'grid', 'grid-template-columns': '200px 1fr',
            'grid-column-gap': '48px', 'align-items': 'baseline',
            'padding-top': '24px', 'padding-bottom': '24px',
        });
        await clearAndSet(await freshStyle('cy-reg-label'), 'cy-reg-label', {
            'font-family': 'DM Sans', 'font-size': v['av-text-label'],
            'letter-spacing': '0.3em', 'text-transform': 'uppercase',
            'opacity': '0.3',
        });
        await clearAndSet(await freshStyle('cy-reg-value'), 'cy-reg-value', {
            'font-family': 'DM Sans', 'font-size': v['av-text-body'],
            'line-height': '1.7',
        });
        await wait(500);
        // Permitting steps (vertical numbered list)
        await clearAndSet(await freshStyle('cy-step-row'), 'cy-step-row', {
            'display': 'grid', 'grid-template-columns': '80px 1fr',
            'grid-column-gap': '24px',
            'padding-top': '32px', 'padding-bottom': '32px',
        });
        await clearAndSet(await freshStyle('cy-step-num-col'), 'cy-step-num-col', {
            'display': 'flex', 'align-items': 'flex-start', 'justify-content': 'center',
        });
        await clearAndSet(await freshStyle('cy-step-num'), 'cy-step-num', {
            'font-family': 'DM Serif Display',
            'font-size': 'clamp(40px, 4vw, 56px)',
            'line-height': '1', 'font-weight': '400', 'opacity': '0.15',
        });
        await clearAndSet(await freshStyle('cy-step-content'), 'cy-step-content', {
            'display': 'flex', 'flex-direction': 'column',
        });
        await clearAndSet(await freshStyle('cy-step-title'), 'cy-step-title', {
            'font-family': 'DM Serif Display', 'font-size': v['av-text-h3'],
            'line-height': '1.12', 'font-weight': '400', 'margin-bottom': '12px',
        });
        await clearAndSet(await freshStyle('cy-step-desc'), 'cy-step-desc', {
            'font-family': 'DM Sans', 'font-size': v['av-text-body'],
            'line-height': '1.9', 'opacity': '0.6',
        });
        // Permit metadata (inline, muted)
        await clearAndSet(await freshStyle('cy-permit-meta'), 'cy-permit-meta', {
            'font-family': 'DM Sans', 'font-size': v['av-text-sm'],
            'opacity': '0.4', 'text-align': 'center', 'margin-top': '24px',
        });
        await wait(500);
        await applyCTAStyleProps(v);
    }
    // ═══════════════ BUILD ELEMENTS ═══════════════
    // SECTION 1: HERO (dark, split: text left + image right)
    log('Building Section 1: Hero...');
    const hero = webflow.elementBuilder(webflow.elementPresets.DOM);
    hero.setTag('section');
    hero.setStyles([cyHero]);
    hero.setAttribute('id', 'cy-hero');
    // Left: text
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
    heroH.setAttribute('data-animate', 'word-stagger-elastic');
    const heroSub = heroC.append(webflow.elementPresets.DOM);
    heroSub.setTag('p');
    heroSub.setStyles([s.body, s.bodyMuted]);
    heroSub.setTextContent(data.whyBuild);
    heroSub.setAttribute('data-animate', 'fade-up');
    // Right: tall image placeholder
    const heroImg = hero.append(webflow.elementPresets.DOM);
    heroImg.setTag('div');
    heroImg.setStyles([s.imgTall]);
    heroImg.setAttribute('data-animate', 'parallax-depth');
    await safeCall('append:hero', () => body.append(hero));
    logDetail('Section 1: Hero appended', 'ok');
    // SECTION 2: OVERVIEW + REGULATIONS (cream bg, definition-list rows)
    log('Building Section 2: Overview + Regulations...');
    const regsSection = webflow.elementBuilder(webflow.elementPresets.DOM);
    regsSection.setTag('section');
    regsSection.setStyles([s.section, s.sectionCream]);
    regsSection.setAttribute('id', 'cy-regulations');
    // Overview paragraph
    const overP = regsSection.append(webflow.elementPresets.DOM);
    overP.setTag('p');
    overP.setStyles([cyOverview]);
    overP.setTextContent(data.overview);
    overP.setAttribute('data-animate', 'fade-up');
    // Section heading
    const regsH = regsSection.append(webflow.elementPresets.DOM);
    regsH.setTag('h2');
    regsH.setStyles([s.headingLG]);
    regsH.setTextContent('Zoning & requirements');
    regsH.setAttribute('data-animate', 'fade-up');
    // Regulation definition rows with dividers
    const regItems = [
        { label: 'Setbacks', value: data.regulations.setbacks },
        { label: 'Height', value: data.regulations.height },
        { label: 'Parking', value: data.regulations.parking },
        { label: 'Lot Size', value: data.regulations.lotSize },
        { label: 'Owner Occupancy', value: data.regulations.ownerOccupancy },
    ];
    if (data.regulations.additionalNotes) {
        regItems.push({ label: 'Additional Notes', value: data.regulations.additionalNotes });
    }
    regItems.forEach((reg, i) => {
        // Divider between rows
        if (i > 0) {
            const div = regsSection.append(webflow.elementPresets.DOM);
            div.setTag('div');
            div.setStyles([s.divider]);
        }
        const row = regsSection.append(webflow.elementPresets.DOM);
        row.setTag('div');
        row.setStyles([cyRegRow]);
        row.setAttribute('data-animate', 'fade-up');
        const lbl = row.append(webflow.elementPresets.DOM);
        lbl.setTag('div');
        lbl.setStyles([cyRegLabel]);
        lbl.setTextContent(reg.label);
        const val = row.append(webflow.elementPresets.DOM);
        val.setTag('div');
        val.setStyles([cyRegValue]);
        val.setTextContent(reg.value);
    });
    await safeCall('append:regulations', () => body.append(regsSection));
    logDetail('Section 2: Overview + Regulations appended', 'ok');
    // SECTION 3: PERMITTING (warm bg, vertical numbered list)
    log('Building Section 3: Permitting...');
    const permitSection = webflow.elementBuilder(webflow.elementPresets.DOM);
    permitSection.setTag('section');
    permitSection.setStyles([s.section, s.sectionWarm]);
    permitSection.setAttribute('id', 'cy-permitting');
    const permitH = permitSection.append(webflow.elementPresets.DOM);
    permitH.setTag('h2');
    permitH.setStyles([s.headingLG]);
    permitH.setTextContent(`How to permit your ADU in ${data.city}`);
    permitH.setAttribute('data-animate', 'fade-up');
    // Steps as vertical numbered list (large number left, content right)
    data.permitting.steps.forEach((step, i) => {
        if (i > 0) {
            const div = permitSection.append(webflow.elementPresets.DOM);
            div.setTag('div');
            div.setStyles([s.divider]);
        }
        const row = permitSection.append(webflow.elementPresets.DOM);
        row.setTag('div');
        row.setStyles([cyStepRow]);
        row.setAttribute('data-animate', 'fade-up');
        const numCol = row.append(webflow.elementPresets.DOM);
        numCol.setTag('div');
        numCol.setStyles([cyStepNumCol]);
        const num = numCol.append(webflow.elementPresets.DOM);
        num.setTag('div');
        num.setStyles([cyStepNum]);
        num.setTextContent(String(i + 1).padStart(2, '0'));
        const content = row.append(webflow.elementPresets.DOM);
        content.setTag('div');
        content.setStyles([cyStepContent]);
        const title = content.append(webflow.elementPresets.DOM);
        title.setTag('h3');
        title.setStyles([cyStepTitle]);
        title.setTextContent(step.title);
        const desc = content.append(webflow.elementPresets.DOM);
        desc.setTag('p');
        desc.setStyles([cyStepDesc]);
        desc.setTextContent(step.desc);
    });
    // Permit details as inline metadata
    const metaParts = [
        data.permitting.department,
        `Fees: ${data.permitting.fees}`,
        `Timeline: ${data.permitting.timeline}`,
    ];
    const permitMeta = permitSection.append(webflow.elementPresets.DOM);
    permitMeta.setTag('p');
    permitMeta.setStyles([cyPermitMeta]);
    permitMeta.setTextContent(metaParts.join(' \u2022 '));
    permitMeta.setAttribute('data-animate', 'fade-up');
    await safeCall('append:permitting', () => body.append(permitSection));
    logDetail('Section 3: Permitting appended', 'ok');
    // SECTION 4: CTA
    log('Building Section 4: CTA...');
    await buildCTASection(body, v, `Get your ${data.city} ADU estimate`, 'ADU Cost Calculator', '/adu-cost-estimator', 'Schedule a Meeting', '/schedule-a-meeting');
    // ═══════════════ APPLY STYLES ═══════════════
    await applyStyleProperties();
    log(`${data.city} ADU page built!`, 'success');
    await webflow.notify({ type: 'Success', message: `${data.city} ADU page created!` });
}
