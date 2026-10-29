import { createRequire } from 'module';
import tailwindcss from '@tailwindcss/vite';
import { join, dirname } from 'path';

const require = createRequire(import.meta.url);

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}

/** @type { import('@storybook/nextjs-vite').StorybookConfig } */
const config = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  staticDirs: ['./public'],

  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-designs'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-vitest')
  ],
  framework: {
    name: getAbsolutePath('@storybook/nextjs-vite'),
    options: {}
  },
  typescript: {
    reactDocgen: 'react-docgen',
    reactDocgenOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => {
        if (prop.parent) {
          return !/node_modules/.test(prop.parent.fileName);
        }
        return true;
      }
    }
  },
  viteFinal: async (config) => {
    // @ds/ui is shadcn on Tailwind v4; the plugin compiles stories/ui.css.
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    // shadcn files carry "use client"; Rollup warns on every one. Not an error.
    config.build = config.build ?? {};
    config.build.rollupOptions = config.build.rollupOptions ?? {};
    const prev = config.build.rollupOptions.onwarn;
    config.build.rollupOptions.onwarn = (warning, warn) => {
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
      if (prev) prev(warning, warn);
      else warn(warning);
    };
    config.resolve.conditions = [
      'development',
      ...(config.resolve.conditions ?? [])
    ];
    return config;
  }
};
export default config;
