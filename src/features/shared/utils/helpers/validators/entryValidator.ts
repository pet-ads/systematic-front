export const hasUppercase = (value: string): boolean => /[A-Z]/.test(value);

export const hasNumber = (value: string): boolean => /[0-9]/.test(value);

export const hasSpecialCharacter = (value: string): boolean =>
  /[!@#$%^&*(),.?":{}|<>]/.test(value);

export const hasWhiteSpace = (value: string): boolean => /\s/.test(value);

export const hasSizeWithinValidRange = (
  value: string,
  min: number,
  max: number
): boolean => value.length >= min && value.length <= max;

export function hasSQLInjectionChars(input: string): boolean {
  if (!input) return false;
  const s = input.toLowerCase();

  const highConfidence: RegExp[] = [
    /\b(drop|truncate|alter|create)\s+table\b/,         
    /\b(delete)\s+from\b/,                              
    /\b(insert)\s+into\b/,                              
    /\b(update)\s+\w+\s+set\b/,                           
    /\bunion\s+select\b/,                                 
    /\b(or|and)\b\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?/, 
    /--|\/\*|\*\/|#/,                    
    /\b(load_file|into\s+outfile|information_schema|pg_catalog|xp_)/,
  ];

  for (const rx of highConfidence) {
    if (rx.test(s)) return true;
  }

  return false;
}