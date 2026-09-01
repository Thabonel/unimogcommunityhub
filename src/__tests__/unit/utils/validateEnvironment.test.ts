import { describe, expect, it } from 'vitest';
import { isSupportedSupabaseAnonKey } from '@/utils/validateEnvironment';

describe('isSupportedSupabaseAnonKey', () => {
  it('accepts legacy JWT and current publishable keys', () => {
    expect(isSupportedSupabaseAnonKey('eyJexample')).toBe(true);
    expect(isSupportedSupabaseAnonKey('sb_publishable_example')).toBe(true);
  });

  it('rejects unsupported key formats', () => {
    expect(isSupportedSupabaseAnonKey('sb_publi_example')).toBe(false);
    expect(isSupportedSupabaseAnonKey('example')).toBe(false);
  });
});
