import fs from 'fs';
import path from 'path';
import { Product, Order } from './types';
import { products as defaultProducts } from './data';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  address: string;
}

export interface DbSchema {
  users: User[];
  products: Product[];
  orders: Order[];
}

const dbPath = path.join(process.cwd(), 'db.json');

// Ensure db.json exists and is initialized
export function initDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      const initialDb: DbSchema = {
        users: [],
        products: defaultProducts, // seed database with default products
        orders: [],
      };
      fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2), 'utf-8');
      console.log('Database initialized and seeded with default products in db.json');
    } else {
      // Validate structure
      const data = fs.readFileSync(dbPath, 'utf-8');
      const db = JSON.parse(data) as DbSchema;
      if (!db.users || !db.products || !db.orders) {
        db.users = db.users || [];
        db.products = db.products || defaultProducts;
        db.orders = db.orders || [];
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
      }
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// Read database helper
export function readDb(): DbSchema {
  try {
    if (!fs.existsSync(dbPath)) {
      initDb();
    }
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data) as DbSchema;
  } catch (error) {
    console.error('Failed to read database:', error);
    return { users: [], products: defaultProducts, orders: [] };
  }
}

// Write database helper
export function writeDb(db: DbSchema) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write database:', error);
  }
}

// --- USER OPERATIONS ---
export function getUsers(): User[] {
  return readDb().users;
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function addUser(user: Omit<User, 'id'>): User {
  const db = readDb();
  const newUser: User = {
    ...user,
    id: `usr-${Math.random().toString(36).substr(2, 9)}`,
  };
  db.users.push(newUser);
  writeDb(db);
  return newUser;
}

// --- PRODUCT OPERATIONS ---
export function getProducts(): Product[] {
  return readDb().products;
}

export function addProduct(product: Omit<Product, 'id'>): Product {
  const db = readDb();
  const newProduct: Product = {
    ...product,
    id: `prod-${Math.random().toString(36).substr(2, 9)}`,
  };
  db.products.unshift(newProduct); // Add new products to the top
  writeDb(db);
  return newProduct;
}

export function updateProduct(id: string, updatedFields: Partial<Product>): Product | null {
  const db = readDb();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  db.products[index] = {
    ...db.products[index],
    ...updatedFields,
  };
  writeDb(db);
  return db.products[index];
}

export function deleteProduct(id: string): boolean {
  const db = readDb();
  const initialLength = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length === initialLength) return false;
  writeDb(db);
  return true;
}

// --- ORDER OPERATIONS ---
export function getOrders(): Order[] {
  return readDb().orders;
}

export function getOrdersByUserId(userId: string): Order[] {
  // We can filter orders by a custom user email or id saved in deliveryAddress.email or custom field
  const orders = getOrders();
  // We will save orders with an additional custom field or we can check the phone / email
  return orders;
}

export function addOrder(order: Order, userId?: string): Order {
  const db = readDb();
  // Store order and optionally tag it with a user identification
  const orderWithUser = {
    ...order,
    // Add extra field in order object safely
    userId: userId || null,
  };
  db.orders.unshift(orderWithUser);
  writeDb(db);
  return orderWithUser;
}

export function updateOrderStatus(orderId: string, status: Order['status']): Order | null {
  const db = readDb();
  const index = db.orders.findIndex((o) => o.id === orderId);
  if (index === -1) return null;

  db.orders[index].status = status;
  // Dynamic ETA update based on status
  if (status === 'preparing') {
    db.orders[index].eta = 8;
  } else if (status === 'dispatched') {
    db.orders[index].eta = 4;
  } else if (status === 'delivered') {
    db.orders[index].eta = 0;
  }
  
  writeDb(db);
  return db.orders[index];
}
