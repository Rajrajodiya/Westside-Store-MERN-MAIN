/**
 * Database Seed Script
 *
 * Seeds the MongoDB database with data from CSV files:
 *   - WESTSIDE-STORE.users.csv
 *   - WESTSIDE-STORE.products.csv
 *   - WESTSIDE-STORE.contacts.csv
 *
 * Usage:  node seed.js
 *         node seed.js --force   (drop collections before inserting)
 */

const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const connectDB = require("./api/config/db");
const User = require("./models/User");
const Product = require("./models/Product");
const Contact = require("./models/Contact");

const CSV_DIR = path.join(__dirname, "..");

// ─── CSV Parser (handles quoted fields with commas) ────────────────

function parseCSV(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8").trim();
  const lines = raw.split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = parseLine(lines[0]);

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length === 0) continue;
    const record = {};
    headers.forEach((h, idx) => {
      record[h] = idx < values.length ? values[idx] : "";
    });
    records.push(record);
  }
  return records;
}

function parseLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      // Check for escaped quote ""
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

// ─── Helpers ───────────────────────────────────────────────────────

function extractArray(record, prefix) {
  const values = [];
  let i = 0;
  while (true) {
    const key = `${prefix}[${i}]`;
    if (record[key] !== undefined && record[key] !== "") {
      values.push(record[key]);
      i++;
    } else {
      break;
    }
  }
  return values;
}

// ─── Main ──────────────────────────────────────────────────────────

async function seed() {
  const force = process.argv.includes("--force");

  console.log("🌱 Connecting to MongoDB...");
  await connectDB();
  console.log("✅ Connected.\n");

  // ── Users ────────────────────────────────────────────────────────
  console.log("──────────────────────────────────────────────");
  console.log("📋 Seeding Users...");
  const usersData = parseCSV(path.join(CSV_DIR, "WESTSIDE-STORE.users.csv"));
  console.log(`   Found ${usersData.length} user(s) in CSV.`);

  if (force) {
    const deleted = await User.deleteMany({});
    console.log(`   🗑️  Dropped ${deleted.deletedCount} existing user(s).`);
  }

  let usersSeeded = 0;
  for (const u of usersData) {
    const email = u.email?.trim().toLowerCase();
    if (!email) continue;
    const exists = await User.findOne({ email });
    if (exists) {
      console.log(`   ⏭️  User "${email}" already exists, skipping.`);
      continue;
    }
    await User.create({
      _id: u._id || undefined,
      name: u.name,
      email,
      phone: u.phone,
      password: u.password, // pre-save hook will hash it
    });
    usersSeeded++;
    console.log(`   ✅ User "${email}" created.`);
  }
  console.log(`   📊 Total users seeded: ${usersSeeded}\n`);

  // ── Products ─────────────────────────────────────────────────────
  console.log("──────────────────────────────────────────────");
  console.log("📋 Seeding Products...");
  const productsData = parseCSV(path.join(CSV_DIR, "WESTSIDE-STORE.products.csv"));
  console.log(`   Found ${productsData.length} product(s) in CSV.`);

  if (force) {
    const deleted = await Product.deleteMany({});
    console.log(`   🗑️  Dropped ${deleted.deletedCount} existing product(s).`);
  }

  let productsSeeded = 0;
  for (const p of productsData) {
    const imageName = p.imageName?.trim();
    if (!imageName) continue;
    const exists = await Product.findOne({ imageName });
    if (exists) {
      console.log(`   ⏭️  Product "${imageName}" already exists, skipping.`);
      continue;
    }

    await Product.create({
      _id: p._id || undefined,
      imageName: p.imageName,
      brand: p.brand || "",
      mainImage: p.mainImage,
      otherImages: extractArray(p, "otherImage"),
      mrp: parseFloat(p.mrp) || 0,
      price: parseFloat(p.price) || 0,
      description: p.description || "",
      category: (p.category || "").toLowerCase(),
    });
    productsSeeded++;
    console.log(`   ✅ Product "${imageName}" created.`);
  }
  console.log(`   📊 Total products seeded: ${productsSeeded}\n`);

  // ── Contacts ─────────────────────────────────────────────────────
  console.log("──────────────────────────────────────────────");
  console.log("📋 Seeding Contacts...");
  const contactsData = parseCSV(path.join(CSV_DIR, "WESTSIDE-STORE.contacts.csv"));
  console.log(`   Found ${contactsData.length} contact(s) in CSV.`);

  if (force) {
    const deleted = await Contact.deleteMany({});
    console.log(`   🗑️  Dropped ${deleted.deletedCount} existing contact(s).`);
  }

  let contactsSeeded = 0;
  for (const c of contactsData) {
    const email = c.email?.trim().toLowerCase();
    if (!email) continue;
    const exists = await Contact.findOne({ email, message: c.message });
    if (exists) {
      console.log(`   ⏭️  Contact from "${email}" with same message already exists, skipping.`);
      continue;
    }

    await Contact.create({
      _id: c._id || undefined,
      name: c.name,
      email,
      message: c.message,
    });
    contactsSeeded++;
    console.log(`   ✅ Contact from "${email}" created.`);
  }
  console.log(`   📊 Total contacts seeded: ${contactsSeeded}\n`);

  // ── Summary ──────────────────────────────────────────────────────
  console.log("──────────────────────────────────────────────");
  console.log("🎉 Seeding complete!");
  console.log(`   Users:    ${usersSeeded}`);
  console.log(`   Products: ${productsSeeded}`);
  console.log(`   Contacts: ${contactsSeeded}`);

  // Disconnect
  const mongoose = require("mongoose");
  await mongoose.connection.close();
  console.log("🔌 Disconnected from MongoDB.\n");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
