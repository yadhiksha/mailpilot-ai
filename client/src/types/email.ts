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

export type UserPersona = 'assistant' | 'client'

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
  urgencyScore: number // 1 to 10
  sentimentScore: number // 0 to 100
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

export interface Email {
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
  
  // Conversation & Multi-Message Thread History
  messages: Message[]
  
  // Legacy single-message convenience accessors (mirrors latest message)
  sender: EmailParticipant
  recipients: EmailParticipant[]
  body: string
  attachments?: EmailAttachment[]
  
  // AI Reply Responsibility Classification
  replyResponsibility: ReplyResponsibility
  classificationReason: string
  confidenceScore: number // 0.0 to 1.0
  requiresReview: boolean
  isManuallyClassified: boolean
  manualOverrideNote?: string
  
  // Client Delegation & Handled Status
  clientStatus: ClientStatus
  takeoverRequested: boolean
  takeoverNote?: string
  handledAt?: string
  
  // AI Content Analysis
  aiAnalysis?: AIAnalysis
}

export interface EmailFilterState {
  folder: EmailFolder
  category: EmailCategory
  searchQuery: string
  priorityFilter: PriorityLevel | 'all'
  responsibilityFilter: ReplyResponsibility | 'all' | 'takeover'
  unreadOnly: boolean
  hasAttachments: boolean
  hasActionItems: boolean
}
