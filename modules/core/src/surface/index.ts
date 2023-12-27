import { types } from "mobx-state-tree";

type AddExpenseInput = {
  name: string;
  total: number;
  // TODO currency: string;
};

const Expense = types.model({
  name: types.string,
  total: types.number,
  // TODO currency: types.string,
});
const Ui = types
  .model({
    expenses: types.array(Expense),
  })
  .views((self) => ({}))
  .actions((self) => ({
    addExpense(input: AddExpenseInput) {
      self.expenses.push(input);
    },
  }));

const init = () => {
  const ui = Ui.create({});

  return {
    ui: {
      hello: () => "world",
      expenses: () => ui.expenses,
      addExpense: (input: AddExpenseInput) => ui.addExpense(input),
    },
  } as const;
};

export { init };
