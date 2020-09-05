import csvParse from 'csv-parse';
import fs from 'fs';

interface Transactions {
  title: string;
  type: string;
  value: number;
  category: string;
}

interface ReturnPromise {
  transactions: Transactions[];
  categories: string[];
}

async function loadCSV(filePath: string): Promise<ReturnPromise> {
  const readCSVStream = fs.createReadStream(filePath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  const transactions: Transactions[] = [];
  const categories: string[] = [];

  parseCSV.on('data', line => {
    const transaction = {
      title: line[0],
      type: line[1],
      value: Number(line[2]),
      category: line[3],
    };

    transactions.push(transaction);
    categories.push(transaction.category);
  });

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  return { transactions, categories };
}

export default loadCSV;
