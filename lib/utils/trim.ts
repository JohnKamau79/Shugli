export function clean(value: unknown) {
    return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}