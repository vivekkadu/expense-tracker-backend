import { IsString, IsNumber, IsEnum, IsDateString, IsOptional, Min } from 'class-validator';
import { ExpenseCategory, ExpenseStatus } from '../models/Expense';

export class CreateExpenseDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsEnum(ExpenseCategory)
  category!: ExpenseCategory;

  @IsDateString()
  expenseDate!: string;

  @IsOptional()
  @IsString()
  receiptUrl?: string;
}

export class UpdateExpenseStatusDto {
  @IsNumber()
  expenseId!: number;

  @IsEnum(ExpenseStatus)
  status!: ExpenseStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}