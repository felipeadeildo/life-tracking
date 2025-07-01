import type { Tables, TablesInsert, TablesUpdate } from './database'

// Tipos derivados para facilitar o uso
export type WeightEntry = Tables<'weight_entries'>
export type WeightEntryInsert = TablesInsert<'weight_entries'>
export type WeightEntryUpdate = TablesUpdate<'weight_entries'>