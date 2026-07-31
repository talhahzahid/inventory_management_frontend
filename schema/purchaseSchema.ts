import { z } from "zod";

const purchaseItemSchema = z.object({
  product_id: z.string().min(1, "Please select a product"),
  quantity: z
    .number({ error: "Quantity is required" })
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
  unit_cost: z
    .number({ error: "Unit cost is required" })
    .min(0, "Unit cost must be 0 or greater"),
});

export const createPurchaseSchema = z.object({
  supplier_id: z.string().min(1, "Please select a supplier"),
  notes: z.string().trim().optional(),
  items: z.array(purchaseItemSchema).min(1, "Add at least one product"),
});

export type CreatePurchaseFormValues = z.infer<typeof createPurchaseSchema>;
