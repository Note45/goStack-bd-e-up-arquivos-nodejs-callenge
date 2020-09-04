import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.createQueryBuilder(
      'transactions',
    ).getMany();

    const balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    transactions.map(({ type, value }) => {
      if (type === 'income') {
        balance.income += value;
      } else {
        balance.outcome += value;
      }

      return null;
    });

    balance.total = balance.income - balance.outcome;

    return balance;
  }
}

export default TransactionsRepository;
