export type ReplaceField<T, K extends keyof T, N> =
  Omit<T, K> & { [P in K]: N };