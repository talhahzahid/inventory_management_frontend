import { z } from "zod";

export const addProductSchema = z.object({
  name: z.string().trim().min(2, "Product name must be at least 2 characters"),
  sku: z.string().trim().min(3, "SKU must be at least 3 characters"),
  category: z.string().min(1, "Please select a category"),
  supplier: z.string().trim().min(2, "Supplier name is required"),
  price: z.number().min(0, "Price must be 0 or greater"),
  stock: z.number().int().min(0, "Stock must be 0 or greater"),
  status: z.enum(["in_stock", "low_stock", "out_of_stock", "draft"]),
  description: z.string().trim().optional(),
});

export type AddProductFormValues = z.infer<typeof addProductSchema>;
