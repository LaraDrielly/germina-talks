import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3A255B',
        accent: '#27AAE1',
        success: '#11C76F',
        warning: '#DC4405',
        ink: '#3C3F4F',
        surface: '#F5F6F8',
        border: '#E5E7EB',
        'text-muted': '#6B7280',
        'school-business': '#3A255B',
        'school-tech': '#1A1E20',
        'school-factory': '#186B89',
        'school-community': '#001489',
      },
    },
  },
  plugins: [],
};

export default config;
