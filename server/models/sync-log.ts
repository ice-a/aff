import mongoose from 'mongoose'

const SyncLogSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['manual', 'scheduled'], required: true },
    status: { type: String, enum: ['running', 'success', 'failed'], default: 'running' },
    platform: { type: String, enum: ['platform1', 'platform2', 'all'], default: 'all' },
    results: [
      {
        platformName: String,
        fetched: Number,
        inserted: Number,
        updated: Number,
        expiredDeleted: Number,
        error: String,
        durationMs: Number,
      },
    ],
    startedAt: { type: Date, default: Date.now },
    finishedAt: { type: Date, default: null },
  },
  { timestamps: true },
)

SyncLogSchema.index({ startedAt: -1 })

export const SyncLogModel =
  (mongoose.models.SyncLog as mongoose.Model<any>) ||
  mongoose.model('SyncLog', SyncLogSchema)
