export function parseLabel(labelStr: string) {
    const match = labelStr.match(/Label\(name:\s*(.+),\s*value:\s*(\d+)\)/);
    if (match) return { name: match[1], value: Number(match[2]) };
    return null;
}

export function formatAnswerLabel(labelStr: string): string {
    const parsed = parseLabel(labelStr);
    return parsed ? `${parsed.value} - ${parsed.name}` : labelStr;
}