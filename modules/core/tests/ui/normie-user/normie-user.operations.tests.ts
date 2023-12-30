import t from "tap";
import { init } from "../../../src";

const getStore = () => init();

t.test("add entry, joe and jane went to dinner 2x", async (t) => {
  t.plan(1);
  const store = getStore();
  const ui = store.ui;
  ui.addExpense({ description: "dinner", amount: 100 });
  ui.addExpense({ description: "dinner 2", amount: 90 });

  t.same(ui.expenses(), [
    { id: "dinner", description: "dinner", amount: 100 },
    { id: "dinner 2", description: "dinner 2", amount: 90 },
  ]);
});

t.test(
  "add entry, joe and jane went to dinner 2x, jane wants to settle",
  async (t) => {
    t.plan(2);
    const store = getStore();
    const ui = store.ui;
    ui.addExpense({ description: "dinner", amount: 100 });
    ui.addExpense({ description: "dinner 2", amount: 90 });
    ui.addSettlement({
      expenseId: "dinner",
      paidBy: "jane",
      sharedBy: { joe: 30, jane: 20, jake: 50 },
    });
    ui.addSettlement({
      expenseId: "dinner 2",
      paidBy: "joe",
      sharedBy: { joe: 40, jane: 30, jake: 20 },
    });

    t.same(ui.expenses(), [
      { id: "dinner", description: "dinner", amount: 100 },
      { id: "dinner 2", description: "dinner 2", amount: 90 },
    ]);

    t.same(ui.reports(), [
      { expenseId: "dinner", owesTo: "jane", participant: "joe", amount: 30 },
      { expenseId: "dinner", owesTo: "jane", participant: "jake", amount: 50 },
      { expenseId: "dinner 2", owesTo: "joe", participant: "jane", amount: 30 },
      { expenseId: "dinner 2", owesTo: "joe", participant: "jake", amount: 20 },
    ]);
  }
);
