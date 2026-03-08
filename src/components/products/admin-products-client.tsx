"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "@/features/products/actions";
import { productSchema, type ProductFormData } from "@/features/products/schema";
import { formatPrice, getSafeImage } from "@/lib/utils";
import type { Product, Category } from "@/features/products/types";

interface Props {
  products: Product[];
  categories: Category[];
  initialSearch?: string;
}

export function AdminProductsClient({
  products: initial,
  categories,
  initialSearch = "",
}: Props) {
  const PAGE_SIZE = 10;
  const [products, setProducts] = useState(initial);
  const [search, setSearch] = useState(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const { accessToken } = useAuthStore();

  const filtered = products.filter((p) => {
    const keyword = search.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(keyword) ||
      p.category.name.toLowerCase().includes(keyword);
    const matchesCategory =
      categoryFilter === "all" || String(p.category.id) === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const openCreate = () => {
    setEditProduct(null);
    form.reset({ title: "", price: 0, description: "", categoryId: 0, imageFile: undefined });
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    form.reset({
      title: product.title,
      price: product.price,
      description: product.description,
      categoryId: product.category.id,
      imageFile: undefined,
    });
    setModalOpen(true);
  };

  const onSubmit = form.handleSubmit(async (data) => {
    if (!accessToken) {
      setError("You must be logged in as admin to manage products.");
      return;
    }
    setError("");
    try {
      const selectedFile = data.imageFile?.[0] as File | undefined;
      let imageUrl = editProduct?.images?.[0] ?? "";

      if (selectedFile) {
        imageUrl = await uploadProductImage(selectedFile, accessToken);
      }

      if (!imageUrl) {
        setError("Please upload an image before submitting.");
        return;
      }

      const payload = {
        title: data.title,
        price: data.price,
        description: data.description,
        categoryId: data.categoryId,
        images: [imageUrl],
      };
      if (editProduct) {
        const updated = await updateProduct(editProduct.id, payload, accessToken);
        setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const created = await createProduct(payload, accessToken);
        setProducts([created, ...products]);
      }
      setModalOpen(false);
    } catch {
      setError("Operation failed. Make sure you have admin privileges.");
    }
  });

  const handleDelete = async (id: number) => {
    if (!accessToken) return;
    try {
      await deleteProduct(id, accessToken);
      setProducts(products.filter((p) => p.id !== id));
      setDeleteId(null);
    } catch {
      setError("Delete failed.");
    }
  };

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="relative min-w-48 flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <Button onClick={openCreate} size="sm">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        {error && (
          <div className="mx-5 mt-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted text-left text-xs text-muted-foreground">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium text-right">Price</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-muted/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={getSafeImage(p.images)}
                          alt={p.title}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <span className="max-w-xs truncate font-medium text-foreground">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant="info">{p.category.name}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-indigo-600">
                    {formatPrice(p.price)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">No products found</div>
        )}

        {filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-5 py-4">
            <p className="text-xs text-muted-foreground">
              Showing {start + 1}-{Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-xs font-semibold text-foreground">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editProduct ? "Edit Product" : "Add Product"}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}
          <Input
            label="Title"
            placeholder="Product title"
            {...form.register("title")}
            error={form.formState.errors.title?.message}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Price ($)"
              type="number"
              step="0.01"
              {...form.register("price", { valueAsNumber: true })}
              error={form.formState.errors.price?.message}
            />
            <Select
              label="Category"
              options={categoryOptions}
              placeholder="Select category"
              {...form.register("categoryId", { valueAsNumber: true })}
              error={form.formState.errors.categoryId?.message}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.description.message}</p>
            )}
          </div>
          <Input
            label="Product Image"
            type="file"
            accept="image/*"
            {...form.register("imageFile")}
            error={String(form.formState.errors.imageFile?.message ?? "")}
          />
          {editProduct && (
            <p className="text-xs text-gray-500">
              Leave empty to keep current image.
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={form.formState.isSubmitting} className="flex-1">
              {editProduct ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete Product"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to delete this product? This action cannot be undone.</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => deleteId && handleDelete(deleteId)} className="flex-1">
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
