// Firebase Configuration — School Inventory System
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

export const firebaseConfig = {
  apiKey: "AIzaSyCPo_hL6DpyhQoiYyvzcGkHaINqgaGfo-Y",
  authDomain: "smsschoolinventory.firebaseapp.com",
  projectId: "smsschoolinventory",
  storageBucket: "smsschoolinventory.firebasestorage.app",
  messagingSenderId: "555423260684",
  appId: "1:555423260684:web:791764f489b0c771df4e29",
  measurementId: "G-5SVH0SR40B"
};

// Initialize Firebase (analytics intentionally omitted — not needed for this app)
export const app = initializeApp(firebaseConfig);
export const analytics = null;
