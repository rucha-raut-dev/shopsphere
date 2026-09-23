import Link from "next/link";
import { FolderX } from "lucide-react";

export default function CategoryNotFound() {
  return (
    <div className="container-page flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FolderX className="h-7 w-7 text-muted-foreground" />
      </div>
      <h1 className="font-serif text-2xl font-medium text-foreground">
        Category not found
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        This category doesn&apos;t exist. Take a look at our full category list.
      </p>
      <Link
        href="/categories"
        className="mt-6 inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
      >
        View Categories
      </Link>
    </div>
  );
}
