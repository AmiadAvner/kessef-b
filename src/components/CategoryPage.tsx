import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowRight, Plus, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LucideIcon } from "lucide-react";

interface Expense {
  id: string;
  amount: number;
  date: string;
  month: string;
}

interface CategoryPageProps {
  title: string;
  icon: LucideIcon;
  color: string;
  storageKey: string;
}

const CategoryPage = ({ title, icon: IconComponent, color, storageKey }: CategoryPageProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const savedExpenses = localStorage.getItem(storageKey);
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, [storageKey]);

  const addExpense = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "שגיאה",
        description: "אנא הזן סכום תקין",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: numAmount,
      date: now.toLocaleDateString("he-IL"),
      month: now.toLocaleDateString("he-IL", { year: 'numeric', month: 'long' })
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    localStorage.setItem(storageKey, JSON.stringify(updatedExpenses));
    setAmount("");

    toast({
      title: "הוספה בוצעה",
      description: `נוספה הוצאה של ₪${numAmount}`,
    });
  };

  const getCurrentMonthTotal = () => {
    const currentMonth = new Date().toLocaleDateString("he-IL", { year: 'numeric', month: 'long' });
    return expenses
      .filter(expense => expense.month === currentMonth)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getMonthlyTotals = () => {
    const monthlyTotals: { [key: string]: number } = {};
    expenses.forEach(expense => {
      monthlyTotals[expense.month] = (monthlyTotals[expense.month] || 0) + expense.amount;
    });
    return Object.entries(monthlyTotals).sort().reverse();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="ml-4 hover:bg-slate-200"
          >
            <ArrowRight size={20} />
          </Button>
          <div className="flex items-center space-x-reverse space-x-3">
            <div className={`p-3 rounded-full ${color} text-white`}>
              <IconComponent size={24} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
          </div>
        </div>

        {/* Current Month Total */}
        <Card className="p-6 mb-6 bg-white border-2 border-slate-200">
          <div className="text-center">
            <p className="text-slate-600 mb-2">סה"כ החודש הנוכחי</p>
            <p className="text-3xl font-bold text-slate-800">₪{getCurrentMonthTotal().toLocaleString()}</p>
          </div>
        </Card>

        {/* Add Expense Form */}
        <Card className="p-6 mb-6 bg-white border-2 border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
            <Plus size={20} className="ml-2" />
            הוסף הוצאה חדשה
          </h2>
          <div className="flex gap-3">
            <Input
              type="number"
              placeholder="סכום בש״ח"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addExpense()}
              className="flex-1 text-lg p-3 border-2 border-slate-300 focus:border-blue-500"
              dir="ltr"
            />
            <Button 
              onClick={addExpense}
              className={`${color} hover:opacity-90 text-white px-6 py-3 text-lg`}
            >
              הוסף
            </Button>
          </div>
        </Card>

        {/* Monthly Summary */}
        <Card className="p-6 bg-white border-2 border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
            <Calendar size={20} className="ml-2" />
            סיכום חודשי
          </h2>
          {getMonthlyTotals().length === 0 ? (
            <p className="text-slate-500 text-center py-8">עדיין לא נוספו הוצאות</p>
          ) : (
            <div className="space-y-3">
              {getMonthlyTotals().map(([month, total]) => (
                <div 
                  key={month}
                  className="flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <span className="font-medium text-slate-700">{month}</span>
                  <span className="font-bold text-slate-800">₪{total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CategoryPage;
