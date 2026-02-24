# Webflow Designer Extension API Reference

Source: `@webflow/designer-extension-typings@^2.0.27`
Docs: https://developers.webflow.com/designer/reference

---

## CRITICAL: BuilderElement vs Live Element

There are TWO different element types. **Never confuse them.**

### BuilderElement (from `elementBuilder()`)
Created via `webflow.elementBuilder(preset)`. Used to build element trees BEFORE inserting into the page.

```typescript
interface BuilderElement {
  readonly id: ElementId;
  readonly builderElement: boolean;    // always true
  readonly textContent: true;

  getTag(): null | string;
  setTag(tag: string): null;                              // SYNC, returns null
  append(child: ElementPreset<AnyElement>): BuilderElement; // SYNC, returns BuilderElement
  setAttribute(name: string, value: string): null;        // SYNC, returns null
  setStyles(styles: Array<Style>): null;                  // SYNC, returns null
  setTextContent(content: string): null;                  // SYNC, returns null
}
```

**BuilderElement does NOT have:**
- `getChildren()` — does NOT exist
- `getStyles()` — does NOT exist
- `getCustomAttributes()` — does NOT exist
- `before()` / `after()` / `prepend()` — does NOT exist
- `remove()` — does NOT exist

**All BuilderElement methods are SYNCHRONOUS** (no await needed, but won't error if you do).

### Live Element (AnyElement — from `getSelectedElement()`, `append()` on live elements, etc.)
Retrieved from the canvas. Has async methods and full property access.

```typescript
// Live elements have these properties (check before using):
element.children    // boolean — if true, can call getChildren(), append(), prepend()
element.textContent // boolean — if true, can call setTextContent(), getTextContent()
element.styles      // boolean — if true, can call getStyles(), setStyles()
element.type        // string — 'DOM', 'String', 'Heading', 'Image', etc.
```

**Live element methods are ASYNC** (return Promises).

---

## Correct Pattern: Adding text to a child in BuilderElement

```typescript
// WRONG — getChildren() does NOT exist on BuilderElement
const parent = webflow.elementBuilder(webflow.elementPresets.DOM);
parent.append(webflow.elementPresets.DOM).setTag('div');
parent.getChildren()[0].setTextContent('text');  // ERROR!

// CORRECT — store the reference from append()
const parent = webflow.elementBuilder(webflow.elementPresets.DOM);
const child = parent.append(webflow.elementPresets.DOM);
child.setTag('div');
child.setTextContent('text');
```

---

## WebflowApi (global `webflow` object)

### Elements
```typescript
webflow.elementBuilder(preset: ElementPreset<AnyElement>): BuilderElement;
webflow.getSelectedElement(): Promise<null | AnyElement>;
webflow.setSelectedElement(element: AnyElement): Promise<null | AnyElement>;
webflow.getAllElements(): Promise<Array<AnyElement>>;
webflow.getElementSnapshot(element: AnyElement): Promise<null | string>;
webflow.getRootElement(): Promise<null | AnyElement>;
```

### Styles
```typescript
webflow.createStyle(name: string, options?: { parent?: Style }): Promise<Style>;
webflow.getStyleByName(nameOrPath: string | string[]): Promise<null | Style>;
webflow.getAllStyles(): Promise<Array<Style>>;
webflow.removeStyle(style: Style): Promise<null>;
```

### Pages
```typescript
webflow.createPage(): Promise<Page>;
webflow.getCurrentPage(): Promise<Page>;
webflow.getAllPagesAndFolders(): Promise<Array<Page | Folder>>;
webflow.switchPage(page: Page): Promise<null>;
webflow.createPageFolder(): Promise<Folder>;
```

### Variables
```typescript
webflow.getDefaultVariableCollection(): Promise<null | VariableCollection>;
webflow.createVariableCollection(name: string): Promise<VariableCollection>;
webflow.getVariableCollectionById(id: string): Promise<VariableCollection | null>;
webflow.getAllVariableCollections(): Promise<Array<VariableCollection>>;
webflow.removeVariableCollection(id: string): Promise<boolean>;
```

### Components
```typescript
webflow.registerComponent(name: string, root: AnyElement | ElementPreset | Component): Promise<Component>;
webflow.unregisterComponent(component: Component): Promise<null>;
webflow.getAllComponents(): Promise<Array<Component>>;
webflow.enterComponent(instance: ComponentElement): Promise<null>;
webflow.exitComponent(): Promise<null>;
```

### Assets
```typescript
webflow.createAsset(fileBlob: File): Promise<Asset>;
webflow.getAssetById(id: string): Promise<null | Asset>;
webflow.getAllAssets(): Promise<Array<Asset>>;
webflow.getAllAssetFolders(): Promise<Array<AssetFolder>>;
webflow.createAssetFolder(name: string, parentFolderId?: string): Promise<AssetFolder>;
```

### Utilities
```typescript
webflow.getSiteInfo(): Promise<SiteInfo>;
webflow.getMediaQuery(): Promise<BreakpointId>;
webflow.getPseudoMode(): Promise<null | PseudoStateKey>;
webflow.setExtensionSize(size: 'default' | 'compact' | 'comfortable' | 'large' | { width: number; height: number }): Promise<null>;
webflow.closeExtension(): Promise<null>;
webflow.notify(opts: { type: 'Error' | 'Info' | 'Success' | 'Warning'; message: string; dismissAfter?: number }): Promise<void>;
webflow.getIdToken(): Promise<string>;
webflow.canForAppMode(appModes: Array<AppMode>): Promise<Record<AppMode, boolean>>;
```

### Events
```typescript
webflow.subscribe('selectedelement', (element: null | AnyElement) => void): Unsubscribe;
webflow.subscribe('mediaquery', (breakpoint: BreakpointId) => void): Unsubscribe;
webflow.subscribe('currentpage', (page: Page) => void): Unsubscribe;
webflow.subscribe('currentcmsitem', (cmsItemId: null | string) => void): Unsubscribe;
webflow.subscribe('currentappmode', () => void): Unsubscribe;
webflow.subscribe('pseudomode', (pseudoMode: null | PseudoStateKey) => void): Unsubscribe;
```

---

## Style Interface

```typescript
interface Style {
  readonly id: StyleId;

  getName(): Promise<string>;
  getProperties(options?: BreakpointAndPseudo): Promise<PropertyMap>;
  setProperties(props: PropertyMap, options?: BreakpointAndPseudo): Promise<null>;
  getProperty(prop: StyleProperty, options?: BreakpointAndPseudo): Promise<null | string>;
  setProperty(prop: StyleProperty, value: string, options?: BreakpointAndPseudo): Promise<null>;
  removeProperty(prop: StyleProperty, options?: BreakpointAndPseudo): Promise<null>;
  removeProperties(props: Array<StyleProperty>, options?: BreakpointAndPseudo): Promise<null>;
  removeAllProperties(): Promise<null>;
  isComboClass(): boolean;
  getParent(): Promise<Style | null>;

  // Variable modes on styles
  getVariableMode(collection: VariableCollection, options?: BreakpointAndPseudo): Promise<null | VariableMode>;
  setVariableMode(collection: VariableCollection, mode: VariableMode, options?: BreakpointAndPseudo): Promise<null>;
  removeVariableMode(collection: VariableCollection, options?: BreakpointAndPseudo): Promise<null>;
  getVariableModes(options?: BreakpointAndPseudo): Promise<VariableModeStylePropertyMap>;
  setVariableModes(props: VariableModeStylePropertyMap, options?: BreakpointAndPseudo): Promise<null>;
  removeVariableModes(modes: Array<VariableMode>, options?: BreakpointAndPseudo): Promise<null>;
  removeAllVariableModes(options?: BreakpointAndPseudo): Promise<null>;
}
```

### PropertyMap
An object mapping CSS property names to string values:
```typescript
type PropertyMap = {
  'background-color'?: string;
  'font-size'?: string;
  'display'?: string;
  // ... all standard CSS properties as kebab-case strings
};
```

### BreakpointAndPseudo
```typescript
type BreakpointAndPseudo = {
  breakpoint?: BreakpointId;
  pseudo?: PseudoStateKey;
};

type BreakpointId = 'xxl' | 'xl' | 'large' | 'main' | 'medium' | 'small' | 'tiny';

type PseudoStateKey =
  | 'noPseudo' | 'nth-child(odd)' | 'nth-child(even)'
  | 'first-child' | 'last-child' | 'hover' | 'active'
  | 'pressed' | 'visited' | 'focus' | 'focus-visible'
  | 'focus-within' | 'placeholder' | 'empty' | 'before' | 'after';
```

---

## Page Interface

```typescript
interface Page {
  readonly id: PageId;
  readonly type: 'Page';

  getName(): Promise<string>;
  setName(name: string): Promise<null>;
  getSlug(): Promise<string>;
  setSlug(slug: string): Promise<null>;
  getTitle(): Promise<string>;
  setTitle(title: string | null): Promise<null>;
  getDescription(): Promise<string>;
  setDescription(description: string | null): Promise<null>;
  isDraft(): Promise<boolean>;
  setDraft(isDraft: boolean): Promise<null>;
  isHomepage(): Promise<boolean>;
  isPasswordProtected(): Promise<boolean>;
  getPublishPath(): Promise<null | string>;
  getKind(): Promise<'static' | 'ecommerce' | 'cms' | 'userSystems' | 'utility' | 'staticTemplate'>;
  getParent(): Promise<null | Folder>;
  setParent(parent: Folder): Promise<null>;
  setMetadata(metadata: Partial<PageMetadata>): Promise<null>;

  // SEO
  getSearchTitle(): Promise<string>;
  setSearchTitle(title: string | null): Promise<null>;
  getSearchDescription(): Promise<string>;
  setSearchDescription(description: string | null): Promise<null>;
  getSearchImage(): Promise<string>;
  setSearchImage(url: string | null): Promise<null>;
  usesTitleAsSearchTitle(): Promise<boolean>;
  useTitleAsSearchTitle(use: boolean): Promise<null>;
  usesDescriptionAsSearchDescription(): Promise<boolean>;
  useDescriptionAsSearchDescription(use: boolean): Promise<null>;
  usesOpenGraphImageAsSearchImage(): Promise<boolean>;
  useOpenGraphImageAsSearchImage(use: boolean): Promise<null>;
  isExcludedFromSearch(): Promise<boolean>;
  excludeFromSearch(shouldExclude: boolean): Promise<null>;

  // Open Graph
  getOpenGraphTitle(): Promise<string>;
  setOpenGraphTitle(title: string | null): Promise<null>;
  getOpenGraphDescription(): Promise<string>;
  setOpenGraphDescription(description: string | null): Promise<null>;
  getOpenGraphImage(): Promise<null | string>;
  setOpenGraphImage(url: string | null): Promise<null>;
  usesTitleAsOpenGraphTitle(): Promise<boolean>;
  useTitleAsOpenGraphTitle(use: boolean): Promise<null>;
  usesDescriptionAsOpenGraphDescription(): Promise<boolean>;
  useDescriptionAsOpenGraphDescription(use: boolean): Promise<null>;

  // CMS
  getCollectionId(): Promise<null | string>;
  getCollectionName(): Promise<null | string>;
  getUtilityPageKey(): Promise<null | string>;
}
```

---

## Variable Collection Interface

```typescript
interface VariableCollection {
  readonly id: VariableCollectionId;

  getName(): Promise<string>;
  setName(newName: string): Promise<null>;
  getVariable(id: VariableId): Promise<null | Variable>;
  getVariableByName(name: string): Promise<null | Variable>;
  getAllVariables(): Promise<Array<Variable>>;

  createColorVariable(name: string, value: string | ColorVariable | CustomValue): Promise<ColorVariable>;
  createSizeVariable(name: string, value: SizeValue | SizeVariable | CustomValue): Promise<SizeVariable>;
  createNumberVariable(name: string, value: number | NumberVariable | CustomValue): Promise<NumberVariable>;
  createPercentageVariable(name: string, value: number | PercentageVariable | CustomValue): Promise<PercentageVariable>;
  createFontFamilyVariable(name: string, value: string | FontFamilyVariable | CustomValue): Promise<FontFamilyVariable>;

  createVariableMode(name: string): Promise<VariableMode>;
  getVariableModeById(id: VariableModeId): Promise<null | VariableMode>;
  getVariableModeByName(name: string): Promise<null | VariableMode>;
  getAllVariableModes(): Promise<Array<VariableMode>>;
}
```

### Variable Types
All variable types share: `getName()`, `setName()`, `set()`, `get()`, `remove()`, `getBinding()`, `getCSSName()`

```typescript
type Variable = ColorVariable | SizeVariable | FontFamilyVariable | NumberVariable | PercentageVariable;
type SizeValue = { value: number; unit: SizeUnit };
type SizeUnit = 'px' | 'em' | 'rem' | 'vh' | 'vw' | 'dvh' | 'dvw' | 'lvh' | 'lvw' | 'svh' | 'svw' | 'vmax' | 'vmin' | 'ch';
```

---

## Element Presets (127 total)

### Layout & Structure
`DivBlock`, `DOM`, `Grid`, `HFlex`, `QuickStack`, `Row`, `Section`, `VFlex`

### Typography & Content
`Blockquote`, `Heading`, `List`, `ListItem`, `Paragraph`, `RichText`, `TextBlock`

### Navigation & Interactive
`Button`, `DropdownWrapper`, `LightboxWrapper`, `LinkBlock`, `NavbarWrapper`, `Pagination`, `SliderWrapper`, `TabsWrapper`, `TextLink`

### Forms
`FormBlockLabel`, `FormButton`, `FormCheckboxInput`, `FormFileUploadWrapper`, `FormForm`, `FormRadioInput`, `FormReCaptcha`, `FormSelect`, `FormTextarea`, `FormTextInput`

### Media & Embeds
`BackgroundVideoWrapper`, `Facebook`, `HtmlEmbed`, `Image`, `MapWidget`, `Spline`, `Twitter`, `Video`, `YouTubeVideo`

### Pre-built Layouts (43 presets)
Hero: `LayoutHeroHeadingCenter`, `LayoutHeroHeadingLeft`, `LayoutHeroHeadingRight`, `LayoutHeroStack`, `LayoutHeroSubscribeLeft`, `LayoutHeroSubscribeRight`, `LayoutHeroWithoutImage`
Footer: `LayoutFooterDark`, `LayoutFooterLight`, `LayoutFooterSubscribe`
Gallery: `LayoutGalleryOverview`, `LayoutGalleryScroll`, `LayoutGallerySlider`
Features: `LayoutFeaturesList`, `LayoutFeaturesMetrics`, `LayoutFeaturesTable`
Logos: `LayoutLogosQuoteBlock`, `LayoutLogosQuoteDivider`, `LayoutLogosTitleLarge`, `LayoutLogosTitleSmall`, `LayoutLogosWithoutTitle`
Navbar: `LayoutNavbarLogoCenter`, `LayoutNavbarLogoLeft`, `LayoutNavbarNoShadow`
Pricing: `LayoutPricingComparison`, `LayoutPricingItems`, `LayoutPricingOverview`
Team: `LayoutTeamCircles`, `LayoutTeamSlider`
Testimonial: `LayoutTestimonialColumnDark`, `LayoutTestimonialColumnLight`, `LayoutTestimonialImageLeft`, `LayoutTestimonialSliderLarge`, `LayoutTestimonialSliderSmall`, `LayoutTestimonialStack`
QuickStack: `StructureLayoutQuickStack1plus2`, `StructureLayoutQuickStack1x1`, `StructureLayoutQuickStack2plus1`, `StructureLayoutQuickStack2x1`, `StructureLayoutQuickStack2x2`, `StructureLayoutQuickStack3x1`, `StructureLayoutQuickStack4x1`, `StructureLayoutQuickStackMasonry`

### E-Commerce (15 presets)
`CommerceAddToCartWrapper`, `CommerceCartQuickCheckoutActions`, `CommerceCartWrapper`, `CommerceCheckoutAdditionalInfoSummaryWrapper`, `CommerceCheckoutAdditionalInputsContainer`, `CommerceCheckoutCustomerInfoSummaryWrapper`, `CommerceCheckoutDiscounts`, `CommerceCheckoutFormContainer`, `CommerceCheckoutOrderItemsWrapper`, `CommerceCheckoutOrderSummaryWrapper`, `CommerceCheckoutPaymentSummaryWrapper`, `CommerceCheckoutShippingSummaryWrapper`, `CommerceDownloadsWrapper`, `CommerceOrderConfirmationContainer`, `CommercePayPalCheckoutButton`, `CommercePaypalCheckoutFormContainer`

### CMS & Other
`DynamoWrapper`, `Animation`, `BlockContainer`, `CodeBlock`, `IX2InstanceFactoryOnClass`, `IX2InstanceFactoryOnElement`

### User Accounts
`LogIn`, `ResetPassword`, `SignUp`, `UpdatePassword`, `UserAccount`, `UserAccountSubscriptionList`, `UserLogOutLogIn`

---

## Element Type Methods (Live Elements)

### DOM Element
```typescript
getTag(): Promise<string>;
setTag(tag: string): Promise<null>;
getAllAttributes(): Promise<Array<NamedValue>>;
getAttribute(name: string): Promise<null | NamedValue>;
setAttribute(name: string, value: string): Promise<null>;
removeAttribute(name: string): Promise<null>;
```

### String Element
```typescript
getText(): Promise<string>;
setText(text: string): Promise<null>;
```

### Image Element
```typescript
getAsset(): Promise<null | Asset>;
setAsset(asset: Asset): Promise<null>;
getAltText(): Promise<string>;
setAltText(altText: string): Promise<null>;
```

### Heading Element
```typescript
getHeadingLevel(): Promise<number>;
setHeadingLevel(level: number): Promise<null>;
```

### Link Element
```typescript
getTarget(): Promise<string>;
setSettings(settings: LinkSettings): Promise<null>;
```

---

## Common Patterns for Avorino Builder

### Creating a page with slug
```typescript
const page = await webflow.createPage();
await page.setName('Page Name');
await page.setSlug('page-slug');
await page.setTitle('SEO Title');
await page.setDescription('SEO Description');
await webflow.switchPage(page);
const root = await webflow.getRootElement();
// root is the body — append sections to it
```

### Building element trees
```typescript
const section = webflow.elementBuilder(webflow.elementPresets.DOM);
section.setTag('section');
section.setStyles([myStyle]);
section.setAttribute('id', 'my-section');

// Add a child — store the reference!
const heading = section.append(webflow.elementPresets.DOM);
heading.setTag('h1');
heading.setStyles([headingStyle]);
heading.setTextContent('Hello World');
heading.setAttribute('data-animate', 'fade-up');

// Add to page (live element)
await body.append(section);  // body is a live element, so this is async
```

### Creating and applying styles
```typescript
// Get or create
let style = await webflow.getStyleByName('my-style');
if (!style) style = await webflow.createStyle('my-style');

// Set properties
await style.setProperties({
  'display': 'flex',
  'flex-direction': 'column',
  'padding-top': '24px',
  'background-color': '#111111',
});

// Responsive
await style.setProperties({ 'flex-direction': 'column' }, { breakpoint: 'medium' });

// Apply to builder element
builderEl.setStyles([style]);

// Apply to live element
await liveEl.setStyles([style]);
```
