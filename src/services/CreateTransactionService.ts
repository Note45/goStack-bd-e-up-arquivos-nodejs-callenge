import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new AppError(
        'Transaction type outcome cannot be larger than balance total!',
      );
    }

    const checkTransactionExist = await transactionRepository.findOne({
      where: { title },
    });

    if (checkTransactionExist) {
      throw new AppError('Transaction already booked!');
    }

    const checkCategoryExist = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    let categoryToBook = checkCategoryExist;

    if (!checkCategoryExist) {
      categoryToBook = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(categoryToBook);
    } else {
      categoryToBook = checkCategoryExist;
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type: type === 'income' ? 'income' : 'outcome',
      category: categoryToBook,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
