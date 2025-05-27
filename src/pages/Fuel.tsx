
import CategoryPage from "@/components/CategoryPage";
import { Fuel } from "lucide-react";

const FuelPage = () => {
  return (
    <CategoryPage
      title="דלק"
      icon={Fuel}
      color="bg-gradient-to-br from-orange-400 to-red-500"
      storageKey="fuel-expenses"
    />
  );
};

export default FuelPage;
