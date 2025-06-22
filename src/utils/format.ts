import { dayjs } from 'element-plus'

export const DateFormat = (s: string) => {
  return dayjs(s).format('YYYY-MM-DD HH:mm:ss')
}

export function paramListToDict(list: { key: string; value: string }[]): Record<string, string> {
  const result: Record<string, string> = {}
  for (const item of list) {
    if (item.key) {
      result[item.key] = item.value
    }
  }
  return result
}

export function paramDictToList(dict: Record<string, string>): { key: string; value: string }[] {
  return Object.entries(dict).map(([key, value]) => ({ key, value }))
}
