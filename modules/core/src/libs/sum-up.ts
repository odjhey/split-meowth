// care of chat

type DataObject = { [key: string]: any };

type SumOptions = {
  keys: string[];
  amountField: string;
};

function sumUp(data: DataObject[], options: SumOptions): DataObject[] {
  const { keys, amountField } = options;

  const sumResult: DataObject[] = [];
  const indexMap = new Map<string, number>();

  data.forEach((item) => {
    // Create a unique key based on the specified fields
    const uniqueKey = keys.map((k) => item[k]).join("_");

    const existingIndex = indexMap.get(uniqueKey);
    if (existingIndex !== undefined) {
      // If the unique key exists, update the existing record
      sumResult[existingIndex][amountField] += item[amountField];
    } else {
      // If not, create a new record
      const newItem = keys.reduce(
        (obj, key) => ({ ...obj, [key]: item[key] }),
        {}
      );
      newItem[amountField] = item[amountField];
      sumResult.push(newItem);
      indexMap.set(uniqueKey, sumResult.length - 1);
    }
  });

  return sumResult;
}

export { sumUp };
