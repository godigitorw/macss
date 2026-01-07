import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f3fb',
          100: '#cce7f7',
          200: '#99cfef',
          300: '#66b7e7',
          400: '#339fdf',
          500: '#0F6FB9',
          600: '#0c5994',
          700: '#09436f',
          800: '#062c4a',
          900: '#031625',
        },
        accent: {
          50: '#e6f3fb',
          100: '#cce7f7',
          200: '#99cfef',
          300: '#66b7e7',
          400: '#339fdf',
          500: '#0F6FB8',
          600: '#0c5993',
          700: '#09436e',
          800: '#062c49',
          900: '#031625',
        },
      },
      fontFamily: {
        sans: ['var(--font-roboto)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        manrope: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        roboto: ['var(--font-roboto)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
