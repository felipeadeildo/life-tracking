import type { Tables, TablesInsert, TablesUpdate } from './database'

export type MetricEntry = Tables<'metrics'>
export type MetricEntryInsert = TablesInsert<'metrics'>
export type MetricEntryUpdate = TablesUpdate<'metrics'>
export type MetricEnum = Tables<'metrics'>['type']