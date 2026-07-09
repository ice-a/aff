import mongoose from 'mongoose'

let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = {
  conn: null,
  promise: null,
}

async function resolveUri(): Promise<{ uri: string; dbName: string }> {
  const config = useRuntimeConfig()
  const dbName: string = config.mongodbDb
  if ((config.mongodbUri || '').startsWith('memory://')) {
    const { MongoMemoryServer } = await import('mongodb-memory-server')
    const mem = await MongoMemoryServer.create()
    return { uri: mem.getUri(), dbName }
  }
  return { uri: config.mongodbUri, dbName }
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = (async () => {
      const { uri, dbName } = await resolveUri()
      return mongoose.connect(uri, { dbName })
    })()
  }
  cached.conn = await cached.promise
  return cached.conn
}
