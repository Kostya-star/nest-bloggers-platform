export function getISOFromUnixSeconds(unix: number): string {
  return new Date(unix * 1000).toISOString();
}
