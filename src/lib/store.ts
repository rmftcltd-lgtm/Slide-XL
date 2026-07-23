import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { Order, OrderStatus, Product, ShippingAddress } from "./types";
import { getProductById, products as seedProducts } from "./products";

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readJsonFile<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(file: string, data: T): Promise<void> {
  await ensureDataDir();
  await writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

export async function listOrders(): Promise<Order[]> {
  const orders = await readJsonFile<Order[]>(ORDERS_FILE, []);
  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const orders = await listOrders();
  return orders.find((o) => o.id === id || o.orderNumber === id);
}

function nextOrderNumber(existing: Order[]): string {
  const n = existing.length + 1;
  return `SXL-${String(n).padStart(5, "0")}`;
}

export async function createOrder(input: {
  productId: string;
  quantity: number;
  shippingAddress: ShippingAddress;
  notes?: string;
}): Promise<Order> {
  const product = getProductById(input.productId);
  if (!product || product.status !== "active") {
    throw new Error("Product unavailable");
  }
  if (input.quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  const orders = await listOrders();
  const now = new Date().toISOString();
  const unit = product.price.amount;
  const subtotal = unit * input.quantity;

  const order: Order = {
    id: randomUUID(),
    orderNumber: nextOrderNumber(orders),
    createdAt: now,
    updatedAt: now,
    status: "paid",
    market: input.shippingAddress.country,
    items: [
      {
        productId: product.id,
        title: product.title,
        quantity: input.quantity,
        unitPrice: { amount: unit, currency: product.price.currency },
      },
    ],
    subtotal: { amount: subtotal, currency: product.price.currency },
    shipping: { amount: 0, currency: product.price.currency },
    total: { amount: subtotal, currency: product.price.currency },
    shippingAddress: input.shippingAddress,
    notes: input.notes,
  };

  orders.unshift(order);
  await writeJsonFile(ORDERS_FILE, orders);
  return order;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order | undefined> {
  const orders = await listOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx < 0) return undefined;
  orders[idx] = {
    ...orders[idx],
    status,
    updatedAt: new Date().toISOString(),
  };
  await writeJsonFile(ORDERS_FILE, orders);
  return orders[idx];
}

export async function listProducts(): Promise<Product[]> {
  const stored = await readJsonFile<Product[] | null>(PRODUCTS_FILE, null);
  if (!stored) {
    await writeJsonFile(PRODUCTS_FILE, seedProducts);
    return seedProducts;
  }
  return stored;
}

export async function saveProducts(next: Product[]): Promise<Product[]> {
  await writeJsonFile(PRODUCTS_FILE, next);
  return next;
}

export async function getStats() {
  const orders = await listOrders();
  const revenue = orders
    .filter((o) => o.status === "paid" || o.status === "fulfilled")
    .reduce((sum, o) => sum + o.total.amount, 0);
  const pending = orders.filter((o) => o.status === "paid").length;
  const fulfilled = orders.filter((o) => o.status === "fulfilled").length;
  return {
    orderCount: orders.length,
    revenue,
    pending,
    fulfilled,
    recent: orders.slice(0, 5),
  };
}
