import mongoose, { Schema } from 'mongoose'
import { EmailThread } from '../types/thread.js'

const ActionItemSchema = new Schema(
  {
    id: { type: String, required: true },
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
    dueDate: { type: String },
    priority: { type: String, enum: ['urgent', 'high', 'medium', 'low'] },
  },
  { _id: false }
)

const SuggestedReplySchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    tone: { type: String, enum: ['professional', 'casual', 'concise', 'decline'], required: true },
    body: { type: String, required: true },
  },
  { _id: false }
)

const AttachmentSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: String, required: true },
    type: { type: String, required: true },
    url: { type: String },
  },
  { _id: false }
)

const MessageSchema = new Schema(
  {
    id: { type: String, required: true },
    sender: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      avatar: { type: String },
    },
    recipients: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
      },
    ],
    timestamp: { type: String, required: true },
    body: { type: String, required: true },
    attachments: [AttachmentSchema],
  },
  { _id: false }
)

const AIAnalysisSchema = new Schema(
  {
    summary: { type: String, default: '' },
    keyPoints: [{ type: String }],
    actionItems: [ActionItemSchema],
    suggestedReplies: [SuggestedReplySchema],
    sentiment: { type: String, enum: ['positive', 'neutral', 'urgent', 'frustrated', 'inquisitive'], default: 'neutral' },
    urgencyScore: { type: Number, default: 5 },
    sentimentScore: { type: Number, default: 75 },
    estimatedReadTime: { type: String, default: '1 min' },
    detectedDeadline: { type: String },
  },
  { _id: false }
)

const ThreadSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    threadId: { type: String },
    folder: {
      type: String,
      enum: ['inbox', 'starred', 'sent', 'drafts', 'archive', 'spam', 'trash'],
      default: 'inbox',
      index: true,
    },
    category: {
      type: String,
      enum: ['all', 'primary', 'work', 'newsletters', 'updates', 'promotions'],
      default: 'work',
      index: true,
    },
    subject: { type: String, required: true },
    preview: { type: String, default: '' },
    timestamp: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    isStarred: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    priority: { type: String, enum: ['urgent', 'high', 'medium', 'low'], default: 'medium' },
    labels: [{ type: String }],
    
    // Conversation History
    messages: [MessageSchema],
    
    // Convenience fields mirroring latest message
    sender: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      avatar: { type: String },
    },
    recipients: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
      },
    ],
    body: { type: String, required: true },
    attachments: [AttachmentSchema],
    
    // AI Classification
    replyResponsibility: {
      type: String,
      enum: ['assistant', 'client', 'none', 'review'],
      default: 'review',
      index: true,
    },
    classificationReason: { type: String, default: '' },
    confidenceScore: { type: Number, default: 0.8 },
    requiresReview: { type: Boolean, default: false },
    isManuallyClassified: { type: Boolean, default: false },
    manualOverrideNote: { type: String },
    
    // Client Status & Takeover
    clientStatus: {
      type: String,
      enum: ['pending', 'handled', 'delegated'],
      default: 'pending',
      index: true,
    },
    takeoverRequested: { type: Boolean, default: false },
    takeoverNote: { type: String },
    handledAt: { type: String },
    
    // AI Analysis
    aiAnalysis: AIAnalysisSchema,
  },
  {
    timestamps: true,
  }
)

export const ThreadModel = mongoose.model<EmailThread>('Thread', ThreadSchema)
