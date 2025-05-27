
import CategoryPage from "@/components/CategoryPage";
import { Gift } from "lucide-react";

const LuxuryPage = () => {
  return (
    <CategoryPage
      title="מותרות"
      icon={Gift}
      color="bg-gradient-to-br from-purple-400 to-pink-500"
      storageKey="luxury-expenses"
    />
  );
};

export default LuxuryPage;
