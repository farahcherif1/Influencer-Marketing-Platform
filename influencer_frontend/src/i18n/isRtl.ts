const rtlLanguages = ['ar', 'he', 'fa', 'ur'];

export function isRtl(lang: string): boolean {
  return rtlLanguages.includes(lang);
}
