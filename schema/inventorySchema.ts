import { z } from "zod";

export const editInventorySchema = z
  .object({
    quantity: z
      .number({ error: "Quantity is required" })
      .int("Quantity must be a whole number")
      .min(0, "Quantity must be 0 or greater"),
    minimum_stock: z
      .number({ error: "Minimum stock is required" })
      .int("Minimum stock must be a whole number")
      .min(0, "Minimum stock must be 0 or greater"),
    maximum_stock: z
      .number({ error: "Maximum stock is required" })
      .int("Maximum stock must be a whole number")
      .min(0, "Maximum stock must be 0 or greater"),
    warehouse_location: z.string().trim().optional(),
  })
  .refine((values) => values.maximum_stock >= values.minimum_stock, {
    message: "Maximum stock must be greater than or equal to minimum stock",
    path: ["maximum_stock"],
  })
  .refine((values) => values.quantity <= values.maximum_stock, {
    message: "Quantity cannot exceed maximum stock",
    path: ["quantity"],
  });

export const adjustInventorySchema = z.object({
  adjustment: z
    .number({ error: "Adjustment is required" })
    .int("Adjustment must be a whole number")
    .refine((value) => value !== 0, "Adjustment cannot be zero"),
});

export type EditInventoryFormValues = z.infer<typeof editInventorySchema>;
export type AdjustInventoryFormValues = z.infer<typeof adjustInventorySchema>;
