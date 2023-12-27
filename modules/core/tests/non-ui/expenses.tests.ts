import t from "tap";
import { ExpenseModule } from "../../src/models/Expense";
import { generateReport } from "../../src/libs/expense-report";

t.test("expense", async (t) => {
  // Creating an ExpenseGroup and adding expenses

  const root = ExpenseModule.create({
    groups: [],
    settlements: [],
  });

  root.addGroup([
    {
      amount: 100,
      description: "Dinner",
    },
    {
      amount: 100,
      description: "Dinner 2",
    },
    {
      amount: 20,
      description: "Dinner 3",
    },
  ]);

  root.addSettlement({
    expenseId: "Dinner",
    paidBy: "John",
    sharedBy: { John: 50, jane: 50, jack: 0 },
  });

  root.addSettlement({
    expenseId: "Dinner 2",
    paidBy: "John",
    sharedBy: { John: 0, jane: 50 },
  });

  root.addSettlement({
    expenseId: "Dinner 3",
    paidBy: "John",
    sharedBy: { John: 20, jane: 0 },
  });

  root.printSummary();

  console.log(
    generateReport({
      expenses: root.getExpenses(),
      settlements: root.getSettlements(),
    })
  );
});
