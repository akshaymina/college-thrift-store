module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#7c3aed',
          50: '#f6effb',
          100: '#eedcf6',
          200: '#dfb9ef',
          300: '#c78fe0',
          400: '#9a59cf',
          500: '#7c3aed',
          600: '#602db0',
          700: '#492389',
          800: '#321a60',
          900: '#1f123c',
        },
        darkbg: {
          900: '#0b0d10',
          800: '#111315',
          700: '#1a1d21',
        },
        surface: {
          700: '#141619',
          600: '#181b1f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto'],
      },
      borderRadius: {
        '2xl': '1rem',
      },
      boxShadow: {
        'glow-sm': '0 8px 24px rgba(124,58,237,0.08), inset 0 1px 0 rgba(255,255,255,0.02)',
        'glow-md': '0 20px 40px rgba(16,24,40,0.6), 0 2px 8px rgba(124,58,237,0.08)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
