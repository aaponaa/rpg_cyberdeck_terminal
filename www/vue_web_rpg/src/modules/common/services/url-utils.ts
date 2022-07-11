function removeTrailingSlashes(s: string): string {
    return s.replace(/^\/+/, '').replace(/\/+$/, '')
}

export function joinWithSlash(...parts: string[]): string {
    return parts.map((p) => removeTrailingSlashes(p)).join('/')
}