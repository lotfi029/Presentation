import { z } from 'zod'

export const voucherSchema = z.object({
  voucherNumber: z.string().min(1),
  createdAt: z.string().min(1),
  itemId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
  price: z.coerce.number().min(0),
  manufacturerId: z.coerce.number().int().positive(),
  unitId: z.coerce.number().int().positive(),
  projectId: z.coerce.number().int().positive(),
  voucherType: z.enum(['import', 'export']),
  notes: z.string().optional(),
})

export const itemSchema = z.object({
  name: z.string().min(1),
  itemCode: z.string().min(1),
  quantity: z.coerce.number().int().min(0),
  minQuantity: z.coerce.number().int().min(0),
  maxQuantity: z.coerce.number().int().min(1),
})

export const projectSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
})

export const simpleNameSchema = z.object({
  name: z.string().min(1),
})
