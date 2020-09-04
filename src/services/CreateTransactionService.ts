import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

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
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

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
      category_id: categoryToBook.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
