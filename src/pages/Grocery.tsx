
import CategoryPage from "@/components/CategoryPage";
import { ShoppingCart } from "lucide-react";

const GroceryPage = () => {
  return (
    <CategoryPage
      title="סופר"
      icon={ShoppingCart}
      color="bg-gradient-to-br from-green-400 to-emerald-500"
      storageKey="grocery-expenses"
    />
  );
};

export default GroceryPage;
