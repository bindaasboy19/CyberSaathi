# CyberSaathi

CyberSaathi is a full-stack cybercrime awareness and assistance platform for Indian users. It combines AI guidance, scam analysis, structured reporting, awareness content, legal orientation, community Q&A, blogs/case sharing, and cyber news in one production-ready Next.js application.

## Stack

- Next.js 16 App Router
- Tailwind CSS 4
- Firebase Auth + Firestore + Storage
- OpenAI or Gemini via AI SDK
- Vercel-ready frontend deployment

## Core modules

- Authentication with Firebase email/password
- Role-aware user profiles: `user`, `expert`, `admin`
- AI Cyber Assistant with guest mode and Firestore chat persistence
- Legal AI Assistant for legal-process guidance, evidence checklists, and complaint drafts
- Awareness Hub for phishing, UPI fraud, identity theft, and response playbooks
- Legal knowledge section for Indian cyber law basics
- Community Q&A with answers and upvotes
- Blog and case sharing with comments and likes
- Scam report module with structured evidence fields
- Cyber news feed through an API route
- English/Hindi toggle
- Bonus tools: Scam Analyzer and Cyber Safety Score

## Firestore collections

- `users`
- `posts`
- `comments`
- `questions`
- `answers`
- `chat_history`
- `reports`
- `legal_cases`

Rules, indexes, and storage rules are included in:

- `firestore.rules`
- `firestore.indexes.json`
- `storage.rules`
- `firebase.json`

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in:

- Firebase client keys
- `OPENAI_API_KEY` with `AI_PROVIDER=openai`
  or
- `GOOGLE_GENERATIVE_AI_API_KEY` with `AI_PROVIDER=google`
- `GNEWS_API_KEY` if you want live news instead of the fallback feed

3. Start the app:

```bash
npm run dev
```

4. Run checks:

```bash
npm run lint
npm run typecheck
npm run build
```

## Firebase configuration

Create a Firebase project and enable:

- Authentication → Email/Password
- Firestore Database
- Storage

Then deploy the rules and indexes:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

Recommended Firestore fields:

- `users/{uid}`: `name`, `email`, `role`, `preferredLanguage`, `createdAt`
- `chat_history/{chatId}`: `userId`, `title`, `language`, `messages`, `lastMessage`, `createdAt`, `updatedAt`
- `reports/{reportId}`: `userId`, `type`, `description`, `amountLost`, `contactMethod`, `location`, `status`, `createdAt`
- `legal_cases/{caseId}`: `userId`, `problemType`, `description`, `generatedReport`, `status`, `createdAt`

## Deployment

### Vercel

1. Import the repository into Vercel.
2. Add the same environment variables from `.env.local`.
3. Deploy.

### Firebase

Use Firebase for Auth, Firestore, Storage, and optional future Cloud Functions. The current implementation uses Firestore client writes plus App Router API routes for AI and news.

## Project structure

```text
src/
  app/
    api/
      assistant/
      analyze-scam/
      news/
    assistant/
    blog/
    community/
    learn/
    login/
    news/
    register/
    report/
  components/
    assistant/
    auth/
    blog/
    community/
    layout/
    news/
    providers/
    report/
    ui/
  lib/
    ai/
    data/
    firebase/
    validation/
    scam-analysis.ts
    i18n.ts
    utils.ts
  types/
```

## Notes

- Guest users can use the assistant, but chat persistence requires sign-in.
- If AI keys are missing, CyberSaathi falls back to a local cyber-safety guidance engine instead of failing.
- If the news API is missing, the news section falls back to bundled awareness headlines.
- Security rules are included, but for production you may later want dedicated vote/like subcollections to make abuse controls stricter.
