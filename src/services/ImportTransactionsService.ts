import fs from 'fs';

import CreateTransactionService from './CreateTransactionService';
import Transaction from '../models/Transaction';
import openCsv from '../utils/openCsv';

interface Request {
  filePath: string;
}

class ImportTransactionsService {
  async execute({ filePath }: Request): Promise<Transaction[]> {
    const CreateTransaction = new CreateTransactionService();

    const transactionsDataFile = await openCsv(filePath);

    const transactions = await Promise.all(
      transactionsDataFile.map(async ({ title, value, type, category }) => {
        const createdTreansaction = await CreateTransaction.execute({
          title,
          value,
          type,
          category,
        });

        return { ...createdTreansaction };
      }),
    );

    const transactionsFileExists = await fs.promises.stat(filePath);

    if (transactionsFileExists) {
      await fs.promises.unlink(filePath);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
