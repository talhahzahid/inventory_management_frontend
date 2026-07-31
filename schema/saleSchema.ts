import { z } from "zod";

const saleItemSchema = z.object({
  product_id: z.string().min(1, "Please select a product"),
  quantity: z
    .number({ error: "Quantity is required" })
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
  unit_price: z
    .number({ error: "Unit price is required" })
    .min(0, "Unit price must be 0 or greater"),
});

export const createSaleSchema = z.object({
  customer_name: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  items: z.array(saleItemSchema).min(1, "Add at least one product"),
});

export type CreateSaleFormValues = z.infer<typeof createSaleSchema>;
