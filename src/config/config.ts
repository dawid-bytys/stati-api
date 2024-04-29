export function getConfig(key: string) {
  const value = process.env[key]

  if (!value) {
    throw new Error(`Config error: missing environment variable ${key}`)
  }

  return value
}
