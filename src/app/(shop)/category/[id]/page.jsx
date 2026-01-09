import { Suspense } from "react";
import CategoryProducts from "./categoryproducts";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CategoryProducts />
    </Suspense>
  );
}