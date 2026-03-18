Saver-ur
Product Requirements Document (PRD)
Download videos instantly --- fast, simple, and beautifully purple

Field             Details

Document Version      1.0
Status                Draft --- Ready for Review
Product Name          Saver-ur
Document Owner        Product Team
Last Updated          2025
Classification        Confidential
1. Executive Summary
Saver-ur is a web-based video downloading platform that enables users to
save videos from major social media and video-sharing platforms directly
to their device. By combining a clean, modern purple-themed UI with fast
backend processing, Saver-ur targets a broad audience --- from students
and content creators to everyday users who need a frictionless,
zero-installation download experience.
This PRD defines the complete product requirements for the MVP release
and lays out the post-launch enhancement roadmap. It covers user
personas, functional and non-functional requirements, technical
architecture, UI/UX specifications, acceptance criteria, authentication
strategy (Clerk), risk analysis, and success metrics.
2. Product Vision & Goals
2.1 Vision Statement
To be the fastest, simplest, and most visually polished video downloader
on the web --- one that any user, regardless of technical skill, can use
confidently in under 30 seconds.
2.2 Business Goals

Achieve 10,000 daily active users within 3 months of launch
Maintain a video processing success rate of ≥95%
Keep average page load time under 2 seconds on 4G connections
Establish Saver-ur as a recognisable brand in the browser-based
downloader space
Build a scalable foundation for premium features: batch downloads,
browser extension, accounts

2.3 Product Goals by Priority

Goal            Description                         Priority

Simple UX           One-input flow --- paste URL, click     P0
download, choose format
Multi-platform      YouTube, Instagram, Facebook at launch  P0
support             (expandable)
Format flexibility  MP4 video + MP3 audio, multiple quality P0
tiers
Speed               Processing under 5 seconds for standard P1
videos
Responsive design   Full mobile + desktop parity            P1
Error transparency  Clear, actionable error messages for    P1
all failure cases
Authentication      Optional sign-up/login for history and  P1
(Clerk)             preferences
Legal compliance    Disclaimer, no copyright violations,    P1
DMCA-ready policy
3. User Personas
3.1 Primary Personas
+----------+-----------------------------------------------------------+
| P1       | Age: 19 | Tech comfort: Medium                           |
|          |                                                           |
| Priya  | Needs: Downloads lecture videos, documentary clips, and   |
| /        | YouTube tutorials for offline study.                      |
| S        |                                                           |
| tudent | Pain points: Ad-heavy competitor sites, confusing         |
|          | multi-step flows.                                         |
|          |                                                           |
|          | Goal: Paste URL and download in under 30 seconds --- no   |
|          | sign-up required.                                         |
+----------+-----------------------------------------------------------+
+----------+-----------------------------------------------------------+
| P2       | Age: 27 | Tech comfort: High                             |
|          |                                                           |
| Arjun  | Needs: Saves competitor reels, reference videos, and      |
| /        | inspiration clips. Wants 1080p MP4.                       |
| C        |                                                           |
| reator | Pain points: Limited quality options; slow processing on  |
|          | other tools.                                              |
|          |                                                           |
|          | Goal: Fast, high-quality download with format choice.     |
|          | Would use an account to save history.                     |
+----------+-----------------------------------------------------------+
+----------+-----------------------------------------------------------+
| P3       | Age: 52 | Tech comfort: Low                              |
|          |                                                           |
| Rajan  | Needs: Downloads Facebook family videos and               |
| /        | WhatsApp-shared content.                                  |
| G        |                                                           |
| eneral | Pain points: Overwhelmed by complex UIs; fears malware on |
|          | unfamiliar sites.                                         |
|          |                                                           |
|          | Goal: Extremely simple interface --- one button, no       |
|          | confusion, safe download.                                 |
+----------+-----------------------------------------------------------+
3.2 User Pain Points with Existing Solutions

Intrusive ads and pop-ups on competing downloader sites
Confusing multi-step flows requiring multiple clicks or page reloads
No mobile-optimised experience
Slow processing and frequent unexplained failures
Lack of format and quality choice
No user account to track download history

4. Scope
4.1 In Scope --- MVP

URL input field with platform auto-detection and validation
Video metadata preview: thumbnail, title, duration
Download format options: MP4 (video) and MP3 (audio)
Quality selector: 144p, 360p, 720p, 1080p (greyed out when
unavailable)
Platform support: YouTube, Instagram, Facebook
Animated loading / progress indicator during processing
Responsive design: mobile-first, all screen sizes
Error handling: invalid URL, unsupported platform, processing
failure, timeout
Clerk authentication: optional sign-up/login for history and
preferences
Legal disclaimer displayed prominently on homepage and download
results

4.2 Out of Scope --- MVP

Download history UI (requires authenticated account --- post-MVP)
Browser extension
Batch downloads
Dark mode toggle
Twitter/X, TikTok, Pinterest, Vimeo support
Payment / premium subscription tier

5. Functional Requirements
5.1 URL Input & Validation

ID   Requirement           Priority   Acceptance Criteria

FR-01    Accept any pasted or      P0             Input accepts text up to 2,048
typed URL                                characters
FR-02    Auto-detect supported     P0             Platform badge appears within 300
platform from URL pattern                ms of input change
FR-03    Validate URL format       P0             Invalid URLs show inline red error
before submission                        message
FR-04    Show error for            P0             Displays supported platform list
unsupported platforms                    in error state
FR-05    Clear / reset button      P1             Single click clears input and
resets all UI state
5.2 Video Processing

ID   Requirement           Priority   Acceptance Criteria

FR-06    Fetch video metadata from P0             Title, thumbnail, duration
URL                                      returned in < 3 s
FR-07    Display video thumbnail   P0             Thumbnail renders at correct 16:9
preview                                  aspect ratio
FR-08    Show video title and      P0             Title truncated at 80 chars with
duration                                 ellipsis
FR-09    Animated progress         P0             Spinner visible from submit click
indicator during                         until options ready
processing
FR-10    Handle backend timeout    P0             Timeout at 15 s triggers retry
gracefully                               option + clear message
5.3 Download Options

ID   Requirement           Priority   Acceptance Criteria

FR-11    MP4 video download option P0             MP4 link generated and functional;
file plays correctly
FR-12    MP3 audio extraction      P0             Audio stripped from video; file
option                                   plays correctly
FR-13    Quality selector: 144p,   P0             Unavailable qualities greyed out
360p, 720p, 1080p                        (not hidden)
FR-14    One-click download        P0             Single button initiates browser
trigger                                  file download to device
FR-15    Estimated file size per   P1             File size displayed alongside each
quality option                           quality label
5.4 Authentication (Clerk)

ID   Requirement           Priority   Acceptance Criteria

FR-16    Clerk sign-up / login     P1             Clerk UI opens from header;
modal                                    supports email + Google OAuth
FR-17    Guest mode --- no account P0             All download features accessible
required                                 without login
FR-18    Authenticated user sees   P1             Last 50 downloads shown in
download history                         /dashboard route
FR-19    Clerk session persists    P1             User remains logged in on page
across tabs/refresh                      refresh
FR-20    Logout clears session and P1             Session token removed; dashboard
redirects to home                        becomes inaccessible
5.5 Error Handling Matrix

Error Scenario  User-Facing Message   Recovery Action

Invalid URL format  Please enter a valid      Highlight input field;
video URL                 allow re-entry
Unsupported         This platform is not yet  Show list of supported
platform            supported                 platforms
Private /           This video is private or  Suggest checking video
restricted video    restricted                privacy settings
Processing timeout  Processing took too long  Show Retry button
(> 15 s)           --- please try again
Network error       Unable to connect ---     Show Retry button
check your internet
connection
No formats          No downloadable formats   Report Issue link +
available           found for this video      alternative suggestion
Clerk session       Your session has expired  Clerk re-auth modal opens
expired             --- please sign in again  automatically
6. Non-Functional Requirements

Category    Requirement          Target Metric

Performance     Page load time           < 2 s (Lighthouse Performance
score ≥ 85)
Performance     Video processing time    < 5 s for videos up to 10
minutes
Availability    Platform uptime          ≥ 99% monthly uptime
Scalability     Concurrent processing    Handle 500 concurrent download
jobs without degradation
Security        Input sanitisation       All URL inputs sanitised; zero
XSS or injection
vulnerabilities
Security        Download safety          HTTPS enforced; files served
over time-limited signed URLs
Security        Authentication           Clerk manages all session
tokens; no custom auth secrets
stored server-side
Compatibility   Browser support          Chrome 90+, Firefox 88+, Safari
14+, Edge 90+
Compatibility   Device support           iOS / Android mobile + Windows
/ macOS / Linux desktop
Accessibility   Keyboard navigation      Full tab navigation; WCAG 2.1
AA compliant
SEO             Lighthouse SEO score     ≥ 90
7. Technical Architecture
7.1 Frontend Stack

Component    Technology        Rationale

Framework        React (Vite)          Fast HMR, component reusability,
large ecosystem
Styling          Tailwind CSS + CSS    Utility-first; easy purple theme
variables             tokens
State management React Context +       Lightweight; no Redux overhead at
useState              MVP scale
HTTP client      Axios                 Promise-based; interceptors for
centralised error handling
Authentication   Clerk React SDK       Prebuilt sign-in/sign-up UI
components; JWT session management
Hosting          Vercel                Zero-config deploy, global CDN,
automatic HTTPS
7.2 Backend Stack

Component   Technology        Rationale

Runtime         Node.js (Express) or  Fast async I/O; strong
Python (FastAPI)      video-library ecosystem
Video fetching  yt-dlp (Python) /     Wide platform support; actively
youtubedl-core (Node) maintained
Queue system    Bull + Redis          Prevents overload; fair job
scheduling with retries
Auth middleware Clerk Backend SDK --- Validates Clerk session tokens on
JWT verification      protected routes
Temp file       Local FS, auto-purge  No persistent storage; reduces
storage         after 10 minutes      cost and compliance risk
Hosting         Render                Auto-deploy from Git; horizontal
scaling on paid tier
7.3 API Endpoints

Method   Endpoint           Auth?   Description      Response Shape

POST         /api/fetch             No          Submit URL for       { jobId, status }
metadata fetch and
queue
GET          /api/status/:jobId     No          Poll job processing  { status, progress,
progress             metadata }
GET          /api/download/:jobId   No          Retrieve download    { formats: [{quality,
links by             url, size}] }
format/quality
GET          /api/history           Yes (Clerk) Fetch authenticated  { downloads: [...] }
user download
history
POST         /api/report            No          Report a broken      { success: boolean }
download
7.4 Clerk Authentication Flow

User clicks Sign In / Sign Up button in the header
Clerk modal renders (hosted Clerk UI or embedded <SignIn />
component)
User authenticates via email/password or Google OAuth
Clerk returns a signed JWT session token stored in browser
React frontend attaches Bearer token to protected API requests via
Axios interceptor
Backend Clerk SDK verifies JWT; returns HTTP 401 on invalid or
expired token
Authenticated routes (/dashboard, GET /api/history) become
accessible

8. UI/UX Requirements
8.1 Design Tokens

Token               Value               Usage

--color-primary        #6A0DAD                 Buttons, headings, highlights,
borders
--color-primary-dark   #4A0080                 Hover states, secondary headings
--color-lavender       #EDE0F7                 Card and callout backgrounds,
badges
--color-white          #FFFFFF                 Page background, text on dark
surfaces
--color-text           #1A1A2E                 All body text
--color-muted          #666666                 Secondary text, placeholders,
footer
--font-primary         Inter / Poppins         All UI text
--border-radius        12px                    Cards, inputs, buttons, modals
--shadow               0 4px 24px              Card and button drop shadows
rgba(106,13,173,0.12)
8.2 Homepage Layout

Sticky header: Saver-ur logo (left) + Sign In / user avatar (right,
powered by Clerk)
Hero section: full-width purple gradient background (#6A0DAD to
#9B59B6)
Tagline: 'Download videos instantly' --- 48 px bold, centred,
white
Subtitle: 'Fast, free, and beautifully simple' --- 18 px, white at
80% opacity
URL input: 600 px max-width, white background, 16 px placeholder,
rounded 12 px, purple focus ring
Download CTA: purple fill, white text, 48 px height, full-width on
mobile
Platform icon badges below input: YouTube · Instagram · Facebook
Legal disclaimer banner above footer
Footer: Terms of Service | Privacy Policy | DMCA Contact

8.3 Results / Preview Section

Video thumbnail at 16:9 aspect ratio, rounded corners, lazy-loaded
Video title (max 2 lines, ellipsis overflow) + duration badge
Format tab switcher: MP4 | MP3
Quality radio buttons with estimated file size labels
Primary Download CTA --- full-width purple button
Secondary 'Try another URL' link below CTA

8.4 Dashboard (Authenticated Users)

Route: /dashboard --- protected by Clerk; unauthenticated users
redirected to login
Lists last 50 downloads: thumbnail, title, platform, format, date
Re-download button per entry (re-triggers the fetch flow for that
URL)
Delete individual history entries

8.5 Responsive Breakpoints

Breakpoint        Layout Behaviour

< 480 px (Mobile S)  Single column; stacked input + button; font sizes
reduced ~10%
480--768 px (Mobile L Single column; preview card full-width
/ Tablet)
768--1024 px (Tablet  Centred content; max-width 720 px
/ Small Desktop)
> 1024 px (Desktop)  Centred content; max-width 820 px; generous hero
padding
9. User Flows
9.1 Primary Download Flow (Guest)

Step   User Action     System Response           UI State

1          Opens Saver-ur      Homepage loads with hero +    Idle
URL input
2          Pastes video URL    Platform badge auto-detects   Input ready
3          Clicks Download     Spinner + API call initiated  Processing
4          Waits (< 5 s)      Progress indicator animates   Loading
5          Views preview       Thumbnail, title, duration    Preview
rendered
6          Selects format      Quality options update for    Selecting
(MP4/MP3)           format
7          Selects quality     File size estimate shown      Selecting
tier
8          Clicks final        Browser download initiated;   Complete
Download            success toast shown
9.2 Authenticated User Flow

User clicks Sign In --- Clerk modal opens --- user authenticates
Header updates: shows user avatar and Dashboard link
User follows Guest Download Flow (steps 1--8 above)
On download completion, record auto-saved to user history in
database
User navigates to /dashboard to view or re-download past videos

9.3 Error Flow

Trigger         Error State Displayed Recovery Path

Invalid URL         Red input border + inline User edits URL and
submitted           message                   resubmits
Unsupported         Yellow warning banner     User provides valid URL
platform            listing supported
platforms
Processing fails /  Error card with Retry +   User retries or reports
timeout             Report Issue CTAs
Clerk session       Auth error toast; Clerk   User re-authenticates
expired             re-auth modal opens       seamlessly
10. Legal & Compliance
10.1 Required Disclaimer
+----------+-----------------------------------------------------------+
| !        | The following text MUST appear on the homepage AND on     |
|          | every download result page:                               |
| **       |                                                           |
| Required | "Download only content you own or have the explicit      |
| Disc     | permission of the copyright                               |
| laimer** |                                                           |
|          | holder to download. Saver-ur is not responsible for       |
|          | misuse of this service.                                   |
|          |                                                           |
|          | Users are solely responsible for compliance with          |
|          | applicable copyright laws."                              |
+----------+-----------------------------------------------------------+
10.2 Platform Policy Compliance

Do not cache or permanently store downloaded video files --- purge
within 10 minutes
Do not index or reproduce video content on Saver-ur servers beyond
transient processing
Include a DMCA takedown contact page and dedicated email address
before launch
Include Terms of Service and Privacy Policy pages before launch
Rate-limit API per IP to prevent systematic scraping abuse

10.3 Data Privacy

Do not collect or store guest user-submitted URLs beyond the active
session
Authenticated user history stored securely; deletable by user at any
time
Clerk manages all PII (email, OAuth tokens) --- Saver-ur stores only
Clerk user ID + download metadata
GDPR/CCPA: provide data export and account deletion functionality on
request

11. Testing Requirements

Test Type   Scope          Tool       Pass Criteria

Unit tests      URL validation,    Jest / Pytest  100% pass on CI pipeline
format parsing,
auth middleware
Integration     API endpoints E2E, Supertest /    All endpoints return
tests           Clerk JWT          Pytest         correct HTTP codes
verification
E2E tests       Full download flow Playwright     Successful download for
per supported                     3 sample URLs per
platform                          platform
Auth E2E        Sign-up, login,    Playwright +   Full auth flow completes
history access,    Clerk test     without errors
logout             mode
Load tests      500 concurrent     k6             P95 response < 5 s;
requests                          error rate < 1%
Cross-browser   Chrome, Firefox,   BrowserStack   No visual or functional
Safari, Edge                      regressions
Mobile testing  iOS Safari,        Manual +       Full feature parity
Android Chrome     BrowserStack   confirmed
11.1 Acceptance Criteria

All P0 functional requirements have passing automated tests before
production release
Processing success rate ≥ 95% across 100 test URLs per supported
platform
Lighthouse: Performance ≥ 85, SEO ≥ 90, Accessibility ≥ 80
Zero critical vulnerabilities from OWASP ZAP scan
Clerk auth E2E tests pass in CI using Clerk test-mode credentials

12. Success Metrics & KPIs

Metric            Definition               Target --- 30 Days
Post-Launch

Daily Active Users    Unique visitors completing   5,000
(DAU)                 at least one download
Download Success Rate (Successful downloads /      ≥ 95%
Total attempts) x 100
URL to Download       (Download clicks / URL       ≥ 70%
Conversion            submissions) x 100
Avg. Processing Time  Time from URL submit to      < 5 seconds
download options ready
Page Load Time        First Contentful Paint on 4G < 2 seconds
mobile
Bounce Rate           Users who leave without      < 40%
submitting a URL
Auth Sign-up Rate     (New sign-ups / Total        ≥ 10%
visitors) x 100
Error Rate            Processing failures / Total  < 5%
requests
13. Project Timeline

Phase       Key Tasks                     Duration   Owner

Phase 1 ---     Wireframes, design tokens,        3 days         Design
Design          component library, purple theme
system
Phase 2 ---     React SPA: URL input, preview,    5 days         Frontend
Frontend Dev    format selector, Clerk
integration, responsive layout
Phase 3 ---     API, yt-dlp, Bull queue, Clerk    5 days         Backend
Backend Dev     JWT middleware, error handling,
temp storage, purge job
Phase 4 ---     Connect frontend to backend; auth 2 days         Full-stack
Integration     flows; E2E testing
Phase 5 --- QA  Unit, integration, E2E, auth E2E, 3 days         QA
& Testing       load, cross-browser, mobile
Phase 6 ---     Disclaimer, ToS, Privacy Policy,  1 day          Product
Legal & Polish  DMCA page, Lighthouse tuning
Phase 7 ---     Deploy to Vercel + Render; DNS;   1 day          DevOps
Launch          Clerk production keys; smoke
tests
Total                                             20 days        All
14. Risk Register

Risk           Likelihood   Impact   Mitigation Strategy

yt-dlp breaks due  High             Critical     Monitor yt-dlp releases; pin to
to platform                                      tested version; automated uptime
anti-scraping                                    alert
update
Platform policy    Medium           High         Strict disclaimer; no content
violations / DMCA                                caching beyond 10 min; DMCA contact
notices                                          page
Backend overload   Medium           High         Bull queue with concurrency cap;
at launch                                        IP-based rate limiting
Processing time    Medium           Medium       Queue priority for short videos;
exceeds 5 s for                                  async polling UX with progress bar
long videos
Clerk outage       Low              Medium       Guest download mode remains fully
affecting                                        functional; Clerk SLA is 99.99%
authentication
Mobile UI          Low              Medium       Playwright tests on mobile viewports
regressions                                      run automatically in CI
post-deploy
15. Future Enhancements (Post-MVP Roadmap)

Feature         Description                       Phase

Download History    Paginated history, search/filter,     Phase 2
(Full)              bulk delete for authenticated users
Browser Extension   Chrome/Firefox extension for          Phase 2
one-click downloads on any page
Batch Downloads     Submit multiple URLs at once; receive Phase 2
as a single ZIP archive
More Platform       Twitter/X, TikTok, Pinterest, Vimeo,  Phase 2
Support             Dailymotion
Dark Mode           Toggle between light and dark purple  Phase 3
themes; syncs with OS preference
Premium Tier        No queue wait, 4K quality, WAV audio, Phase 3
no rate limits via subscription
Internal Analytics  DAU, success rate, top platforms,     Phase 2
Dashboard           conversion funnel metrics
Appendix: Glossary