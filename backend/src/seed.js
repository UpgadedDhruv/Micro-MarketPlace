import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Product from "./models/Product.js";
import User from "./models/User.js";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set");
  process.exit(1);
}

const products = [
  {
    title: "Wireless Headphones",
    price: 79.99,
    description:
      "Comfortable over-ear wireless headphones with noise isolation.",
    image: "https://i.rtings.com/assets/pages/Hu0RImuU/best-office-headphones-20251024-medium.jpg?format=auto",
  }, 
  {
    title: "Smart Watch",
    price: 129.99,
    description: "Track your fitness and notifications on the go.",
    image: "https://cdn.jiostore.online/v2/jmd-asp/jdprod/wrkr/products/pictures/item/free/resize-w:250/samsung/494421978/0/UriMzrhNem-3aKiZWdbZ5-Samsung-Ultra-Watch7-Smartwatch-494421978-i-1-1200Wx1200H.jpeg",
  },
  {
    title: "Mechanical Keyboard",
    price: 99.99,
    description: "Tactile mechanical keyboard for productivity and gaming.",
    image: "https://cdn.jiostore.online/v2/jmd-asp/jdprod/wrkr/products/pictures/item/free/resize-w:150/portronics/494421639/0/lwNI508tJ5-uymDc4FZd2i-Portronics-Wired-Keyboard-494421639-i-1-1200Wx1200H.jpeg",
  },
  {
    title: "4K Monitor",
    price: 299.99,
    description: "27-inch 4K UHD monitor with HDR support.",
    image: "https://cdn.jiostore.online/v2/jmd-asp/jdprod/wrkr/products/pictures/item/free/resize-w:150/benq/492850955/0/LfU7_w5pme-HJoM_WEult-Benq-EW2880U-Monitor-492850955-i-1-1200Wx1200H.jpeg",
  },
  {
    title: "USB-C Hub",
    price: 39.99,
    description: "Multi-port USB-C hub with HDMI and USB-A ports.",
    image: "https://cdn.jiostore.online/v2/jmd-asp/jdprod/wrkr/products/pictures/item/free/resize-w:150/novoo/493178980/0/LDK1tV8FwI-JlKAp3tPqK-Novoo-NVHUBGY13PDNS-Hub-493178980-i-1-1200Wx1200H.jpeg",
  },
  {
    title: "Portable SSD",
    price: 149.99,
    description: "Fast and compact 1TB portable SSD.",
    image: "https://cdn.jiostore.online/v2/jmd-asp/jdprod/wrkr/products/pictures/item/free/resize-w:150/lexar/494493460/0/dB2KZpJWYj-bcMh3owdAY-Lexar-ARMOR-700-Portable-SSD-494493460-i-1-1200Wx1200H.jpeg",
  },
  {
    title: "Bluetooth Speaker",
    price: 59.99,
    description: "Water-resistant Bluetooth speaker with deep bass.",
    image: "https://cdn.jiostore.online/v2/jmd-asp/jdprod/wrkr/products/pictures/item/free/resize-w:150/jbl/493711861/0/p1fqe8exMq-19MScBnTf7-JBL-Flip-Essential-Bluetooth-Spekaer-493711861-i-1-1200Wx1200H.jpeg",
  },
  {
    title: "Webcam",
    price: 49.99,
    description: "1080p HD webcam for meetings and streaming.",
    image: "https://cdn.jiostore.online/v2/jmd-asp/jdprod/wrkr/products/pictures/item/free/resize-w:150/logitech/490801119/0/H4k5-lPMtP-pPhcCKkEUO-13ef6109-dcd4-4872-a287-a4ecab934a6d-1200Wx1200H.jpeg",
  },
  {
    title: "Laptop Stand",
    price: 29.99,
    description: "Ergonomic aluminum laptop stand.",
    image: "https://cdn.jiostore.online/v2/jmd-asp/jdprod/wrkr/products/pictures/item/free/resize-w:150/lapcare/493178969/0/5JbWpF17Mv-c_Qqo1GVQZ-Lapcare-LKSTSE7492-Laptop-Stand-493178969-i-1-1200Wx1200H.jpeg",
  },
  {
    title: "Wireless Mouse",
    price: 24.99,
    description: "Ergonomic wireless mouse with adjustable DPI.",
    image: "https://cdn.jiostore.online/v2/jmd-asp/jdprod/wrkr/products/pictures/item/free/resize-w:150/hp/493838157/0/CEO8pIM__B-i0fj1FUbZh-HP-M090-Wireless-Mouse-493838159-i-1-1200Wx1200H.jpeg",
  },
];

const users = [
  {
    email: "Dhruv@example.com",
    password: "password123",
  },
  {
    email: "Modi@example.com",
    password: "password123",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for seeding");

    await Product.deleteMany({});
    await User.deleteMany({}); 

    const createdProducts = await Product.insertMany(products);
    const createdUsers = await Promise.all(
      users.map((user) => User.create(user)),
    );

    console.log(`Inserted ${createdProducts.length} products`);
    console.log(`Inserted ${createdUsers.length} users`);
  } catch (err) {
    console.error("Seeding error", err); 
  } finally {
    await mongoose.disconnect(); 
    process.exit(0);
  }
};

seed();
