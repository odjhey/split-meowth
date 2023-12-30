import { toJS } from "mobx";
import { types } from "mobx-state-tree";

// Model for individual expenses
const Expense = types.model("Expense", {
  id: types.identifier,
  amount: types.number,
  description: types.string, // Description of the expense
});

export const ExpenseGroup = types
  .model("ExpenseGroup", {
    id: types.identifier,
    expenses: types.array(Expense),
  })
  .actions((self) => ({
    addExpense: (expense: {
      id: string;
      amount: number;
      description: string;
    }) => {
      self.expenses.push(expense);
    },
  }));

// Model for representing how each expense is settled
const Settlement = types
  .model("Settlement", {
    expenseId: types.reference(Expense),
    paidBy: types.string,
    sharedBy: types.map(types.number), // Maps participant names to their share of the expense
  })
  .views((self) => ({
    s: (): {
      expenseAmount: number;
      paidBy: string;
      sharedBy: Map<string | number, number>;
    } => {
      return {
        expenseAmount: self.expenseId.amount,
        paidBy: self.paidBy,
        sharedBy: self.sharedBy,
      };
    },
  }));

export const ExpenseModule = types
  .model("ExpenseModule", {
    groups: types.array(ExpenseGroup),
    settlements: types.array(Settlement),
  })
  .actions((self) => ({
    addGroup: (expenses: { amount: number; description: string }[]) => {
      const groupId = Date.now().toString();
      self.groups.push({
        id: groupId,
        expenses: expenses.map((e) => ({ ...e, id: e.description })),
      });
      return groupId;
    },

    addExpense: (expense: {
      groupId: string;
      amount: number;
      description: string;
    }) => {
      const group = self.groups.find((g) => g.id === expense.groupId);
      if (!group) {
        throw new Error(`Group with ID ${expense.groupId} not found.`);
      }
      group.addExpense({
        id: expense.description,
        amount: expense.amount,
        description: expense.description,
      });
    },

    addSettlement: (settlement: {
      expenseId: string;
      paidBy: string;
      sharedBy: Record<string, number>;
    }) => {
      self.settlements.push(settlement);
    },
  }))
  .views((self) => ({
    getExpenses: () => {
      return self.groups.flatMap((group) => toJS(group.expenses));
    },
    getSettlements: () => {
      return self.settlements.map((s) => {
        return {
          expenseId: s.expenseId.id,
          paidBy: s.paidBy,
          // TODO: fix for type
          sharedBy: Object.fromEntries(toJS(s.sharedBy)),
        };
      });
    },

    // TODO: DEBUGGGER!
    printSummary: () => {
      self.groups.forEach((group) => {
        console.log("-- group");
        group.expenses.forEach((expense) => {
          console.log("---- expense", JSON.stringify(expense, null, 2));
          const settlements = self.settlements.filter(
            (s) => s.expenseId.id === expense.id
          );
          settlements.forEach((settlement) => {
            console.log(
              "------ settlements",
              JSON.stringify(settlement, null, 2)
            );
          });
        });
      });
    },
  }));
