export function getAriaCurrent(
  pathname: string,
  href: string,
  sectionPath?: string,
): 'page' | 'location' | undefined {
  const currentPath = pathname.replace(/\/$/, '')
  if (currentPath === href.replace(/\/$/, '')) return 'page'
  if (sectionPath) {
    const section = sectionPath.replace(/\/$/, '')
    if (currentPath === section || currentPath.startsWith(`${section}/`)) {
      return 'location'
    }
  }
  return undefined
}
