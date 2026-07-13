import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveProduct } from "../actions";
import type { Category, Product } from "@/lib/types";

export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  return (
    <form action={saveProduct} className="flex flex-col gap-4 max-w-xl">
      {product && <input type="hidden" name="id" value={product.id} />}

      <label className="text-sm font-medium">
        Title
        <Input name="title" defaultValue={product?.title} required className="mt-1" />
      </label>

      <label className="text-sm font-medium">
        Description
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          rows={4}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="text-sm font-medium">
          Price (USD)
          <Input name="price" type="number" step="0.01" min="0" defaultValue={product?.price} required className="mt-1" />
        </label>
        <label className="text-sm font-medium">
          Stock
          <Input name="stock" type="number" min="0" defaultValue={product?.stock ?? 0} required className="mt-1" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="text-sm font-medium">
          Category
          <select
            name="category_id"
            defaultValue={product?.category_id}
            required
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm h-9"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Brand (optional)
          <Input name="brand" defaultValue={product?.brand ?? ""} className="mt-1" />
        </label>
      </div>

      <label className="text-sm font-medium">
        Thumbnail image URL
        <Input name="thumbnail" type="url" defaultValue={product?.thumbnail} required className="mt-1" />
      </label>

      <label className="text-sm font-medium">
        Gallery image URLs (one per line)
        <textarea
          name="images"
          defaultValue={product?.images?.join("\n") ?? ""}
          rows={3}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm font-mono"
        />
      </label>

      <Button type="submit" size="lg" className="self-start">
        {product ? "Save Changes" : "Create Product"}
      </Button>
    </form>
  );
}
