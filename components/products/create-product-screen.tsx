"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { UiButton } from "@/components/Button";
import { CreateProductLoader } from "@/components/products/create-product-loader";
import { ProductFormFields } from "@/components/products/product-form-fields";
import { createProduct } from "@/lib/products";
import {
  addProductSchema,
  type AddProductFormValues,
} from "@/schema/productSchema";

const defaultValues: AddProductFormValues = {
  name: "",
  sku: "",
  category: "",
  supplier: "",
  price: 0,
  stock: 0,
  status: "draft",
  description: "",
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
    const timer = window.setTimeout(() => setIsBootLoading(false), 500);
    return () => window.clearTimeout(timer);
  }, []);

  const submitForm = handleSubmit(async (values) => {
    await createProduct(values);
    reset(defaultValues);
    router.push(productsHref);
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
          register={register}
          control={control}
          errors={errors}
        />
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
