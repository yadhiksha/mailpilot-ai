export type EmailFolder =
  | 'inbox'
  | 'starred'
  | 'sent'
  | 'drafts'
  | 'archive'
  | 'spam'
  | 'trash'

export type EmailCategory =
  | 'all'
  | 'primary'
  | 'work'
  | 'newsletters'
  | 'updates'
  | 'promotions'

export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low'

export type SentimentType = 'positive' | 'neutral' | 'urgent' | 'frustrated' | 'inquisitive'

export type ReplyResponsibility = 'assistant' | 'client' | 'none' | 'review'

export type ClientStatus = 'pending' | 'handled' | 'delegated'

export interface ActionItem {
  id: string
  task: string
  completed: boolean
  dueDate?: string
  priority?: PriorityLevel
}

export interface SuggestedReply {
  id: string
  title: string
  tone: 'professional' | 'casual' | 'concise' | 'decline'
  body: string
}

export interface AIAnalysis {
  summary: string
  keyPoints: string[]
  actionItems: ActionItem[]
  suggestedReplies: SuggestedReply[]
  sentiment: SentimentType
  urgencyScore: number
  sentimentScore: number
  estimatedReadTime: string
  detectedDeadline?: string
}

export interface EmailAttachment {
  id: string
  name: string
  size: string
  type: 'pdf' | 'doc' | 'image' | 'zip' | 'spreadsheet' | 'code'
  url?: string
}

export interface EmailParticipant {
  name: string
  email: string
  avatar?: string
}

export interface Message {
  id: string
  sender: EmailParticipant
  recipients: EmailParticipant[]
  timestamp: string
  body: string
  attachments?: EmailAttachment[]
}

export interface EmailThread {
  id: string
  threadId?: string
  folder: EmailFolder
  category: EmailCategory
  subject: string
  preview: string
  timestamp: string
  isRead: boolean
  isStarred: boolean
  isArchived: boolean
  priority: PriorityLevel
  labels: string[]
  
  // Conversation History
  messages: Message[]
  
  // Mirror fields of latest message for fast querying
  sender: EmailParticipant
  recipients: EmailParticipant[]
  body: string
  attachments?: EmailAttachment[]
  
  // AI Classification
  replyResponsibility: ReplyResponsibility
  classificationReason: string
  confidenceScore: number
  requiresReview: boolean
  isManuallyClassified: boolean
  manualOverrideNote?: string
  
  // Client Status & Takeover
  clientStatus: ClientStatus
  takeoverRequested: boolean
  takeoverNote?: string
  handledAt?: string
  
  // AI Analysis
  aiAnalysis?: AIAnalysis
  
  createdAt?: string
  updatedAt?: string
}
