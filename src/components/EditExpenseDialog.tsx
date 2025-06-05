
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  amount: number;
  date: string;
  month: string;
  note?: string;
}

interface EditExpenseDialogProps {
  expense: Expense;
  onSave: (expenseId: string, amount: number, note?: string) => void;
  onCancel: () => void;
}

const EditExpenseDialog = ({ expense, onSave, onCancel }: EditExpenseDialogProps) => {
  const { toast } = useToast();
  const [amount, setAmount] = useState(expense.amount.toString());
  const [note, setNote] = useState(expense.note || "");

  const handleSave = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "שגיאה",
        description: "אנא הזן סכום תקין",
        variant: "destructive",
      });
      return;
    }

    onSave(expense.id, numAmount, note.trim() || undefined);
    onCancel();
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-md mx-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">ערוך הוצאה</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              סכום (ש״ח)
            </label>
            <Input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg p-3 border-2 border-slate-300 focus:border-blue-500"
              dir="ltr"
              placeholder="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              הערה (אופציונלי)
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="text-base p-3 border-2 border-slate-300 focus:border-blue-500 resize-none"
              rows={3}
              placeholder="למה הוצאת את הכסף?"
            />
          </div>
          
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="px-6 py-2"
            >
              ביטול
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
            >
              שמור
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditExpenseDialog;
