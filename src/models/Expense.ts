import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';

export enum ExpenseStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum ExpenseCategory {
  TRAVEL = 'travel',
  FOOD = 'food',
  OFFICE_SUPPLIES = 'office_supplies',
  ENTERTAINMENT = 'entertainment',
  OTHER = 'other'
}

interface ExpenseAttributes {
  id: number;
  title: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  status: ExpenseStatus;
  expenseDate: Date;
  receiptUrl?: string;
  rejectionReason?: string;
  userId: number;
  approvedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ExpenseCreationAttributes extends Optional<ExpenseAttributes, 'id' | 'status' | 'receiptUrl' | 'rejectionReason' | 'approvedBy' | 'createdAt' | 'updatedAt'> {}

export class Expense extends Model<ExpenseAttributes, ExpenseCreationAttributes> implements ExpenseAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public amount!: number;
  public category!: ExpenseCategory;
  public status!: ExpenseStatus;
  public expenseDate!: Date;
  public receiptUrl?: string;
  public rejectionReason?: string;
  public userId!: number;
  public approvedBy?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Expense.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM(...Object.values(ExpenseCategory)),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ExpenseStatus)),
      allowNull: false,
      defaultValue: ExpenseStatus.PENDING,
    },
    expenseDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    receiptUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    approvedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Expense',
    tableName: 'expenses',
    timestamps: true,
  }
);

// Define associations
User.hasMany(Expense, { foreignKey: 'userId', as: 'expenses' });
Expense.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Expense.belongsTo(User, { foreignKey: 'approvedBy', as: 'approver' });