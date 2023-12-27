import t from "tap";
import { init } from "../../../src";
import { AccountingDoc } from "../../../src/models/Accounting";

const getStore = () => init();

t.test("bigbang", async (t) => {
  t.plan(1);
  const ui = getStore().ui;

  t.equal(ui.hello(), "world");
});

// TODO: future,
//          paidByBreakdown: {
//            joe: 100,
//          },

// item name, total price, peeps involved, paid by
//   paid by breakdown
//   peeps involved breakdown

// example schema below
// {
//   name: "dinner",
//   total: 100,
//   peeps: ["joe", "jane"],
//   paidBy: "joe",
//   paidByBreakdown: {
//     joe: 100,
//   },
//   sharingBreakdown: {
//     joe: 50,
//     jane: 50,
//   },
// }

// report example below per user, show what they owe and what they are owed, reference the items
// {
//   joe: {
//     owes: {
//       jane: 50,
//       items: ["dinner"],
//     },
//     owed: {
//       jane: 50,
//     },
//   },

// feature list based of above
//   add item
//   add peep
//   add payment
//   add payment breakdown
//   add peep breakdown

t.test("add entry, joe and jane went to dinner 2x", async (t) => {
  t.plan(1);
  const store = getStore();
  const ui = store.ui;
  ui.addExpense({ name: "dinner", total: 100 });
  ui.addExpense({ name: "dinner 2", total: 90 });

  t.same(ui.expenses(), [
    { name: "dinner", total: 100 },
    { name: "dinner 2", total: 90 },
  ]);
});

t.test("account test", async (t) => {
  t.plan(1);
  // Example usage
  const doc = AccountingDoc.create({
    id: "123",
    lineItems: [
      {
        account: "Expense",
        type: "DEBIT",
        amount: 100,
        transactionDate: new Date("2023-01-01"),
      },
      {
        account: "Joe",
        type: "CREDIT",
        amount: 50,
        transactionDate: new Date("2023-01-01"),
      },
      {
        account: "Jane",
        type: "CREDIT",
        amount: 50,
        transactionDate: new Date("2023-01-01"),
      },
    ],
  });

  t.same(doc.isValid, true);

  // Add, edit, remove line items, update status as needed
});
