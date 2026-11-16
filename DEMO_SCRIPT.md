# MailPilot AI — Presentation & Demo Video Script

**Duration:** ~2 minutes 30 seconds  
**Target Audience:** Internship Evaluation Committee / Technical Evaluators  
**Application URL:** `http://127.0.0.1:5173` (Dev) or `http://127.0.0.1:5000` (Production)

---

## 🎬 Scene-by-Scene Walkthrough

### Scene 1: Introduction (0:00 - 0:25)
- **Visual:** Full view of the Executive Assistant Dashboard (`http://127.0.0.1:5173`). Clean white background, purple accents, 3-pane layout.
- **Action:** Mouse hovers over the header logo and persona switcher.
- **Narrator (You):**
  > *"Hello! I am presenting MailPilot AI, an intelligent personal assistant email management dashboard. High-performing executives and founders receive hundreds of emails daily. The challenge is deciding what requires urgent personal attention versus what an assistant can handle. MailPilot AI solves this using React, TypeScript, Node.js, Express, and the Google Gemini API to analyze multi-message threads, assign reply responsibilities, extract actionable deadlines, and provide seamless human-in-the-loop workflows."*

---

### Scene 2: Assistant Workspace & AI Triage Queues (0:25 - 0:50)
- **Visual:** Focus on the left sidebar and email list.
- **Action:** Click on the AI queue filters: `Assistant to Reply`, `Client to Reply`, `Needs Review`, and `No Reply Needed`.
- **Narrator (You):**
  > *"In the Executive Assistant view, all incoming threads are automatically triaged by the AI into four clear responsibilities:*
  > 1. *Client to Reply — for high-stakes approvals and term sheets.*
  > 2. *Assistant to Reply — for administrative scheduling and logistics.*
  > 3. *Needs Review — for ambiguous queries or unverified senders.*
  > 4. *No Reply Needed — for automated digests and receipts.*
  > *Each thread displays confidence badges and concise classification reasoning."*

---

### Scene 3: Live Gemini AI Copilot (0:50 - 1:15)
- **Visual:** Select the second email thread: *"Executive Candidate Interview Coordination: VP of Marketing Finalists"*.
- **Action:** Click the purple **"Run Live Gemini Analysis"** button in the AI Copilot pane. Watch the loading spinner and then the real-time update.
- **Narrator (You):**
  > *"When we select this VP candidate interview thread, the right-hand panel hosts our AI Copilot. Clicking 'Run Live Gemini Analysis' triggers a real-time call to the genuine Google Gemini API using gemini-3.5-flash-lite. In just two seconds, Gemini delivers:*
  > - *An Executive TL;DR summary.*
  > - *Key extracted points.*
  > - *Action items with explicit deadlines.*
  > - *Three ready-to-send reply drafts across professional, concise, and detailed tones."*

---

### Scene 4: Manual Override & Protection Shield (1:15 - 1:40)
- **Visual:** In the email header, change the classification dropdown from **"Assistant"** to **"Client"**.
- **Action:** Show the green shield icon appear with the label: *"Protected Manual Override"*. Click **"Run Live Gemini Analysis"** once more.
- **Narrator (You):**
  > *"One of our core architecture requirements is protecting human judgment. If the executive assistant knows Alex wants to conduct this interview personally, they can reclassify it to 'Client to Reply'. Notice the green 'Protected' shield badge appears immediately. Even if we run the Gemini AI analysis again, our backend safeguards the human decision—updating the summaries and drafts while strictly preserving the human classification."*

---

### Scene 5: Client Executive Dashboard & Delegation (1:40 - 2:05)
- **Visual:** Click the top persona switcher: **"Switch to Client (Alex)"**.
- **Action:** The Client Dashboard opens. Show the focused view. Click **"Delegate to Assistant"** on an email, pick a quick instruction chip (*"Please counter-propose a 99.95% SLA"*), and click **"Confirm Delegation"**.
- **Narrator (You):**
  > *"Now, let's switch to the Client Persona for Alex Morgan. Notice how clean and focused this view is—zero clutter, zero automated receipts, showing only emails that strictly need the client's decision. Alex can read original threads, view AI summaries, or delegate instantly. Clicking 'Delegate to Assistant', Alex adds custom instructions and confirms. The item is instantly cleared from Alex's view."*

---

### Scene 6: Real-time Synchronization & Conclusion (2:05 - 2:30)
- **Visual:** Toggle back to **"Executive Assistant"** persona.
- **Action:** Show the top banner alert: *"Client Takeover Request waiting for your assistance"*, and open the Takeover Queue.
- **Narrator (You):**
  > *"Switching back to the Assistant Dashboard, the change is synchronized in real-time. The assistant receives an immediate notification banner, and the delegated thread appears in the Takeover queue with Alex's custom notes highlighted. MailPilot AI is responsive on desktop and mobile, runs with zero-dependency in-memory storage or MongoDB, and is 100% ready for production deployment. Thank you!"*

---

## 💡 Quick Tips for the Presenter
1. **Show, Don't Tell:** Keep the mouse moving smoothly with your voice.
2. **Highlight the Key Rubric Items:**
   - AI Reply Responsibility classification (`client`, `assistant`, `review`, `none`).
   - Separate Client Dashboard.
   - Manual classification with protected status.
   - Genuine Gemini API integration.
   - Dual-dashboard synchronization.
