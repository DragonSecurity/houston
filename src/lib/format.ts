/**
 * Format a number with commas as thousands separators
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value)
}

/**
 * Format a number as currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format a number as a percentage
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100)
}

// Cache for date formatters to improve performance
const dateFormatters = new Map<string, Intl.DateTimeFormat>()

/**
 * Get a cached date formatter
 */
function getDateFormatter(format: string): Intl.DateTimeFormat {
  if (!dateFormatters.has(format)) {
    let options: Intl.DateTimeFormatOptions

    // Parse format string to options
    switch (format) {
      case "short":
        options = { dateStyle: "short" }
        break
      case "medium":
        options = { dateStyle: "medium" }
        break
      case "long":
        options = { dateStyle: "long" }
        break
      case "full":
        options = { dateStyle: "full" }
        break
      case "MMM d":
        options = { month: "short", day: "numeric" }
        break
      case "MMM yyyy":
        options = { month: "short", year: "numeric" }
        break
      case "MM/dd/yyyy":
        options = { month: "2-digit", day: "2-digit", year: "numeric" }
        break
      default:
        options = { dateStyle: "medium" }
    }

    dateFormatters.set(format, new Intl.DateTimeFormat("en-US", options))
  }

  return dateFormatters.get(format)!
}

/**
 * Format a date using Intl.DateTimeFormat
 */
export function formatDate(date: Date | string, format = "medium"): string {
  const d = typeof date === "string" ? new Date(date) : date

  if (format === "yyyy-MM-dd") {
    return d.toISOString().split("T")[0]
  }

  const formatter = getDateFormatter(format)
  return formatter.format(d)
}

// Size units for formatBytes
const SIZE_UNITS = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

/**
 * Format bytes to a human-readable string (KB, MB, GB, etc.)
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${SIZE_UNITS[i]}`
}

/**
 * Format a duration in milliseconds to a human-readable string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`

  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}

/**
 * Format a relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, "second")
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, "minute")
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, "hour")
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return rtf.format(-diffInDays, "day")
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return rtf.format(-diffInMonths, "month")
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return rtf.format(-diffInYears, "year")
}

