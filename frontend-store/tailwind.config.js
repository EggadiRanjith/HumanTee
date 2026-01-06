/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./app/components/**/*.{js,ts,jsx,tsx}"
  ],

  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      /* ----------------------------------------
         FONT FAMILY
      ---------------------------------------- */
      fontFamily: {
        geist: ["var(--font-geist)", "sans-serif"],
        benzin: ["var(--font-benzin)", "sans-serif"],
      },

      /* ----------------------------------------
         TYPOGRAPHY SCALE
      ---------------------------------------- */
      fontSize: {
        "step--2": "var(--step--2)",
        "step--1": "var(--step--1)",
        "step-0": "var(--step-0)",
        "step-1": "var(--step-1)",
        "step-2": "var(--step-2)",
        "step-3": "var(--step-3)",
        "step-4": "var(--step-4)",
        "step-5": "var(--step-5)",
        "step-6": "var(--step-6)",
        "step-7": "var(--step-7)",
      },

      /* ----------------------------------------
         TRACKING / LETTER SPACING
      ---------------------------------------- */
      letterSpacing: {
        tight: "var(--track-tight)",
        wide: "var(--track-wide)",
        wider: "var(--track-wider)",
      },

      /* ----------------------------------------
         LINE HEIGHT
      ---------------------------------------- */
      lineHeight: {
        tight: "var(--leading-tight)",
        normal: "var(--leading-normal)",
        relaxed: "var(--leading-relaxed)",
      },

      /* ----------------------------------------
         FONT WEIGHTS
      ---------------------------------------- */
      fontWeight: {
        body: "var(--weight-body)",
        heading: "var(--weight-heading)",
        hero: "var(--weight-hero)",
      },

      /* ----------------------------------------
         COLOR SYSTEM (MATCHES globals.css EXACTLY)
      ---------------------------------------- */
      colors: {
        brand: {
          void: "var(--bg-void)",
          dusk: "var(--bg-dusk)",
          oblivion: "var(--bg-oblivion)",
          eclipse: "var(--bg-eclipse)",

          primary: "var(--brand-primary)",
          secondary: "var(--brand-secondary)",

          text: {
            primary: "var(--text-primary)",
            muted: "var(--text-muted)",
            dim: "var(--text-dim)",
          },

          accent: {
            cyan: "var(--accent-cyan)",
            fuchsia: "var(--accent-fuchsia)",
            violet: "var(--accent-violet)",
          },
        },

        semantic: {
          success: "var(--success)",
          warning: "var(--warning)",
          error: "var(--error)",
          info: "var(--info)",
        },
      },

      /* ----------------------------------------
         GRADIENTS / BACKGROUNDS
      ---------------------------------------- */
      backgroundImage: {
        aurora: "var(--gradient-aurora)",
      },

      /* ----------------------------------------
         SPACING SCALE
      ---------------------------------------- */
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
        "4xl": "var(--space-4xl)",
        "5xl": "var(--space-5xl)",
        "6xl": "var(--space-6xl)",
        // Safe area insets for notched devices
        'safe': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },

      /* ----------------------------------------
         RADII
      ---------------------------------------- */
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        max: "var(--radius-max)",
      },

      /* ----------------------------------------
         SHADOWS — ONLY REAL EXISTING VARIABLES
      ---------------------------------------- */
      boxShadow: {
        base: "var(--shadow-base)",
        surface: "var(--shadow-surface)",
        floating: "var(--shadow-floating)",

        "glow-cyan-subtle": "0 0 8px var(--glow-cyan-subtle)",
        "glow-cyan-medium": "0 0 16px var(--glow-cyan-medium)",
        "glow-cyan-intense": "0 0 24px var(--glow-cyan-intense)",

        "glow-fuchsia-subtle": "0 0 8px var(--glow-fuchsia-subtle)",
        "glow-fuchsia-medium": "0 0 16px var(--glow-fuchsia-medium)",
        "glow-fuchsia-intense": "0 0 24px var(--glow-fuchsia-intense)",

        "glow-violet-subtle": "0 0 8px var(--glow-violet-subtle)",
        "glow-violet-medium": "0 0 16px var(--glow-violet-medium)",
        "glow-violet-intense": "0 0 24px var(--glow-violet-intense)",
      },

      /* ----------------------------------------
         ANIMATIONS
      ---------------------------------------- */
      animation: {
        "aurora-move": "auroraMove 20s ease infinite",
        "pulse-text": "pulseText 2s ease-in-out infinite",
        "glow-pulse": "glowPulse var(--glow-pulse-duration) ease-in-out infinite",
        "scroll": "scroll 40s linear infinite",
      },

      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },

      transitionTimingFunction: {
        cinematic: "var(--ease-cinematic-out)",
      },

      transitionDuration: {
        luxury: "var(--luxury-medium)",
      },
    },
  },

  /* ----------------------------------------
     BREAKPOINTS (YOUR CUSTOM SET)
  ---------------------------------------- */
  screens: {
    xs: "20rem",
    sm: "24rem",
    md: "30rem",
    lg: "48rem",
    xl: "64rem",
    "2xl": "80rem",
  },
};
