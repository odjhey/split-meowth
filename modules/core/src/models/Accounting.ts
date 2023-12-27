import { types } from "mobx-state-tree";

// Enum for Debit or Credit
const LineItemType = types.enumeration("Type", ["DEBIT", "CREDIT"]);

// Define the AccountingLineItem model
const AccountingLineItem = types.model("AccountingLineItem", {
  account: types.string,
  type: LineItemType,
  description: types.optional(types.string, ""),
  amount: types.number, // Always positive
  transactionDate: types.Date, // Transaction date
});

// Define the AccountingDoc model
const AccountingDoc = types
  .model("AccountingDoc", {
    id: types.identifier,
    lineItems: types.array(AccountingLineItem),
  })
  .views((self) => ({
    get totalDebit() {
      return self.lineItems
        .filter((item) => item.type === "DEBIT")
        .reduce((sum, item) => sum + item.amount, 0);
    },
    get totalCredit() {
      return self.lineItems
        .filter((item) => item.type === "CREDIT")
        .reduce((sum, item) => sum + item.amount, 0);
    },
    get isValid() {
      return this.totalDebit === this.totalCredit;
    },
    get summaryReport() {
      return self.lineItems.reduce(
        (acc, item) => {
          acc[item.account] = (acc[item.account] || 0) + item.amount;
          return acc;
        },
        {} as Record<string, number>
      );
    },
  }));

export { AccountingDoc };
