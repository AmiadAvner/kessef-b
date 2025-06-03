
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

interface BudgetGoalProps {
  goal: number;
  current: number;
  color: string;
}

const BudgetGoal = ({ goal, current, color }: BudgetGoalProps) => {
  const remaining = Math.max(0, goal - current);
  const progressPercentage = Math.min(100, (current / goal) * 100);
  const isOverBudget = current > goal;

  return (
    <Card className="p-4 md:p-6 mb-6 bg-white border-2 border-slate-200">
      <div className="text-center">
        <div className="flex items-center justify-center mb-3">
          <Target size={20} className="ml-2 text-slate-600" />
          <h3 className="text-lg md:text-xl font-semibold text-slate-800">יעד חודשי</h3>
        </div>
        
        <div className="mb-4">
          <p className="text-slate-600 text-sm md:text-base mb-1">יעד: ₪{goal.toLocaleString()}</p>
          <p className="text-slate-600 text-sm md:text-base mb-1">נוצל: ₪{current.toLocaleString()}</p>
          <p className={`text-sm md:text-base font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
            {isOverBudget ? `חריגה: ₪${(current - goal).toLocaleString()}` : `נותר: ₪${remaining.toLocaleString()}`}
          </p>
        </div>

        <div className="space-y-2">
          <Progress 
            value={progressPercentage} 
            className={`h-3 ${isOverBudget ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'}`}
          />
          <p className={`text-xs md:text-sm ${isOverBudget ? 'text-red-600' : 'text-slate-600'}`}>
            {progressPercentage.toFixed(0)}% מהיעד
          </p>
        </div>
      </div>
    </Card>
  );
};

export default BudgetGoal;
