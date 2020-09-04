import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const checkTransactionExist = await transactionRepository.findOne({
      where: { id },
    });

    if (!checkTransactionExist) {
      throw new AppError('Transaction not booked!');
    }

    await transactionRepository.delete({ id });
  }
}

export default DeleteTransactionService;
