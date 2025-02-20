import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

console.log("Connecting to MongoDB...")
const uri = process.env.MONGODB_URI
console.log(`Connecting to ${uri}`)

const options = {
  serverApi: {
    version: '1' as const,
    strict: true,
    deprecationErrors: true,
  }
}

console.log("MongoDB Connection Debug:")
console.log("- Environment:", process.env.NODE_ENV)
console.log("- MongoDB URI exists:", !!process.env.MONGODB_URI)
console.log("- MongoDB URI format:", process.env.MONGODB_URI?.split('://')[0] + '://' + '[hidden]')
console.log("- Connection options:", JSON.stringify(options, null, 2))

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect().catch(error => {
      console.error("MongoDB Connection Error:", {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      throw error;
    });
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect().catch(error => {
    console.error("MongoDB Connection Error:", {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  });
}

export default clientPromise
