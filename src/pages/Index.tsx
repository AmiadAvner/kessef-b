
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Fuel, ShoppingCart, Gift, Home } from "lucide-react";
import { useState, useEffect } from "react";

interface Expense {
  id: string;
  amount: number;
  date: string;
  month: string;
  note?: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [monthlyTotals, setMonthlyTotals] = useState<{[key: string]: number}>({});

  const categories = [
    {
      title: "דלק",
      icon: Fuel,
      path: "/fuel",
      color: "bg-gradient-to-br from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600",
      storageKey: "fuel-expenses"
    },
    {
      title: "סופר",
      icon: ShoppingCart,
      path: "/grocery",
      color: "bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600",
      storageKey: "grocery-expenses"
    },
    {
      title: "מותרות",
      icon: Gift,
      path: "/luxury",
      color: "bg-gradient-to-br from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600",
      storageKey: "luxury-expenses"
    },
    {
      title: "הוצאות חיוניות",
      icon: Home,
      path: "/essential",
      color: "bg-gradient-to-br from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600",
      storageKey: "essential-expenses"
    }
  ];

  useEffect(() => {
    const currentMonth = new Date().toLocaleDateString("he-IL", { year: 'numeric', month: 'long' });
    const totals: {[key: string]: number} = {};

    categories.forEach(category => {
      const savedExpenses = localStorage.getItem(category.storageKey);
      if (savedExpenses) {
        const expenses: Expense[] = JSON.parse(savedExpenses);
        const monthlyTotal = expenses
          .filter(expense => expense.month === currentMonth)
          .reduce((sum, expense) => sum + expense.amount, 0);
        totals[category.storageKey] = monthlyTotal;
      } else {
        totals[category.storageKey] = 0;
      }
    });

    setMonthlyTotals(totals);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 pb-safe" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-safe pt-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">מעקב הוצאות</h1>
          <p className="text-base md:text-lg text-slate-600">ניהול פשוט והוצאות חודשיות</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const monthlyTotal = monthlyTotals[category.storageKey] || 0;
            return (
              <Card 
                key={category.path}
                className="p-0 overflow-hidden border-2 border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-lg cursor-pointer transform hover:scale-105 touch-manipulation"
                onClick={() => navigate(category.path)}
              >
                <div className={`${category.color} p-6 md:p-8 text-white transition-all duration-300`}>
                  <div className="flex flex-col items-center text-center space-y-3 md:space-y-4">
                    <IconComponent size={40} className="md:size-12 drop-shadow-lg" />
                    <div>
                      <h2 className="text-lg md:text-2xl font-bold drop-shadow-sm mb-1">{category.title}</h2>
                      <p className="text-sm md:text-base opacity-90 drop-shadow-sm">
                        החודש: ₪{monthlyTotal.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <p className="text-slate-500 text-sm">בחר קטגוריה להתחלת מעקב הוצאות</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
