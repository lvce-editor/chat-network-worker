export const getHeadersObject = (headers: Readonly<Headers>): Record<string, string> => {
  const result: Record<string, string> = Object.fromEntries(headers)
  return result
}
