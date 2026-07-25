import { describe, it, expect } from 'vitest';
import { formatPrice, slugify } from './format';

describe('formatPrice', () => {
  it('formata valor em reais brasileiros', () => {
    expect(formatPrice(49.9)).toBe('R$\xa049,90');
  });
});

describe('slugify', () => {
  it('converte texto com acentos e espaços em slug', () => {
    expect(slugify('Camiseta Básica')).toBe('camiseta-basica');
  });

  it('remove hífens no início e no fim', () => {
    expect(slugify('-teste-')).toBe('teste');
  });
});
