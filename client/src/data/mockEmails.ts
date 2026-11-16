import type { Email } from '../types/email'

export const INITIAL_EMAILS: Email[] = [
  // 1. CLASSIFICATION: CLIENT (High stakes executive decision requiring Alex Morgan's sign-off)
  {
    id: 'thread-1',
    folder: 'inbox',
    category: 'primary',
    subject: 'Series A Term Sheet: Final Valuation & Board Seat Structure',
    preview: 'Alex, our investment committee has approved the revised term sheet at a $32M post-money valuation. We need your personal sign-off on...',
    timestamp: '10:45 AM',
    isRead: false,
    isStarred: true,
    isArchived: false,
    priority: 'urgent',
    labels: ['Investors', 'Series A', 'High Stakes'],
    
    // Conversation History (Multi-Message Thread)
    messages: [
      {
        id: 'msg-101',
        sender: {
          name: 'Samantha Wright',
          email: 'samantha.w@vanguardventures.com',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        },
        recipients: [{ name: 'Alex Morgan', email: 'alex.morgan@mailpilot.ai' }],
        timestamp: 'Nov 14, 4:15 PM',
        body: `Hi Alex,

Our partners met yesterday to discuss your Q3 traction deck. The committee is aligned on leading your Series A round. Before we issue the binding term sheet, could you confirm your preference regarding the 5-seat board composition (2 Founder, 2 Investor, 1 Independent)?

Best,
Samantha Wright | Partner, Vanguard Ventures`,
      },
      {
        id: 'msg-102',
        sender: {
          name: 'Alex Morgan',
          email: 'alex.morgan@mailpilot.ai',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        },
        recipients: [{ name: 'Samantha Wright', email: 'samantha.w@vanguardventures.com' }],
        timestamp: 'Nov 14, 6:30 PM',
        body: `Hi Samantha,

Thanks for the quick turnaround. We are excited about the partnership. On board structure, we want to ensure the Independent seat is mutually agreed upon prior to close, with founder majority preserved through Phase 1 expansion.

Let's finalize the valuation cap before Thursday.

Warm regards,
Alex`,
      },
      {
        id: 'msg-103',
        sender: {
          name: 'Samantha Wright',
          email: 'samantha.w@vanguardventures.com',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        },
        recipients: [{ name: 'Alex Morgan', email: 'alex.morgan@mailpilot.ai' }],
        timestamp: '10:45 AM (Today)',
        body: `Alex,

Our investment committee has approved the revised term sheet at a $32M post-money valuation with your proposed mutual agreement clause for the Independent seat. 

Attached is the preliminary binding document. We require your personal executive signature or formal written approval before 5:00 PM EST today to secure the lead allocation.

Please let me know if you can sign off today.

Warm regards,
Samantha Wright
Partner | Vanguard Ventures`,
        attachments: [
          {
            id: 'att-101',
            name: 'MailPilot_SeriesA_TermSheet_Final.pdf',
            size: '2.8 MB',
            type: 'pdf',
          },
        ],
      },
    ],
    
    // Convenience mirror of latest message
    sender: {
      name: 'Samantha Wright',
      email: 'samantha.w@vanguardventures.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    recipients: [{ name: 'Alex Morgan', email: 'alex.morgan@mailpilot.ai' }],
    body: `Alex,

Our investment committee has approved the revised term sheet at a $32M post-money valuation with your proposed mutual agreement clause for the Independent seat. 

Attached is the preliminary binding document. We require your personal executive signature or formal written approval before 5:00 PM EST today to secure the lead allocation.

Please let me know if you can sign off today.

Warm regards,
Samantha Wright
Partner | Vanguard Ventures`,
    attachments: [
      {
        id: 'att-101',
        name: 'MailPilot_SeriesA_TermSheet_Final.pdf',
        size: '2.8 MB',
        type: 'pdf',
      },
    ],

    // AI Classification
    replyResponsibility: 'client',
    classificationReason: 'Requires high-stakes executive signature and approval on binding Series A term sheet valuation and board structure.',
    confidenceScore: 0.96,
    requiresReview: false,
    isManuallyClassified: false,
    
    clientStatus: 'pending',
    takeoverRequested: false,

    aiAnalysis: {
      summary: 'Vanguard Ventures approved the $32M post-money valuation Series A term sheet. Partner Samantha Wright requires Alex Morgan\'s personal sign-off before 5:00 PM EST today.',
      keyPoints: [
        '$32M post-money valuation approved with founder-favored independent seat terms.',
        'Requires personal executive signature from Alex Morgan.',
        'Deadline: Today at 5:00 PM EST.',
      ],
      actionItems: [
        {
          id: 'act-1',
          task: 'Review attached Series A term sheet legal covenants',
          completed: false,
          dueDate: 'Today, 2:00 PM',
          priority: 'urgent',
        },
        {
          id: 'act-2',
          task: 'Sign and return binding agreement or confirm terms',
          completed: false,
          dueDate: 'Today, 5:00 PM',
          priority: 'urgent',
        },
      ],
      suggestedReplies: [
        {
          id: 'rep-1',
          title: 'Accept & Sign Term Sheet',
          tone: 'professional',
          body: `Hi Samantha,\n\nI have reviewed the updated terms and am thrilled to accept the $32M valuation structure. I'll execute the attached document and return the signed countersignature shortly.\n\nWarm regards,\nAlex Morgan`,
        },
        {
          id: 'rep-2',
          title: 'Request Brief 15-min Call Before Signing',
          tone: 'concise',
          body: `Hi Samantha,\n\nReceived. The valuation looks good. Let's do a quick 15-minute call at 2:30 PM today to review clause 4.2 before I execute.\n\nThanks,\nAlex`,
        },
      ],
      sentiment: 'positive',
      urgencyScore: 10,
      sentimentScore: 92,
      estimatedReadTime: '2 min',
      detectedDeadline: 'Today at 5:00 PM EST',
    },
  },

  // 2. CLASSIFICATION: ASSISTANT (Administrative scheduling & coordination)
  {
    id: 'thread-2',
    folder: 'inbox',
    category: 'work',
    subject: 'Executive Candidate Interview Coordination: VP of Marketing Finalists',
    preview: 'Hi Alex\'s Office, we have narrowed down the VP of Marketing search to two finalists (David Vance and Cheryl Cole). Could you coordinate their panel schedules...',
    timestamp: '9:15 AM',
    isRead: false,
    isStarred: false,
    isArchived: false,
    priority: 'high',
    labels: ['Recruiting', 'Executive', 'Coordination'],

    messages: [
      {
        id: 'msg-201',
        sender: {
          name: 'Marcus Brody',
          email: 'marcus.brody@huntsearch.com',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        },
        recipients: [
          { name: 'Alex Morgan', email: 'alex.morgan@mailpilot.ai' },
          { name: 'Executive Assistant', email: 'assistant@mailpilot.ai' },
        ],
        timestamp: '9:15 AM (Today)',
        body: `Hi Alex's Office,

We have completed the reference checks for our two VP of Marketing finalists:
1. David Vance (Ex-Figma, VP Growth)
2. Cheryl Cole (Ex-Notion, Head of Brand)

Could your office coordinate their 60-minute panel interviews with Alex and the senior leadership team next Tuesday or Wednesday afternoon? Both candidates have open availability between 1:00 PM and 5:00 PM EST.

Please share the calendar invites and Zoom links once confirmed.

Best regards,
Marcus Brody
Executive Search Lead`,
      },
    ],

    sender: {
      name: 'Marcus Brody',
      email: 'marcus.brody@huntsearch.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    recipients: [
      { name: 'Alex Morgan', email: 'alex.morgan@mailpilot.ai' },
      { name: 'Executive Assistant', email: 'assistant@mailpilot.ai' },
    ],
    body: `Hi Alex's Office,

We have completed the reference checks for our two VP of Marketing finalists:
1. David Vance (Ex-Figma, VP Growth)
2. Cheryl Cole (Ex-Notion, Head of Brand)

Could your office coordinate their 60-minute panel interviews with Alex and the senior leadership team next Tuesday or Wednesday afternoon? Both candidates have open availability between 1:00 PM and 5:00 PM EST.

Please share the calendar invites and Zoom links once confirmed.

Best regards,
Marcus Brody
Executive Search Lead`,

    replyResponsibility: 'assistant',
    classificationReason: 'Standard administrative interview scheduling, calendar alignment, and meeting invite coordination.',
    confidenceScore: 0.94,
    requiresReview: false,
    isManuallyClassified: false,
    
    clientStatus: 'pending',
    takeoverRequested: false,

    aiAnalysis: {
      summary: 'Recruiter Marcus Brody requests calendar coordination for 60-min finalist interviews with David Vance and Cheryl Cole for next Tuesday/Wednesday between 1-5 PM EST.',
      keyPoints: [
        'Two finalists ready for 60-min executive interview panel.',
        'Target dates: Next Tuesday or Wednesday 1:00 PM - 5:00 PM EST.',
        'Assistant can coordinate calendar and issue Zoom invites.',
      ],
      actionItems: [
        {
          id: 'act-201',
          task: 'Check Alex\'s calendar for Tuesday/Wednesday 1-5 PM slots',
          completed: false,
          dueDate: 'Today, 3:00 PM',
          priority: 'medium',
        },
        {
          id: 'act-202',
          task: 'Send calendar invites and Zoom links to Marcus & candidates',
          completed: false,
          dueDate: 'Tomorrow, 11:00 AM',
          priority: 'high',
        },
      ],
      suggestedReplies: [
        {
          id: 'rep-201',
          title: 'Confirm Tuesday Interview Slots',
          tone: 'professional',
          body: `Hi Marcus,\n\nI have reviewed Alex's calendar. We can schedule David Vance on Tuesday at 2:00 PM EST and Cheryl Cole on Tuesday at 3:30 PM EST. I'll issue the calendar invites with Zoom links shortly.\n\nBest,\nMailPilot Executive Office`,
        },
      ],
      sentiment: 'positive',
      urgencyScore: 6,
      sentimentScore: 84,
      estimatedReadTime: '1 min',
      detectedDeadline: 'Next Tuesday/Wednesday',
    },
  },

  // 3. CLASSIFICATION: REVIEW (Ambiguous partnership solicitation with conflicting IP terms)
  {
    id: 'thread-3',
    folder: 'inbox',
    category: 'work',
    subject: 'Strategic Co-development Proposal: OmniCore Integration & Shared IP',
    preview: 'Greetings Alex, we reviewed MailPilot\'s AI architecture and propose an exclusive enterprise integration with OmniCore systems under joint patent ownership...',
    timestamp: 'Yesterday',
    isRead: false,
    isStarred: false,
    isArchived: false,
    priority: 'medium',
    labels: ['Partnership', 'Legal', 'Review Needed'],

    messages: [
      {
        id: 'msg-301',
        sender: {
          name: 'Victor Vance',
          email: 'victor.v@omnicore-technologies.biz',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        },
        recipients: [{ name: 'Alex Morgan', email: 'alex.morgan@mailpilot.ai' }],
        timestamp: 'Yesterday, 3:20 PM',
        body: `Greetings Alex,

We have been analyzing MailPilot's AI email workflow engine and believe an integrated white-label partnership with OmniCore's ERP ecosystem could unlock $4M in ARR. 

However, per our standard corporate development charter, any joint machine-learning pipeline improvements or derivative patent filings must remain shared intellectual property with a 3-year mutual non-compete clause.

Let us know if you are open to discussing terms over a virtual coffee this Thursday.

Sincerely,
Victor Vance
Head of Strategic Alliances | OmniCore Technologies`,
      },
    ],

    sender: {
      name: 'Victor Vance',
      email: 'victor.v@omnicore-technologies.biz',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    },
    recipients: [{ name: 'Alex Morgan', email: 'alex.morgan@mailpilot.ai' }],
    body: `Greetings Alex,

We have been analyzing MailPilot's AI email workflow engine and believe an integrated white-label partnership with OmniCore's ERP ecosystem could unlock $4M in ARR. 

However, per our standard corporate development charter, any joint machine-learning pipeline improvements or derivative patent filings must remain shared intellectual property with a 3-year mutual non-compete clause.

Let us know if you are open to discussing terms over a virtual coffee this Thursday.

Sincerely,
Victor Vance
Head of Strategic Alliances | OmniCore Technologies`,

    replyResponsibility: 'review',
    classificationReason: 'Unsolicited strategic partnership with aggressive IP co-ownership and non-compete constraints from an unverified business domain. Low confidence triage.',
    confidenceScore: 0.62,
    requiresReview: true,
    isManuallyClassified: false,
    
    clientStatus: 'pending',
    takeoverRequested: false,

    aiAnalysis: {
      summary: 'OmniCore proposed an ERP white-label integration claiming $4M ARR potential, but demands shared IP on ML pipelines and a restrictive 3-year non-compete. Human review recommended.',
      keyPoints: [
        'Unverified sender domain (omnicore-technologies.biz).',
        'Controversial clause: Demands shared IP on ML pipeline derivatives.',
        '3-year restrictive non-compete constraint proposed.',
      ],
      actionItems: [
        {
          id: 'act-301',
          task: 'Assistant to verify OmniCore corporate credentials & business standing',
          completed: false,
          dueDate: 'Tomorrow',
          priority: 'medium',
        },
      ],
      suggestedReplies: [
        {
          id: 'rep-301',
          title: 'Polite Decline Citing Closed IP Policy',
          tone: 'decline',
          body: `Hi Victor,\n\nThank you for reaching out. At this stage, MailPilot does not enter into joint IP ownership agreements or non-compete arrangements. We appreciate your interest and wish you the best with OmniCore.\n\nBest regards,\nAlex Morgan`,
        },
      ],
      sentiment: 'neutral',
      urgencyScore: 4,
      sentimentScore: 50,
      estimatedReadTime: '2 min',
    },
  },

  // 4. CLASSIFICATION: NONE (Informational newsletter / receipts)
  {
    id: 'thread-4',
    folder: 'inbox',
    category: 'updates',
    subject: 'Cloudflare Zero Trust & Webhook Ingress Weekly Security Report',
    preview: 'Weekly Automated Digest: All 12 enterprise edge ingress endpoints operating normally. 0 DDoS incidents detected. 99.998% uptime achieved...',
    timestamp: 'Nov 13',
    isRead: true,
    isStarred: false,
    isArchived: false,
    priority: 'low',
    labels: ['Security', 'Automated', 'DevOps'],

    messages: [
      {
        id: 'msg-401',
        sender: {
          name: 'Cloudflare Security',
          email: 'no-reply@notify.cloudflare.com',
          avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        },
        recipients: [{ name: 'Alex Morgan', email: 'alex.morgan@mailpilot.ai' }],
        timestamp: 'Nov 13, 2:00 AM',
        body: `Weekly Automated Infrastructure Health Report:

All 12 enterprise ingress endpoints are operating normally across our global edge network.
- Total Requests Processed: 1,842,900
- Threat Mitigation: 34 bot scrape attempts blocked
- WAF Rule Triggers: 0 false positives
- Edge Uptime: 99.998%

No configuration changes are required on your origin servers. This is an automated notification.`,
      },
    ],

    sender: {
      name: 'Cloudflare Security',
      email: 'no-reply@notify.cloudflare.com',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    },
    recipients: [{ name: 'Alex Morgan', email: 'alex.morgan@mailpilot.ai' }],
    body: `Weekly Automated Infrastructure Health Report:

All 12 enterprise ingress endpoints are operating normally across our global edge network.
- Total Requests Processed: 1,842,900
- Threat Mitigation: 34 bot scrape attempts blocked
- WAF Rule Triggers: 0 false positives
- Edge Uptime: 99.998%

No configuration changes are required on your origin servers. This is an automated notification.`,

    replyResponsibility: 'none',
    classificationReason: 'Automated weekly system health report from no-reply sender. Read-only informational bulletin requiring zero response.',
    confidenceScore: 0.99,
    requiresReview: false,
    isManuallyClassified: false,
    
    clientStatus: 'pending',
    takeoverRequested: false,

    aiAnalysis: {
      summary: 'Cloudflare weekly security report confirming 99.998% uptime and zero infrastructure threats across all 12 edge ingress endpoints. No response necessary.',
      keyPoints: [
        '1.84M requests processed with 99.998% uptime.',
        'Zero false positives or active threats.',
        'Read-only automated message.',
      ],
      actionItems: [],
      suggestedReplies: [],
      sentiment: 'neutral',
      urgencyScore: 1,
      sentimentScore: 65,
      estimatedReadTime: '1 min',
    },
  },

  // 5. REALISTIC CLIENT TAKEOVER SCENARIO: (Client delegated to assistant with explicit instructions)
  {
    id: 'thread-5',
    folder: 'inbox',
    category: 'work',
    subject: 'Acme Corp Enterprise License Renewal: 150 Seats & Custom SLA Terms',
    preview: 'Hey Alex, Acme Corp is ready to sign the 150-seat annual agreement, but their legal team added a 99.99% custom SLA penalty clause...',
    timestamp: 'Nov 12',
    isRead: true,
    isStarred: true,
    isArchived: false,
    priority: 'high',
    labels: ['Sales', 'Enterprise', 'Takeover'],

    messages: [
      {
        id: 'msg-501',
        sender: {
          name: 'Liam Chen',
          email: 'liam.chen@mailpilot.ai',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        },
        recipients: [{ name: 'Alex Morgan', email: 'alex.morgan@mailpilot.ai' }],
        timestamp: 'Nov 12, 11:30 AM',
        body: `Hey Alex,

Acme Corp completed their trial and is ready to sign for 150 seats on our annual tier ($54,000 ARR). 

However, their procurement counsel added a strict 99.99% uptime penalty clause requiring a 20% billing credit if monthly downtime exceeds 4 minutes. 

Do you approve this custom SLA, or should we counter with our standard 99.9% uptime SLA?`,
      },
    ],

    sender: {
      name: 'Liam Chen',
      email: 'liam.chen@mailpilot.ai',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    recipients: [{ name: 'Alex Morgan', email: 'alex.morgan@mailpilot.ai' }],
    body: `Hey Alex,

Acme Corp completed their trial and is ready to sign for 150 seats on our annual tier ($54,000 ARR). 

However, their procurement counsel added a strict 99.99% uptime penalty clause requiring a 20% billing credit if monthly downtime exceeds 4 minutes. 

Do you approve this custom SLA, or should we counter with our standard 99.9% uptime SLA?`,

    // Initially was client, but client clicked "Delegate to Assistant"
    replyResponsibility: 'assistant',
    classificationReason: 'Client delegated negotiation to Assistant with custom counter-offer terms.',
    confidenceScore: 0.95,
    requiresReview: false,
    isManuallyClassified: true,
    manualOverrideNote: 'Delegated by Client (Alex Morgan)',
    
    clientStatus: 'delegated',
    takeoverRequested: true,
    takeoverNote: 'Please have our engineering team review our historical uptime first, then counter-propose a 99.95% SLA with a 10% credit cap. We cannot accept 99.99% without premium enterprise pricing.',
    handledAt: 'Nov 12, 1:45 PM',

    aiAnalysis: {
      summary: 'Acme Corp wants 150 seats ($54k ARR) but demands a 99.99% SLA penalty. Client Alex Morgan delegated to Assistant to counter with 99.95% SLA and 10% credit cap.',
      keyPoints: [
        '$54,000 ARR contract at stake.',
        'Client delegated with specific counter-offer strategy.',
        'Assistant must coordinate with Liam Chen.',
      ],
      actionItems: [
        {
          id: 'act-501',
          task: 'Draft reply to Liam Chen with 99.95% SLA counter-proposal',
          completed: false,
          dueDate: 'Today, 4:00 PM',
          priority: 'high',
        },
      ],
      suggestedReplies: [
        {
          id: 'rep-501',
          title: 'Send Delegated Counter-Offer to Liam',
          tone: 'professional',
          body: `Hi Liam,\n\nAlex reviewed the Acme terms and requested we counter with our enterprise 99.95% uptime SLA with a 10% credit cap. Please update the order schedule and send back to their procurement team.\n\nBest,\nExecutive Office`,
        },
      ],
      sentiment: 'positive',
      urgencyScore: 8,
      sentimentScore: 85,
      estimatedReadTime: '2 min',
      detectedDeadline: 'End of week close',
    },
  },

  // 6. CLIENT-HANDLED SCENARIO: (Client already handled this email)
  {
    id: 'thread-6',
    folder: 'inbox',
    category: 'work',
    subject: 'Board Dinner Reservations & Special Guest Confirmation',
    preview: 'Hi Alex, confirming the private dining room at Quince is reserved for Wednesday night at 7:30 PM with all 6 attendees confirmed...',
    timestamp: 'Nov 11',
    isRead: true,
    isStarred: false,
    isArchived: false,
    priority: 'low',
    labels: ['Board', 'Dinner', 'Handled'],

    messages: [
      {
        id: 'msg-601',
        sender: {
          name: 'Chef Concierge | Quince',
          email: 'reservations@quincerestaurant.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        },
        recipients: [{ name: 'Alex Morgan', email: 'alex.morgan@mailpilot.ai' }],
        timestamp: 'Nov 11, 4:00 PM',
        body: `Dear Alex,

We are delighted to confirm your private salon reservation for the MailPilot Board Dinner this Wednesday at 7:30 PM. 

Special dietary requirements for all 6 confirmed guests have been noted with Chef Michael. 

Please reply if any beverage pairings or menu modifications are desired.`,
      },
    ],

    sender: {
      name: 'Chef Concierge | Quince',
      email: 'reservations@quincerestaurant.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    recipients: [{ name: 'Alex Morgan', email: 'alex.morgan@mailpilot.ai' }],
    body: `Dear Alex,

We are delighted to confirm your private salon reservation for the MailPilot Board Dinner this Wednesday at 7:30 PM. 

Special dietary requirements for all 6 confirmed guests have been noted with Chef Michael. 

Please reply if any beverage pairings or menu modifications are desired.`,

    replyResponsibility: 'client',
    classificationReason: 'Personal dining reservation for executive board dinner.',
    confidenceScore: 0.91,
    requiresReview: false,
    isManuallyClassified: false,
    
    clientStatus: 'handled',
    takeoverRequested: false,
    handledAt: 'Nov 11, 5:12 PM',

    aiAnalysis: {
      summary: 'Quince confirmed private salon board dinner for 6 guests this Wednesday at 7:30 PM. Handled by client.',
      keyPoints: ['Reservation confirmed for 6 guests.', 'Dietary preferences noted.', 'Resolved by Alex.'],
      actionItems: [],
      suggestedReplies: [],
      sentiment: 'positive',
      urgencyScore: 2,
      sentimentScore: 90,
      estimatedReadTime: '1 min',
    },
  },
]
