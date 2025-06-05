
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowRight, Plus, Calendar, Trash2, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LucideIcon } from "lucide-react";
import BudgetGoal from "./BudgetGoal";
import EditExpenseDialog from "./EditExpenseDialog";

interface Expense {
  id: string;
  amount: number;
  date: string;
  month: string;
  note?: string;
}

interface CategoryPageProps {
  title: string;
  icon: LucideIcon;
  color: string;
  storageKey: string;
  showBudgetGoal?: boolean;
  budgetGoal?: number;
}

const CategoryPage = ({ title, icon: IconComponent, color, storageKey, showBudgetGoal = false, budgetGoal = 0 }: CategoryPageProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

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
      month: now.toLocaleDateString("he-IL", { year: 'numeric', month: 'long' }),
      note: note.trim() || undefined
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    localStorage.setItem(storageKey, JSON.stringify(updatedExpenses));
    setAmount("");
    setNote("");

    toast({
      title: "הוספה בוצעה",
      description: `נוספה הוצאה של ₪${numAmount}`,
    });
  };

  const editExpense = (expenseId: string, updatedAmount: number, updatedNote?: string) => {
    const updatedExpenses = expenses.map(expense => 
      expense.id === expenseId 
        ? { ...expense, amount: updatedAmount, note: updatedNote }
        : expense
    );
    setExpenses(updatedExpenses);
    localStorage.setItem(storageKey, JSON.stringify(updatedExpenses));

    toast({
      title: "הוצאה עודכנה",
      description: `הוצאה עודכנה בהצלחה לסכום של ₪${updatedAmount}`,
    });
  };

  const deleteExpense = (expenseId: string) => {
    const expenseToDelete = expenses.find(expense => expense.id === expenseId);
    if (!expenseToDelete) return;

    const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
    setExpenses(updatedExpenses);
    localStorage.setItem(storageKey, JSON.stringify(updatedExpenses));

    toast({
      title: "הוצאה נמחקה",
      description: `הוצאה של ₪${expenseToDelete.amount} נמחקה בהצלחה`,
    });
  };

  const getCurrentMonthTotal = () => {
    const currentMonth = new Date().toLocaleDateString("he-IL", { year: 'numeric', month: 'long' });
    return expenses
      .filter(expense => expense.month === currentMonth)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getExpensesByMonth = () => {
    const expensesByMonth: { [key: string]: Expense[] } = {};
    expenses.forEach(expense => {
      if (!expensesByMonth[expense.month]) {
        expensesByMonth[expense.month] = [];
      }
      expensesByMonth[expense.month].push(expense);
    });
    
    // Sort months in reverse chronological order and sort expenses within each month by date
    return Object.entries(expensesByMonth)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([month, monthExpenses]) => [
        month, 
        monthExpenses.sort((a, b) => new Date(b.date.split('.').reverse().join('-')).getTime() - new Date(a.date.split('.').reverse().join('-')).getTime())
      ] as [string, Expense[]]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 pb-safe" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* Header - Mobile optimized */}
        <div className="flex items-center mb-6 pt-safe">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="ml-4 hover:bg-slate-200 touch-manipulation"
          >
            <ArrowRight size={20} />
          </Button>
          <div className="flex items-center space-x-reverse space-x-3">
            <div className={`p-3 rounded-full ${color} text-white`}>
              <IconComponent size={24} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{title}</h1>
          </div>
        </div>

        {/* Budget Goal - Show only for luxury category */}
        {showBudgetGoal && (
          <BudgetGoal 
            goal={budgetGoal} 
            current={getCurrentMonthTotal()} 
            color={color}
          />
        )}

        {/* Current Month Total - Mobile optimized */}
        <Card className="p-4 md:p-6 mb-6 bg-white border-2 border-slate-200">
          <div className="text-center">
            <p className="text-slate-600 mb-2 text-sm md:text-base">סה"כ החודש הנוכחי</p>
            <p className="text-2xl md:text-3xl font-bold text-slate-800">₪{getCurrentMonthTotal().toLocaleString()}</p>
          </div>
        </Card>

        {/* Add Expense Form - Mobile optimized */}
        <Card className="p-4 md:p-6 mb-6 bg-white border-2 border-slate-200">
          <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-4 flex items-center">
            <Plus size={20} className="ml-2" />
            הוסף הוצאה חדשה
          </h2>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="number"
                inputMode="decimal"
                placeholder="סכום בש״ח"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 text-lg p-4 border-2 border-slate-300 focus:border-blue-500 touch-manipulation"
                dir="ltr"
              />
              <Button 
                onClick={addExpense}
                className={`${color} hover:opacity-90 text-white px-6 py-4 text-lg touch-manipulation min-h-[48px]`}
              >
                הוסף
              </Button>
            </div>
            <Textarea
              placeholder="הערה (אופציונלי) - למה הוצאת את הכסף?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="text-base p-3 border-2 border-slate-300 focus:border-blue-500 touch-manipulation resize-none"
              rows={2}
            />
          </div>
        </Card>

        {/* Expenses by Month - Mobile optimized */}
        <Card className="p-4 md:p-6 bg-white border-2 border-slate-200">
          <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-4 flex items-center">
            <Calendar size={20} className="ml-2" />
            הוצאות חודשיות
          </h2>
          {getExpensesByMonth().length === 0 ? (
            <p className="text-slate-500 text-center py-8">עדיין לא נוספו הוצאות</p>
          ) : (
            <div className="space-y-6">
              {getExpensesByMonth().map(([month, monthExpenses]) => {
                const monthTotal = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
                return (
                  <div key={month} className="space-y-3">
                    {/* Month header with total */}
                    <div className="flex justify-between items-center p-4 bg-slate-100 rounded-lg">
                      <span className="font-bold text-slate-800 text-base md:text-lg">{month}</span>
                      <span className="font-bold text-slate-800 text-base md:text-lg">₪{monthTotal.toLocaleString()}</span>
                    </div>
                    
                    {/* Individual expenses */}
                    <div className="space-y-2 mr-4">
                      {monthExpenses.map((expense) => (
                        <div 
                          key={expense.id}
                          className="flex justify-between items-start p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-slate-700 text-sm md:text-base">₪{expense.amount.toLocaleString()}</span>
                              <span className="text-slate-500 text-xs md:text-sm">{expense.date}</span>
                            </div>
                            {expense.note && (
                              <p className="text-slate-600 text-xs md:text-sm mt-1 leading-relaxed">{expense.note}</p>
                            )}
                          </div>
                          <div className="flex gap-2 mr-2 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingExpense(expense)}
                              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 touch-manipulation p-2"
                            >
                              <Edit2 size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteExpense(expense.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 touch-manipulation p-2"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Edit Expense Dialog */}
        {editingExpense && (
          <EditExpenseDialog
            expense={editingExpense}
            onSave={editExpense}
            onCancel={() => setEditingExpense(null)}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
