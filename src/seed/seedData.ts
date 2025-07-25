import { connectDatabase } from '../config/database';
import { User, UserRole } from '../models/User';
import { Expense, ExpenseCategory, ExpenseStatus } from '../models/Expense';
import bcrypt from 'bcrypt';

export const seedDatabase = async () => {
  try {
    await connectDatabase();
    
    // Clear existing data
    await Expense.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.bulkCreate([
      {
        email: 'admin@company.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN
      },
      {
        email: 'employee1@company.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.EMPLOYEE
      },
      {
        email: 'employee2@company.com',
        password: hashedPassword,
        firstName: 'Jane',
        lastName: 'Smith',
        role: UserRole.EMPLOYEE
      }
    ]);

    const [admin, employee1, employee2] = users;

    // Create sample expenses
    await Expense.bulkCreate([
      {
        title: 'Business Lunch',
        description: 'Client meeting lunch',
        amount: 45.50,
        category: ExpenseCategory.FOOD_DINING,
        status: ExpenseStatus.APPROVED,
        expenseDate: new Date('2024-01-15'),
        userId: employee1.id,
        approvedBy: admin.id
      },
      {
        title: 'Flight to Conference',
        description: 'Round trip flight to tech conference',
        amount: 650.00,
        category: ExpenseCategory.TRAVEL,
        status: ExpenseStatus.PENDING,
        expenseDate: new Date('2024-01-20'),
        userId: employee1.id
      },
      {
        title: 'Office Supplies',
        description: 'Notebooks and pens',
        amount: 25.75,
        category: ExpenseCategory.OFFICE_SUPPLIES,
        status: ExpenseStatus.APPROVED,
        expenseDate: new Date('2024-01-18'),
        userId: employee2.id,
        approvedBy: admin.id
      },
      {
        title: 'Taxi to Airport',
        description: 'Transportation to airport for business trip',
        amount: 35.00,
        category: ExpenseCategory.TRANSPORTATION,
        status: ExpenseStatus.APPROVED,
        expenseDate: new Date('2024-01-22'),
        userId: employee1.id,
        approvedBy: admin.id
      },
      {
        title: 'Team Building Event',
        description: 'Company team building dinner',
        amount: 120.00,
        category: ExpenseCategory.ENTERTAINMENT,
        status: ExpenseStatus.PENDING,
        expenseDate: new Date('2024-01-25'),
        userId: employee2.id
      },
      {
        title: 'Medical Checkup',
        description: 'Annual health checkup',
        amount: 200.00,
        category: ExpenseCategory.HEALTHCARE,
        status: ExpenseStatus.APPROVED,
        expenseDate: new Date('2024-01-28'),
        userId: employee1.id,
        approvedBy: admin.id
      },
      {
        title: 'Online Course',
        description: 'Professional development course',
        amount: 99.00,
        category: ExpenseCategory.EDUCATION,
        status: ExpenseStatus.PENDING,
        expenseDate: new Date('2024-01-30'),
        userId: employee2.id
      },
      {
        title: 'Miscellaneous Expense',
        description: 'Various small office items',
        amount: 15.50,
        category: ExpenseCategory.OTHER,
        status: ExpenseStatus.APPROVED,
        expenseDate: new Date('2024-02-01'),
        userId: employee1.id,
        approvedBy: admin.id
      }
    ]);

    console.log('Database seeded successfully!');
    console.log('Test users created with password: password123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(0);
  }
};

if (require.main === module) {
  seedDatabase();
}