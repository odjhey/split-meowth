import { ExpenseModule } from "../models/Expense";
import { generateReport } from "../libs/expense-report";

type AddExpenseInput = {
  description: string;
  amount: number;
  // TODO currency: string;
};

const init = () => {
  const trip = ExpenseModule.create({});
  const groupId = trip.addGroup([]);

  return {
    ui: {
      expenses: () => trip.getExpenses(),
      reports: () =>
        generateReport({
          expenses: trip.getExpenses(),
          settlements: trip.getSettlements(),
        }),
      addExpense: (input: AddExpenseInput) =>
        trip.addExpense({ groupId: groupId, ...input }),
      addSettlement: (input: {
        expenseId: string;
        paidBy: string;
        sharedBy: { [key: string]: number };
      }) => trip.addSettlement(input),
    },
  } as const;
};

export { init };
