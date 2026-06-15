export function formatDate(value: string | number | Date | null | undefined): string {
    if (!value && value !== 0) return '';
    const d = new Date(value as any);
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}