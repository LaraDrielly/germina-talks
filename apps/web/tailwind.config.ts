import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3A255B',
        accent: '#27AAE1',
        success: '#11C76F',
        warning: '#DC4405',
        ink: '#3C3F4F',
        surface: '#F5F6F8',
      },
    },
  },
  plugins: [],
};

export default config;
