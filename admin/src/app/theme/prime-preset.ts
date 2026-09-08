import { definePreset } from '@primeuix/themes';
import Lara from '@primeuix/themes/lara';

/** PrimeNG preset com paleta gold/amber alinhada à marca MyPerson */
export const MyPersonPreset = definePreset(Lara, {
  primitive: {
    gold: {
      50: '#fef9f0',
      100: '#faf0dc',
      200: '#f5e6c4',
      300: '#e8c878',
      400: '#d4a843',
      500: '#c09537',
      600: '#967c44',
      700: '#7a6529',
      800: '#6b5e42',
      900: '#413c33',
      950: '#33312b',
    },
    amber: {
      50: '#fff8f0',
      100: '#ffeed6',
      200: '#ffdea8',
      300: '#f0c050',
      400: '#eaa71b',
      500: '#d69900',
      600: '#b68200',
      700: '#976c00',
      800: '#795600',
      900: '#402d00',
      950: '#261a00',
    },
  },
  semantic: {
    primary: {
      50: '{gold.50}',
      100: '{gold.100}',
      200: '{gold.200}',
      300: '{gold.300}',
      400: '{gold.400}',
      500: '{gold.500}',
      600: '{gold.600}',
      700: '{gold.700}',
      800: '{gold.800}',
      900: '{gold.900}',
      950: '{gold.950}',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#faf8f4',
          100: '#f5f2eb',
          200: '#ece2d1',
          300: '#dcd1bf',
          400: '#c0b6a4',
          500: '#a59b8a',
          600: '#8a8171',
          700: '#706859',
          800: '#585145',
          900: '#413c33',
          950: '#33312b',
        },
      },
      dark: {
        surface: {
          0: '#33312b',
          50: '#3a3630',
          100: '#413c33',
          200: '#4c463c',
          300: '#585145',
          400: '#645d4f',
          500: '#706859',
          600: '#8a8171',
          700: '#a59b8a',
          800: '#c0b6a4',
          900: '#dcd1bf',
          950: '#f8edda',
        },
      },
    },
  },
});
