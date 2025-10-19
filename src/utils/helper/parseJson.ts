/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
export function parseJsonData(data: any): Record<string, any> {
  if (!data) return {};

  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.warn('Invalid JSON format in data');
      return {};
    }
  }

  // already parsed or normal object
  return data;
}
