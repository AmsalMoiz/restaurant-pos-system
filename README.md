# Restaurant POS System

A full-stack Point of Sale (POS) web application designed for restaurant operations. This system allows customers to place orders and make reservations while enabling administrators to manage inventory, employees, and suppliers and view reports.

## Features

### Customer-Facing
- Menu browsing and item selection
- Online ordering and checkout
- Table reservation system
- User account creation and login
- Order and reservation history

## Dashboard Overview

The system uses role-based dashboards to ensure users only access relevant features based on their assigned role. Upon login, users are automatically redirected to the appropriate dashboard depending on their role: `admin`, `manager`, or `waiter`.

---

### 🔒 Admin Dashboard

Admins have full control over operations and data. The dashboard includes:

#### Restaurant Management
- **Process Transactions** – Create and complete customer transactions.
- **Reorder Alerts** – View items that need to be reordered based on stock levels.
- **Inventory** – Add, edit, or remove items from the restaurant inventory.
- **Employee Management** – Manage employee accounts and permissions.

#### Business Management
- **Suppliers** – Manage restaurant supplier contacts and data.
- **Discounts** – Add or remove discount codes for checkout.

#### Analytics & Reporting
- **Item Sales Report** – View item-level sales performance.
- **Employee Sales Report** – Analyze staff sales contributions over time.
- **Customer Reports** – View customer trends and behavior.
- **Supplier Reports** – Evaluate supplier usage and spending.

---

### 🧑‍💼 Manager Dashboard

Managers have access to most operational features and reports, excluding discount and supplier management.

#### Available Features:
- Process Transactions
- Reorder Alerts
- Inventory Management
- Employee Management
- Employee Sales Report
- Customer Reports
- Log Hours

The manager dashboard is similar in layout to the admin dashboard but with a more focused scope of access.

---

### 🍽️ Waiter Dashboard

Waiters have a streamlined dashboard designed for quick access during service.

#### Available Features:
- **Process Transactions** – Finalize dine-in or takeout customer orders.
- **Log Hours** – Record shift hours for payroll and reporting.

This minimal dashboard is designed for efficiency during high-traffic hours.

---

Each dashboard displays the logged-in user's name and role, with a Logout button for session control.


## Tech Stack

- **Frontend:** React, HTML, CSS
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Other:** Bootstrap, RESTful APIs, Razor Pages (optional), Visual Studio Code, Postman

## Setup Instructions

### Prerequisites
- Node.js
- MySQL
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/restaurant-pos-system.git
cd restaurant-pos-system
2. Set Up the Database
Import the SQL schema (usually in /server/db or provided separately)

Configure your MySQL credentials in /server/.env:

DB_HOST=your_host
DB_USER=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database
3. Install Dependencies
cd client
npm install
cd ../server
npm install
4. Run the Application
From the root directory:

npm run dev
This runs both the client and server concurrently.

Folder Structure
restaurant-pos-system/
├── client/           # React frontend
├── server/           # Express backend
├── images/           # Static assets
├── .env              # Database credentials (not committed)
├── .gitignore
├── package.json
└── README.md

## File & Folder Descriptions

### Root Directory
- `package.json`: Defines project scripts and dependencies for managing both frontend and backend.
- `package-lock.json`: Automatically generated to lock the installed versions of dependencies.
- `README.md`: This documentation file.
- `.gitignore`: Specifies files/folders to exclude from Git (e.g., `.env`, `node_modules`).
- `images/`: Contains general image assets (e.g., `frontpic.png`).

---

### `.vscode/` (Optional Dev Config)
- `c_cpp_properties.json`, `launch.json`, `settings.json`: Local development settings for Visual Studio Code.

---

### Client (Frontend)
- `client/README.md`: Default React README (not required).
- `client/package.json`: React-specific dependencies and scripts.
- `client/package-lock.json`: Dependency lock for React app.
- `client/public/`: Static assets
  - `index.html`: HTML template loaded by React.
  - `images/`: Contains product photos, UI images, and icons.
  - `fonts/`: Custom fonts used in the UI.
- `client/src/`: React source code
  - `App.js`: Entry point with routes.
  - `index.js`: React app root render.
  - `logo.svg`, `index.css`, `App.css`: Branding and global styles.
  - `reportWebVitals.js`, `setupTests.js`, `App.test.js`: Default performance/report/test setup.
  
#### React Components (`client/src/components`)
- `BookTable.js`: Table reservation form.
- `Checkout.js`, `checkout.css`: Checkout interface for purchases.
- `Cart.js`, `cart.css`: Manages the user's shopping cart.
- `CustomerDashboard.js`, `customerDashboard.css`: Customer-specific dashboard.
- `DashAdmin.js`, `DashCook.js`, `DashManager.js`, `DashWaiter.js`: Admin, Cook, Manager, and Waiter dashboards.
- `DeleteAccountModal.js`, `EditProfileModal.js`, `ReservationModal.js`: Modal windows for account edits, reservations, etc.
- `Employees.js`, `Inventory.js`, `Suppliers.js`, `Transactions.js`: Admin management pages for employees, items, suppliers, and sales.
- `ItemSalesReport.js`, `SupplierReport.js`, `EmployeeSalesReports.js`, `CustomerReport.js`: Reporting tools.
- `Login.js`, `UserLogin.js`, `UserSignupModal.js`: Authentication components.
- `Profile.js`, `ProfileCreateAccount.js`: User profile and creation forms.
- `OrderHistory.js`: Displays past orders.
- `MenuTest.js`, `Home.js`, `Navbar.js`, `NavbarCustomer.js`: Menu and navigation components.
- `ScrollToTop.js`: Scroll behavior for page transitions.
- All `.css` files here match a component by name and define its styling.

---

### Server (Backend)
- `server/server.js`: Main backend entry point (Express).
- `server/package.json`: Backend dependencies and scripts.
- `server/db.js`: MySQL connection logic using values from `.env`.
- `server/auth.js`: Manages authentication logic.
- `server/certs/`: Contains SSL certificates if used.
- `server/CustomerReport.js`, `EmployeeReport.js`, `ItemSalesReportRoutes.js`, `SupplierReports.js`: Backend endpoints for generating reports.
- `server/InpersonTransactions.js`, `OrderInventory.js`, `ViewDiscountsRoutes.js`, `logHours.js`: Additional backend functionality for transactions, logging hours, and viewing discounts.

---

### Environment Configuration
- `.env` (not included): Must be created inside `/server/` to enable MySQL connection.
```env
DB_HOST=your_host
DB_USER=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database


Authors
Amsal Moiz (Project Leader)
Jose Alvarado
Daniel Calvac
Cynthia Saab
Danny Nguyen
