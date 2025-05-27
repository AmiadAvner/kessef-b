
import CategoryPage from "@/components/CategoryPage";
import { Home } from "lucide-react";

const EssentialPage = () => {
  return (
    <CategoryPage
      title="הוצאות חיוניות"
      icon={Home}
      color="bg-gradient-to-br from-blue-400 to-indigo-500"
      storageKey="essential-expenses"
    />
  );
};

export default EssentialPage;
