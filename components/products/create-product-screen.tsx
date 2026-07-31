"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { UiButton } from "@/components/Button";
import { CreateProductLoader } from "@/components/products/create-product-loader";
import { ProductFormFields } from "@/components/products/product-form-fields";
import { ProductInventoryFormFields } from "@/components/products/product-inventory-form-fields";
import { fetchCategoriesList } from "@/lib/categories";
import { createProduct } from "@/lib/products";
import { fetchSuppliersList } from "@/lib/suppliers";
import {
  addProductSchema,
  type AddProductFormValues,
  type EditProductFormValues,
} from "@/schema/productSchema";

const defaultValues: AddProductFormValues = {
  name: "",
  sku: "",
  category_id: "",
  supplier_id: "",
  purchase_price: 0,
  selling_price: 0,
  status: "active",
  quantity: 0,
  minimum_stock: 0,
  maximum_stock: 100,
  description: "",
  warehouse_location: "",
};

type CreateProductScreenProps = {
  backHref?: string;
  productsHref?: string;
};

export function CreateProductScreen({
  backHref = "/company/products",
  productsHref = "/company/products",
}: CreateProductScreenProps) {
  const router = useRouter();
  const [isBootLoading, setIsBootLoading] = useState(true);
  const [categoryOptions, setCategoryOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [supplierOptions, setSupplierOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddProductFormValues>({
    resolver: zodResolver(addProductSchema),
    defaultValues,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadOptions() {
      try {
        const [categoriesResult, suppliersResult] = await Promise.all([
          fetchCategoriesList({ page: 1, limit: 100, status: "active" }),
          fetchSuppliersList({ page: 1, limit: 100, status: "active" }),
        ]);

        if (cancelled) return;

        setCategoryOptions(
          categoriesResult.categories.map((category) => ({
            label: category.name,
            value: category.id,
          }))
        );
        setSupplierOptions(
          suppliersResult.suppliers.map((supplier) => ({
            label: supplier.name,
            value: supplier.id,
          }))
        );
      } finally {
        if (!cancelled) {
          setIsBootLoading(false);
        }
      }
    }

    loadOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  const submitForm = handleSubmit(async (values) => {
    try {
      await createProduct(values);
      reset(defaultValues);
      toast.success("Product created successfully", {
        description: `${values.name} has been added to your catalog.`,
      });
      router.push(productsHref);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to create product."
      );
    }
  });

  if (isBootLoading) {
    return <CreateProductLoader />;
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
            New Item
          </span>
          <h1>Create Product</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Add a new product to your inventory catalog with pricing, stock, and
            supplier details.
          </p>
        </div>

        <Link href={backHref}>
          <UiButton variant="outline" buttonText="Back" icon={ArrowLeft} />
        </Link>
      </section>

      <form
        className="surface-card space-y-8 p-6"
        onSubmit={submitForm}
        noValidate
      >
        <ProductFormFields
          register={
            register as unknown as UseFormRegister<EditProductFormValues>
          }
          control={control as unknown as Control<EditProductFormValues>}
          errors={errors as FieldErrors<EditProductFormValues>}
          categoryOptions={categoryOptions}
          supplierOptions={supplierOptions}
        />
        <ProductInventoryFormFields register={register} errors={errors} />
      </form>

      <div className="flex justify-end gap-2">
        <Link href={backHref}>
          <UiButton
            type="button"
            variant="outline"
            buttonText="Cancel"
            disabled={isSubmitting}
          />
        </Link>
        <UiButton
          type="button"
          variant="primary"
          disabled={isSubmitting}
          onClick={submitForm}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Product"
          )}
        </UiButton>
      </div>
    </div>
  );
}
