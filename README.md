
### 📂 Folder Details

#### `/src/config/`
- **`database.ts`**: Database connection configuration using Sequelize ORM
- Sets up MySQL connection with environment variables
- Handles database authentication and synchronization

#### `/src/controllers/`
- **`auth.controller.ts`**: Handles user registration, login, and authentication
- **`expense.controller.ts`**: Manages expense CRUD operations and status updates
- **`analytics.controller.ts`**: Provides expense analytics and reporting endpoints

#### `/src/middleware/`
- **`auth.ts`**: JWT token authentication middleware
- **`roleAuth.ts`**: Role-based authorization middleware
- **`cors.ts`**: Cross-Origin Resource Sharing configuration
- **`errorHandler.ts`**: Global error handling middleware

#### `/src/models/`
- **`User.ts`**: User model with roles (Employee/Admin) and authentication fields
- **`Expense.ts`**: Expense model with categories, status tracking, and relationships

#### `/src/routes/`
- **`auth.routes.ts`**: Authentication endpoints (register, login)
- **`expense.routes.ts`**: Expense management endpoints
- **`analytics.routes.ts`**: Analytics and reporting endpoints

#### `/src/services/`
- **`auth.service.ts`**: Authentication business logic and user management
- **`expense.service.ts`**: Expense processing, filtering, and status management
- **`analytics.service.ts`**: Data aggregation and analytics calculations

#### `/src/validators/`
- **`auth.validator.ts`**: Input validation for authentication requests
- **`expense.validator.ts`**: Input validation for expense-related requests

#### `/src/utils/`
- **`responseHelper.ts`**: Standardized API response formatting utilities

#### `/src/seed/`
- **`seedData.ts`**: Database seeding script for initial data setup

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd expense-tracker-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DIALECT=mysql
DB_NAME=expense_tracker

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Database Setup
```bash
# Create the database
mysql -u root -p
CREATE DATABASE expense_tracker;
```

### 5. Run the application
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Seed database with initial data
npm run seed
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Expenses
- `POST /api/expenses` - Create new expense
- `GET /api/expenses` - Get expenses (with filtering)
- `PUT /api/expenses/status` - Approve/Reject expense (Admin only)

### Analytics
- `GET /api/analytics/*` - Various analytics endpoints

## 🔐 User Roles

### Employee
- Create and view their own expenses
- Track expense status (Pending/Approved/Rejected)

### Admin
- View all expenses across the organization
- Approve or reject expense requests
- Access analytics and reporting features

## 🗄️ Database Schema

### Users Table
- `id`, `email`, `password`, `firstName`, `lastName`
- `role` (employee/admin), `isActive`, `timestamps`

### Expenses Table
- `id`, `title`, `description`, `amount`, `category`
- `status` (pending/approved/rejected), `expenseDate`
- `receiptUrl`, `rejectionReason`, `userId`, `approvedBy`
- `timestamps`

## 🏗️ Architecture

- **MVC Pattern**: Separation of concerns with Models, Views (API responses), and Controllers
- **Service Layer**: Business logic abstraction
- **Middleware Pipeline**: Authentication, authorization, and error handling
- **ORM Integration**: Sequelize for database operations
- **Type Safety**: Full TypeScript implementation

## 🚀 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Seed database with initial data

## 🔧 Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: class-validator
- **Password Hashing**: bcrypt
- **Development**: ts-node-dev

## 📝 Development Notes

- All API responses follow a consistent format
- Input validation is handled at the controller level
- Database relationships are properly defined between Users and Expenses
- Role-based middleware ensures proper access control
- Error handling is centralized through middleware

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.