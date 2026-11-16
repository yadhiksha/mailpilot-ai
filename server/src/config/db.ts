import mongoose from 'mongoose'
import { EmailThread } from '../types/thread.js'
import { INITIAL_THREADS } from '../data/seedData.js'
import { ThreadModel } from '../models/Thread.js'

let isMongoConnected = false

// In-Memory store fallback
let inMemoryThreads: EmailThread[] = JSON.parse(JSON.stringify(INITIAL_THREADS))

export async function initDatabase(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    console.log('\n[Database] MONGODB_URI not set.')
    console.log('[Database] ℹ Active Storage: IN-MEMORY STORE (Temporary prototype mode. Resets on server restart).')
    console.log('[Database] Seeded with 6 realistic multi-message threads.\n')
    return
  }

  try {
    console.log(`[Database] Attempting connection to MongoDB: ${mongoUri.replace(/:([^:@]+)@/, ':****@')}`)
    // Set 2.5s connection timeout so the server doesn't hang if MongoDB is offline
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    })
    isMongoConnected = true
    console.log('[Database] ✓ Connected to MongoDB successfully.')

    // Seed MongoDB if empty
    const count = await ThreadModel.countDocuments()
    if (count === 0) {
      console.log('[Database] Seeding initial threads into MongoDB...')
      await ThreadModel.insertMany(INITIAL_THREADS)
      console.log(`[Database] ✓ Seeded ${INITIAL_THREADS.length} threads into MongoDB.`)
    }
  } catch (err: any) {
    console.warn(`[Database] ⚠ MongoDB connection failed (${err.message}).`)
    console.log('[Database] ℹ Gracefully activating IN-MEMORY FALLBACK STORE.')
    console.log('[Database] ℹ NOTE: In-Memory data is temporary and resets when the server restarts.\n')
    isMongoConnected = false
  }
}

// Unified Data Access Layer
export const threadRepository = {
  isUsingMongo: () => isMongoConnected,

  async getAll(): Promise<EmailThread[]> {
    if (isMongoConnected) {
      const docs = await ThreadModel.find().sort({ updatedAt: -1 }).lean()
      return docs as unknown as EmailThread[]
    }
    return inMemoryThreads
  },

  async getById(id: string): Promise<EmailThread | null> {
    if (isMongoConnected) {
      const doc = await ThreadModel.findOne({ id }).lean()
      return (doc as unknown as EmailThread) || null
    }
    const found = inMemoryThreads.find((t) => t.id === id)
    return found ? JSON.parse(JSON.stringify(found)) : null
  },

  async create(thread: EmailThread): Promise<EmailThread> {
    if (isMongoConnected) {
      const created = await ThreadModel.create(thread)
      return created.toObject() as unknown as EmailThread
    }
    inMemoryThreads.unshift(thread)
    return thread
  },

  async update(id: string, updates: Partial<EmailThread>): Promise<EmailThread | null> {
    if (isMongoConnected) {
      const updated = await ThreadModel.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean()
      return (updated as unknown as EmailThread) || null
    }
    const index = inMemoryThreads.findIndex((t) => t.id === id)
    if (index === -1) return null

    inMemoryThreads[index] = {
      ...inMemoryThreads[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return inMemoryThreads[index]
  },

  async delete(id: string): Promise<boolean> {
    if (isMongoConnected) {
      const res = await ThreadModel.deleteOne({ id })
      return res.deletedCount > 0
    }
    const initialLength = inMemoryThreads.length
    inMemoryThreads = inMemoryThreads.filter((t) => t.id !== id)
    return inMemoryThreads.length < initialLength
  },

  async resetSeed(): Promise<void> {
    if (isMongoConnected) {
      await ThreadModel.deleteMany({})
      await ThreadModel.insertMany(INITIAL_THREADS)
    } else {
      inMemoryThreads = JSON.parse(JSON.stringify(INITIAL_THREADS))
    }
  },
}
