module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Background tiers
        bg: {
          DEFAULT: '#101114', // main app bg
          surface: '#181a1f', // card/surface
          popover: '#23252b', // popover/modal
        },
        // Text tiers
        text: {
          DEFAULT: '#e6eef8',
          muted: '#9aa3b2',
          subtle: '#6b7280',
        },
        // Action/semantic
        primary: {
          DEFAULT: '#7c3aed',
          hover: '#602db0',
          focus: '#492389',
        },
        accent: {
          DEFAULT: '#06b6d4',
          hover: '#0891b2',
        },
        success: {
          DEFAULT: '#22c55e',
          bg: '#1e3a2a',
        },
        warning: {
          DEFAULT: '#f59e42',
          bg: '#3b2f1e',
        },
        danger: {
          DEFAULT: '#ef4444',
          bg: '#3b1818',
        },
        border: {
          DEFAULT: '#23272f',
          subtle: '#23272f80',
        },
        // Brand palette (for gradients, etc)
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
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto'],
      },
      fontSize: {
        xs: ['0.875rem', { lineHeight: '1.5' }], // 14px
        sm: ['1rem', { lineHeight: '1.5' }],     // 16px
        base: ['1.125rem', { lineHeight: '1.5' }], // 18px
        lg: ['1.25rem', { lineHeight: '1.5' }],  // 20px
        xl: ['1.5rem', { lineHeight: '1.2' }],   // 24px
        '2xl': ['2rem', { lineHeight: '1.2' }],  // 32px
        '3xl': ['2.5rem', { lineHeight: '1.2' }],// 40px
      },
      spacing: {
        1: '0.25rem',  // 4px
        2: '0.5rem',   // 8px
        3: '0.75rem',  // 12px
        4: '1rem',     // 16px
        5: '1.25rem',  // 20px
        6: '1.5rem',   // 24px
        8: '2rem',     // 32px
        10: '2.5rem',  // 40px
        12: '3rem',    // 48px
        16: '4rem',    // 64px
        20: '5rem',    // 80px
        24: '6rem',    // 96px
        32: '8rem',    // 128px
        40: '10rem',   // 160px
        48: '12rem',   // 192px
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(16,24,40,0.04)',
        md: '0 4px 16px 0 rgba(16,24,40,0.10)',
        lg: '0 8px 32px 0 rgba(16,24,40,0.16)',
        focus: '0 0 0 3px rgba(124,58,237,0.25)',
      },
      lineHeight: {
        tight: '1.2',
        snug: '1.3',
        normal: '1.5',
        relaxed: '1.7',
      },
      maxWidth: {
        'prose': '70ch',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'slide-down': 'slide-down 160ms cubic-bezier(.2,.9,.2,1) both',
        shimmer: 'shimmer 1.6s linear infinite'
      },
    },
  },
  plugins: [],
}
