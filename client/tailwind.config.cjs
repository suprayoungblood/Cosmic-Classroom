/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cosmic: {
          primary: "#3B82F6", // Modern blue
          secondary: "#10B981", // Fresh teal
          accent: "#F59E0B", // Warm amber
          background: "#111827", // Deep background
          surface: "#1F2937", // Card surface
          border: "#374151", // Border color
          text: {
            primary: "#F9FAFB", // Primary text
            secondary: "#D1D5DB", // Secondary text
            muted: "#9CA3AF", // Muted text
          }
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'cosmic': '0 4px 20px -2px rgba(0, 0, 0, 0.3)',
        'cosmic-lg': '0 10px 30px -3px rgba(0, 0, 0, 0.3)',
        'inner-cosmic': 'inset 0 2px 6px -1px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(120deg, #3B82F6, #10B981)',
        'cosmic-dark': 'linear-gradient(135deg, #111827, #1E293B)',
      },
      animation: {
        'float': 'floating 6s ease-in-out infinite',
        'pulse-slow': 'pulseSlow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        floating: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#F9FAFB',
            a: {
              color: '#3B82F6',
              '&:hover': {
                color: '#60A5FA',
              },
            },
            h1: {
              color: '#F9FAFB',
            },
            h2: {
              color: '#F9FAFB',
            },
            h3: {
              color: '#F9FAFB',
            },
            h4: {
              color: '#F9FAFB',
            },
            h5: {
              color: '#F9FAFB',
            },
            h6: {
              color: '#F9FAFB',
            },
            strong: {
              color: '#F9FAFB',
            },
            code: {
              color: '#F9FAFB',
              backgroundColor: '#1F2937',
              paddingLeft: '0.25rem',
              paddingRight: '0.25rem',
              paddingTop: '0.125rem',
              paddingBottom: '0.125rem',
              borderRadius: '0.25rem',
            },
            blockquote: {
              color: '#D1D5DB',
              borderLeftColor: '#374151',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
});
