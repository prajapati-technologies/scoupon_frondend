// Theme configuration for consistent styling across non-protected routes
export const theme = {
  colors: {
    primary: {
      50: '#f7faf5',
      100: '#edf2e7',
      200: '#dbe4d3',
      300: '#c3d1b5',
      400: '#a0b830', // Main brand color
      500: '#8fa029',
      600: '#7a8a24',
      700: '#5f6e1e',
      800: '#4c5718',
      900: '#3f4714',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  }
};

// Common CSS classes for consistent styling
export const commonClasses = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  card: 'bg-white rounded-lg shadow-md border border-gray-200',
  button: {
    primary: 'bg-[#a0b830] hover:bg-[#8fa029] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200',
    outline: 'border border-[#a0b830] text-[#a0b830] hover:bg-[#a0b830] hover:text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200',
  },
  input: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a0b830] focus:border-transparent',
  heading: {
    h1: 'text-3xl md:text-4xl font-bold text-gray-900',
    h2: 'text-2xl md:text-3xl font-semibold text-gray-800',
    h3: 'text-xl md:text-2xl font-semibold text-gray-800',
  },
  text: {
    body: 'text-gray-700 leading-relaxed',
    muted: 'text-gray-500 text-sm',
    link: 'text-[#a0b830] hover:text-[#8fa029] underline',
  }
};
