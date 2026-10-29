import React from 'react';
import { create } from 'storybook/theming';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import brandManifest from './public/brands/index.json';

/* ------------------------------------------------------------------ */
/* Brand switcher                                                      */
/*                                                                     */
/* `public/brands/index.json` is written by `npm run build:brands`     */
/* (tools/controller/cli/build-brands.mjs), one entry per file under  */
/* brands/. Each brand ships its own variables.css, and the decorator  */
/* swaps the stylesheet the preview-head links, so every story is      */
/* re-themed without a rebuild.                                        */
/* ------------------------------------------------------------------ */

const brandItems = (brandManifest.brands || []).map((b) => ({
  value: b.slug,
  title:
    b.name + (b.contrastFailures ? ` · ${b.contrastFailures} contrast ⚠` : ''),
  right: b.primary
}));

const GOOGLE_FONT_WEIGHTS = ':wght@400;500;600;700;800';
function fontsHref(brand) {
  const fams = [
    ...new Set([brand.headingFont, brand.bodyFont].filter(Boolean))
  ].filter((f) => f !== 'Inter'); // Inter is self-hosted in preview-head
  if (!fams.length) return '';
  return (
    'https://fonts.googleapis.com/css2?' +
    fams
      .map(
        (f) =>
          'family=' +
          encodeURIComponent(f).replace(/%20/g, '+') +
          GOOGLE_FONT_WEIGHTS
      )
      .join('&') +
    '&display=swap'
  );
}

let appliedBrand = null;
function applyBrand(slug) {
  if (!slug || slug === appliedBrand) return;
  const entry = (brandManifest.brands || []).find((b) => b.slug === slug);
  if (!entry) return;
  const css = document.getElementById('prism-brand-css');
  if (css) css.setAttribute('href', `./brands/${slug}/variables.css`);
  const fonts = document.getElementById('prism-brand-fonts');
  if (fonts) {
    const href = fontsHref(entry);
    if (href) fonts.setAttribute('href', href);
    else fonts.removeAttribute('href');
  }
  appliedBrand = slug;
}

const docsLightTheme = create({
  base: 'light',
  fontBase: '"Inter", system-ui, -apple-system, sans-serif',
  fontCode:
    '"IBM Plex Mono", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
  colorPrimary: '#005C8A',
  colorSecondary: '#000000',
  appContentBg: '#ffffff',
  textColor: '#1a1a1a',
  textMutedColor: '#404040'
});

/** @type { import('@storybook/nextjs-vite').Preview } */
const preview = {
  globalTypes: {
    brand: {
      description: 'Brand (white-label theme)',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: brandItems,
        dynamicTitle: true
      }
    },
    colorMode: {
      description: 'Colour mode',
      toolbar: {
        title: 'Mode',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' }
        ],
        dynamicTitle: true
      }
    }
  },

  initialGlobals: {
    brand:
      brandManifest.active || (brandItems[0] && brandItems[0].value) || 'prism',
    colorMode: 'light'
  },

  decorators: [
    (Story, context) => {
      const brand = context.globals.brand;
      const mode = context.globals.colorMode === 'dark' ? 'dark' : 'light';
      if (typeof document !== 'undefined') {
        applyBrand(brand);
        document.documentElement.setAttribute('data-color-mode', mode);
        document.documentElement.setAttribute('data-theme', 'core');
        document.documentElement.setAttribute('data-brand', brand || '');
        document.body?.setAttribute('data-color-mode', mode);
        document.body?.setAttribute('data-theme', 'core');
        document.body?.setAttribute('data-brand', brand || '');
      }

      return Story();
    }
  ],

  parameters: {
    options: {
      storySort: {
        /**
         * Storybook Navigation IA (single control point)
         *
         * L1 = top-level sections/pages
         * L2 = children of an L1 section
         * L3 = children of an L2 subsection
         *
         * Note: "Introduction" is both an L1 item and a standalone page.
         */
        order: [
          // L1 — standalone page
          'Foundations',
          [
            // L2 (Foundations children)
            'Design Tokens',
            'Tokens MCP',
            '*'
          ],

          // L1 — standalone page
          'Introduction',

          // L1 — section
          'Theme',
          [
            // L2 (Theme children)
            'Grid',

            // L2 — subsection
            'Color Palette',
            [
              // L3 (Theme > Color Palette children)
              'Core',
              'Accents',
              '*'
            ],

            // L2 — subsection
            'Typography',
            [
              // L3 (Theme > Typography children)
              'Base',
              'Composed',
              '*'
            ],
            '*'
          ],

          // L1 — section
          'Components',
          [
            // L2 (Components children)
            'Button',
            'Divider',
            'Input',
            'IconButton',
            'Link',
            'Text',
            '*'
          ],

          // Keep any unmatched stories at the end
          '*'
        ],
        method: 'configure',
        locales: 'en-US'
      }
    },

    viewport: {
      options: {
        small: {
          name: 'small (0-767px)',
          styles: {
            width: '767px',
            height: '1024px'
          },
          type: 'mobile'
        },
        medium: {
          name: 'medium (768-1023px)',
          styles: {
            width: '1023px',
            height: '1024px'
          },
          type: 'tablet'
        },
        large: {
          name: 'large (1024-1439px)',
          styles: {
            width: '1439px',
            height: '1024px'
          },
          type: 'desktop'
        },
        xlarge: {
          name: 'xlarge (1440-∞px)',
          styles: {
            width: '1440px',
            height: '1024px'
          },
          type: 'desktop'
        }
      }
    },

    // The canvas is painted from the brand's surface tokens (preview-head.html), so
    // the Backgrounds addon would fight the Mode switcher; keep it off.
    backgrounds: { disable: true },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },

    docs: {
      container: (props) =>
        React.createElement(DocsContainer, {
          ...props,
          theme: docsLightTheme
        })
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  }
};

export default preview;
