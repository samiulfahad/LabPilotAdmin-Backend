const { MongoClient } = require("mongodb");

const localDB = "mongodb://127.0.0.1:27017";
const mongodbAtlas = "mongodb+srv://dbAdmin:dbAdminPass@labpilot.heko8il.mongodb.net/?appName=LabPilot";
const dbName = "labpilot";

let client = null;
let isConnecting = false;
let connectionAttempts = 0;
const MAX_RETRIES = 100;
const BASE_DELAY = 5000; // 1 second

async function connect() {
  // If already connected, return the database
  if (client && client.topology && client.topology.isConnected()) {
    return client.db(dbName);
  }

  // If connection is in progress, wait for it
  if (isConnecting) {
    return waitForConnection();
  }

  isConnecting = true;
  connectionAttempts = 0;

  try {
    const db = await connectWithRetry();
    isConnecting = false;
    return db;
  } catch (err) {
    isConnecting = false;
    throw err;
  }
}

async function connectWithRetry() {
  while (connectionAttempts < MAX_RETRIES) {
    try {
      connectionAttempts++;
      console.log(`Attempting database connection (attempt ${connectionAttempts})...`);

      if (client) {
        // Close existing client if it exists but isn't connected
        await client.close();
      }

      client = new MongoClient(mongodbAtlas, {
        connectTimeoutMS: 10000,
        minPoolSize: 5,
        maxPoolSize: 100,
        retryWrites: true,
        retryReads: true,
      });

      await client.connect();
      console.log("Database Connection opened successfully!");
      connectionAttempts = 0; // Reset counter on successful connection
      return client.db(dbName);
    } catch (err) {
      console.error(`Database connection attempt ${connectionAttempts} failed:`, err.message);

      if (connectionAttempts >= MAX_RETRIES) {
        throw new Error(`Failed to connect to database after ${MAX_RETRIES} attempts: ${err.message}`);
      }

      // Exponential backoff with jitter
      const delay = calculateBackoffDelay(connectionAttempts);
      console.log(`Retrying connection in ${delay}ms...`);
      await sleep(delay);
    }
  }
}

function calculateBackoffDelay(attempt) {
  const exponentialDelay = Math.min(BASE_DELAY * Math.pow(2, attempt - 1), 30000); // Cap at 30 seconds
  const jitter = Math.random() * 1000; // Add up to 1 second jitter
  return exponentialDelay + jitter;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForConnection() {
  let attempts = 0;
  const maxWaitAttempts = 30; // 30 seconds max wait
  const waitInterval = 1000; // Check every second

  while (attempts < maxWaitAttempts) {
    if (client && client.topology && client.topology.isConnected()) {
      return client.db(dbName);
    }

    if (!isConnecting) {
      throw new Error("Connection attempt was abandoned");
    }

    await sleep(waitInterval);
    attempts++;
  }

  throw new Error("Timeout waiting for database connection");
}

function getClient() {
  if (client && client.topology && client.topology.isConnected()) {
    return client.db(dbName);
  } else {
    throw new Error("No active database client. Please connect to the database first.");
  }
}

function close() {
  if (client) {
    client.close();
    console.log("Database Connection Closed");
    client = null;
    isConnecting = false;
    connectionAttempts = 0;
  }
}

// Optional: Auto-reconnect on connection loss
if (typeof process !== "undefined") {
  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
  });

  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
  });
}

module.exports = { connect, getClient, close };
