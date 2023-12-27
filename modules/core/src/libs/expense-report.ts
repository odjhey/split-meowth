interface Expense {
  id: string;
  amount: number;
  description: string;
}

interface Settlement {
  expenseId: string;
  paidBy: string;
  sharedBy: Record<string, number>;
}

interface GroupData {
  expenses: Expense[];
  settlements: Settlement[];
}

interface ReportEntry {
  expenseId: string;
  owesTo: string;
  participant: string;
  amount: number;
}

export function generateReport(data: GroupData): ReportEntry[] {
  const report: ReportEntry[] = [];

  data.settlements.forEach((settlement) => {
    const expense = data.expenses.find((e) => e.id === settlement.expenseId);
    if (!expense) {
      throw new Error(`Expense with ID ${settlement.expenseId} not found.`);
    }

    Object.entries(settlement.sharedBy).forEach(([participant, share]) => {
      if (participant !== settlement.paidBy) {
        report.push({
          expenseId: settlement.expenseId,
          owesTo: settlement.paidBy,
          participant: participant,
          amount: share,
        });
      }
    });
  });

  return report;
}
