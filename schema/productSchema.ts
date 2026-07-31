import { z } from "zod";

const productStatusSchema = z.enum(["active", "inactive"]);

export const addProductSchema = z
  .object({
    category_id: z.string().min(1, "Please select a category"),
    supplier_id: z.string().min(1, "Please select a supplier"),
    sku: z.string().trim().min(3, "SKU must be at least 3 characters"),
    name: z.string().trim().min(2, "Product name must be at least 2 characters"),
    description: z.string().trim().optional(),
    purchase_price: z
      .number({ error: "Purchase price is required" })
      .min(0, "Purchase price must be 0 or greater"),
    selling_price: z
      .number({ error: "Selling price is required" })
      .min(0, "Selling price must be 0 or greater"),
    status: productStatusSchema,
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
  });

export const editProductSchema = z.object({
  category_id: z.string().min(1, "Please select a category"),
  supplier_id: z.string().min(1, "Please select a supplier"),
  sku: z.string().trim().min(3, "SKU must be at least 3 characters"),
  name: z.string().trim().min(2, "Product name must be at least 2 characters"),
  description: z.string().trim().optional(),
  purchase_price: z
    .number({ error: "Purchase price is required" })
    .min(0, "Purchase price must be 0 or greater"),
  selling_price: z
    .number({ error: "Selling price is required" })
    .min(0, "Selling price must be 0 or greater"),
  status: productStatusSchema,
});

export type AddProductFormValues = z.infer<typeof addProductSchema>;
export type EditProductFormValues = z.infer<typeof editProductSchema>;
