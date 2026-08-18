export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function truncate(str: string, limit: number) {
    if (str.length <= limit) return str;
    return str.slice(0, limit) + '…';
}

