**SAVER-UR**

*Universal Media Downloader*

Product Requirements Document (PRD)

  ----------------------- ----------------------- -----------------------
  **Version 1.0**         March 2026              Status: Draft

  ----------------------- ----------------------- -----------------------

**1. Product Overview**

Saver-UR is a web-based universal media downloader that enables users to
download images and videos from any URL on the internet directly to
their device. The platform supports any publicly accessible media URL
worldwide, making it a one-stop solution for media retrieval.

  ------------------ ----------------------------------------------------
  **App Name**       Saver-UR

  **Product Type**   Web Application (URL-based Media Downloader)

  **Target Users**   General public --- anyone who wants to save online
                     media

  **Core Value**     Download any image or video from any URL to your
                     device instantly

  **App Color        Purple (#6B21A8 primary, #7C3AED accent)
  Theme**            
  ------------------ ----------------------------------------------------

**2. Goals & Success Metrics**

**2.1 Primary Goals**

-   Allow users to paste any image or video URL and download the media
    to their device

-   Support all major media formats (JPEG, PNG, GIF, WebP, MP4, WebM,
    MOV, AVI, etc.)

-   Provide a clean, fast, mobile-friendly UI in a purple color theme

-   Allow users to save and manage their download history via local
    storage

-   Secure user authentication via Clerk

**2.2 Success Metrics**

  ------------------ ----------------------------------------------------
  **Download Success 95%+ of valid media URLs download successfully
  Rate**             

  **Page Load Time** \< 2 seconds for initial load

  **Media Preview**  Preview renders in \< 3 seconds after URL input

  **User             Clerk login/signup flow \< 30 seconds
  Authentication**   
  ------------------ ----------------------------------------------------

**3. Technical Stack**

  -------------------- ----------------------------------------------------
  **Frontend**         React (Vite or Create React App)

  **Backend**          Node.js + Express.js (REST API)

  **Database /         Browser LocalStorage (client-side persistence)
  Storage**            

  **Authentication**   Clerk (sign-up, sign-in, session management)

  **Styling**          Tailwind CSS or CSS Modules --- Purple theme
                       (#6B21A8, #7C3AED, #EDE9FE)

  **HTTP Client**      Axios (frontend) / node-fetch or axios (backend)

  **Media Handling**   Backend proxy to fetch & stream media from external
                       URLs

  **Deployment**       Vercel (frontend) + Railway or Render (backend)
  -------------------- ----------------------------------------------------

**4. Application Pages & Navigation**

The application consists of four main pages accessible via a top
navigation bar:

  --------------- -------------- ---------------------------------------------
  **Route**       **Page Name**  **Purpose**

  **/**           **Home**       Landing page --- introduces Saver-UR, feature
                                 highlights, call-to-action buttons

  **/url**        **URL**        Primary download page --- user pastes a URL,
                                 fills the download form, previews and
                                 downloads media

  **/download**   **Download**   Alternate download entry point with the same
                                 URL input form and download functionality

  **/saved**      **Saved**      View and manage all saved URLs stored in
                                 browser LocalStorage
  --------------- -------------- ---------------------------------------------

**5. Detailed Page Specifications**

**5.1 Home Page (Route: /)**

  -----------------------------------------------------------------------
  **Description**

  A visually appealing landing page that introduces the product,
  communicates its value proposition, and guides users to start
  downloading media.
  -----------------------------------------------------------------------

**UI Components**

-   Hero section with app logo, tagline (e.g. \'Download Any Media from
    Any URL\'), and a prominent CTA button linking to /url

-   Features section: 3-column cards highlighting key capabilities
    (supports all URLs, image & video, instant download)

-   Navigation bar at top with links to all four pages and Clerk user
    avatar / login button

-   Footer with app name and brief description

**Design Notes**

-   Background: light purple (#EDE9FE); primary buttons: #6B21A8;
    accent: #7C3AED

-   Fully responsive for mobile, tablet, and desktop

**5.2 URL Page (Route: /url)**

  -----------------------------------------------------------------------
  **Description**

  The core download page. Users paste a media URL, complete a short form,
  preview the media, and download it to their device.
  -----------------------------------------------------------------------

**Step-by-Step User Flow**

1.  User pastes an image or video URL into the input field

2.  User clicks the Download button

3.  A download form slides in / appears below

4.  User fills in the form fields

5.  A media preview (thumbnail or video player) renders below the form

6.  User clicks the final Download button to save the file

**Form Fields**

  ------------------ ----------------------------------------------------
  **Field 1 ---      Text input. User enters a custom filename for the
  Media Name**       downloaded file (e.g. \'sunset-photo\').

  **Field 2 ---      Dropdown / radio select with two options: Image and
  Media Type**       Video. Selecting Image triggers image download;
                     selecting Video triggers video download.
  ------------------ ----------------------------------------------------

**Media Preview Component**

-   If \'Image\' is selected: renders an \<img\> tag with the provided
    URL as src

-   If \'Video\' is selected: renders a \<video\> tag with controls and
    the provided URL as src

-   Preview is shown after URL is entered and media type is selected

-   Preview is displayed inside a styled card with a purple border

**Download Behaviour**

-   On clicking the final Download button, the backend proxies the
    request to the external URL

-   The backend streams the media file back to the frontend with
    Content-Disposition: attachment header

-   The file is saved with the custom name entered by the user

-   A success toast notification appears: \'Downloaded successfully!\'

**5.3 Download Page (Route: /download)**

  -----------------------------------------------------------------------
  **Description**

  This page is functionally identical to the URL page. It provides an
  alternative navigation entry point for users who navigate directly to
  /download. Both pages share the same React component or replicate the
  same UI and logic.
  -----------------------------------------------------------------------

**Components (same as URL Page)**

-   URL input field

-   Download trigger button

-   Download form (Media Name + Media Type selector)

-   Media preview (image or video based on selection)

-   Download button to initiate file save

**5.4 Saved Page (Route: /saved)**

  -----------------------------------------------------------------------
  **Description**

  A page that displays all URLs the user has saved to LocalStorage. Users
  can review past media URLs, download them again, or delete them from
  their saved list.
  -----------------------------------------------------------------------

**Features**

-   Displays a list/grid of all saved URLs retrieved from LocalStorage

-   Each saved item shows: URL (truncated), media name, media type badge
    (Image/Video), and timestamp

-   Each item has a Re-download button and a Delete button

-   A Clear All button to wipe all saved URLs from LocalStorage

-   Empty state message when no URLs have been saved: \'No saved URLs
    yet. Start downloading!\'

**LocalStorage Schema**

Key: saver_ur_saved_urls

Value (JSON array):

\[ { \"id\": \"uuid\", \"url\": \"https://\...\", \"name\":
\"my-photo\", \"type\": \"image\", \"savedAt\": \"2026-03-07T10:00:00Z\"
} \]

**6. Backend API Specification**

The Node.js + Express backend acts as a proxy server to bypass CORS
restrictions when downloading media from external URLs.

  ------------ --------------- ---------------------------------------------------------- ----------------------------
  **Method**   **Endpoint**    **Description**                                            **Response**

  GET          /api/download   ?url=\<encoded-url\>&name=\<filename\>&type=image\|video   Streams the media file with
                                                                                          Content-Disposition:
                                                                                          attachment

  GET          /api/preview    ?url=\<encoded-url\>                                       Returns media metadata
                                                                                          (content-type, file size)
                                                                                          for preview validation

  GET          /health         ---                                                        Server health check ---
                                                                                          returns { status: \'ok\' }
  ------------ --------------- ---------------------------------------------------------- ----------------------------

**7. Authentication --- Clerk**

  ------------------ ----------------------------------------------------
  **Provider**       Clerk (https://clerk.com)

  **Sign-up          Email/password, Google OAuth, GitHub OAuth
  Methods**          

  **Session          Clerk manages JWT tokens and session persistence
  Handling**         automatically

  **Protected        The /saved page requires authentication.
  Routes**           Unauthenticated users are redirected to the Clerk
                     sign-in page

  **User Avatar**    Clerk UserButton component rendered in the top-right
                     navigation bar

  **Integration**    Wrap the React app with \<ClerkProvider\> and use
                     \<SignedIn\> / \<SignedOut\> guards
  ------------------ ----------------------------------------------------

**8. Frontend Component Architecture**

-   App.jsx --- Root component, router setup (React Router v6), Clerk
    provider

-   components/Navbar.jsx --- Top navigation bar with page links and
    Clerk UserButton

-   components/Footer.jsx --- Simple footer

-   components/UrlInputForm.jsx --- Shared URL input + download form
    (used on both /url and /download pages)

-   components/MediaPreview.jsx --- Renders \<img\> or \<video\> based
    on selected type

-   components/SavedCard.jsx --- Individual saved URL card on the /saved
    page

-   pages/Home.jsx --- Landing page

-   pages/UrlPage.jsx --- URL download page

-   pages/DownloadPage.jsx --- Download page (reuses UrlInputForm)

-   pages/SavedPage.jsx --- Saved URLs list page

-   utils/storage.js --- LocalStorage helper functions (get, set,
    delete, clear)

-   utils/api.js --- Axios instance and API call helpers

**9. Non-Functional Requirements**

  -------------------- ----------------------------------------------------
  **Performance**      Initial page load \< 2s; media preview renders \< 3s

  **Responsiveness**   Mobile-first design; fully usable on screens 320px
                       and wider

  **Security**         Backend must validate and sanitize all incoming
                       URLs; block private IP ranges (127.x, 192.168.x) to
                       prevent SSRF attacks

  **Error Handling**   User-friendly error messages for invalid URLs,
                       unsupported formats, network errors, and CORS
                       failures

  **Browser Support**  Latest two versions of Chrome, Firefox, Safari, and
                       Edge

  **Accessibility**    WCAG 2.1 AA --- proper alt text, keyboard
                       navigation, sufficient color contrast

  **Local Storage      Warn user when LocalStorage approaches 5MB browser
  Limit**              limit
  -------------------- ----------------------------------------------------

**10. Out of Scope (v1.0)**

-   Cloud/server-side storage of downloaded files (only LocalStorage
    metadata is persisted)

-   Bulk URL downloading (one URL at a time in v1)

-   Browser extension or mobile native app

-   Support for URLs that require authentication or cookies (e.g.
    private social media posts)

-   Video transcoding or format conversion

-   Paid subscription tiers or rate limiting

**11. Development Milestones**

  ----------- --------------------- ----------------------------------------
  **Phase**   **Milestone**         **Deliverables**

  Phase 1     Project Setup & Auth  React + Vite project, Clerk integration,
                                    Navbar, routing, purple theme

  Phase 2     Backend Proxy API     Express server, /api/download endpoint,
                                    URL validation, SSRF protection

  Phase 3     URL & Download Pages  UrlInputForm, MediaPreview, download
                                    trigger, filename handling

  Phase 4     Saved Page            LocalStorage integration, SavedCard
                                    component, re-download & delete

  Phase 5     Home Page & Polish    Landing page hero, features section,
                                    mobile responsiveness, error states

  Phase 6     QA & Deployment       Cross-browser testing, deploy frontend
                                    to Vercel, backend to Railway
  ----------- --------------------- ----------------------------------------

*Saver-UR PRD v1.0 \| Confidential \| March 2026*

**PRODUCT REQUIREMENTS DOCUMENT**

**URL-Based Video Downloader**

Download Exactly the Video at Any URL --- Nothing More, Nothing Less

------------------------------------------------------------

  ---------------------- ---------------------------------------------------
  **Document Version**   v1.0

  **Status**             Draft --- Ready for Review

  **Product Type**       Web Application / Browser Extension / Desktop App

  **Date**               March 2026

  **Prepared by**        Product Team
  ---------------------- ---------------------------------------------------

**1. Executive Summary**

The URL-Based Video Downloader is a tool that allows users to paste any video URL and instantly download the exact video hosted at that link. The core principle is simple: what you see at the URL is what you download --- no substitutions, no recommendations, no alternative content.

**Key Example:**

> **URL:** https://www.youtube.com/watch?v=PKo1SLqElV8 → Download: The 24-minute 22-second video at that exact link

**2. Problem Statement**

Users often want to download a specific video they are watching or have shared via URL. Existing tools either:

-   Download wrong videos (suggested/related content instead of the linked video)

-   Require users to search for the video again manually

-   Download content other than what the URL points to

-   Add unwanted content or require account login

This product solves the problem by treating the URL as the absolute source of truth. The system fetches and downloads only the video that lives at the provided URL --- nothing else.

**3. Goals & Objectives**

**3.1 Primary Goal**

Allow users to paste a video URL and download exactly that video --- regardless of platform (YouTube, Vimeo, Dailymotion, etc.)

**3.2 Success Metrics**

  --------------------------------------- --------------------- ----------------------------
  **Metric**                              **Target**            **Measurement Method**

  URL-to-correct-video accuracy           100%                  QA testing across 50+ URLs

  Download success rate                   \>95%                 System logs

  Time from URL paste to download start   \<10 seconds          Performance benchmarks

  Supported platforms                     15+ on launch         Platform coverage list

  User error rate (wrong video)           0%                    User reports + QA
  --------------------------------------- --------------------- ----------------------------

**4. Product Overview**

The user flow is deliberately minimal:

  ---------- --------------------------------- --------------------------------------------------
  **Step**   **Action**                        **System Behavior**

  1          User pastes a video URL           System validates URL format

  2          User clicks Download              System resolves URL to exact video

  3          System fetches video metadata     Shows title, duration, available quality options

  4          User selects quality (optional)   Default: highest available quality

  5          Download begins                   Progress bar shown; file saved locally
  ---------- --------------------------------- --------------------------------------------------

**5. Functional Requirements**

**5.1 Core Features (Must Have)**

**FR-01: URL Input & Validation**

-   Accept a single video URL as input

-   Validate that the URL points to a recognizable video page

-   Display an error if the URL is invalid or not a video

-   Support URLs from YouTube, Vimeo, Dailymotion, Facebook, Twitter/X, Instagram, TikTok, Reddit, and direct .mp4/.webm/.mkv links

**FR-02: Exact Video Resolution**

-   Resolve the URL to the specific video it references

-   NEVER download related, recommended, or auto-played videos

-   NEVER substitute the URL video with another video

-   If URL has a timestamp parameter (e.g., ?t=145), still download the full video

-   Handle redirects: if URL redirects to another video URL, follow the redirect to the final destination

**FR-03: Quality Selection**

-   Detect all available video quality options (e.g., 1080p, 720p, 480p, 360p)

-   Default to highest available quality automatically

-   Allow user to select a lower quality if desired (for file size)

-   Display estimated file size per quality option

**FR-04: Download Management**

-   Show real-time download progress (percentage, speed, ETA)

-   Allow user to pause and resume downloads

-   Allow user to cancel a download

-   Save file to user\'s default Downloads folder

-   Auto-generate filename: \[Video Title\]\_\[Quality\].mp4

**FR-05: Video Metadata Display**

-   Before downloading, display: Video title, Duration, Uploader/Channel name, Thumbnail preview

-   Confirm to the user: \'You are downloading: \[Title\] (\[Duration\])\'

-   This confirmation prevents any ambiguity about what will be downloaded

**5.2 Secondary Features (Should Have)**

**FR-06: Batch URL Support**

-   Accept multiple URLs at once (paste a list)

-   Download each URL\'s video sequentially or in parallel

-   Show individual progress for each URL

**FR-07: Format Selection**

-   Allow download as: MP4 (default), MKV, WebM, MP3 (audio only)

-   MP3 option extracts audio track from the exact video at the URL

**FR-08: Download History**

-   Keep a local log of previously downloaded URLs

-   Allow re-downloading from history without re-entering URL

**5.3 Out of Scope (Will NOT Build)**

  ------------------------------------ ---------------------------------------------
  **Feature**                          **Reason for Exclusion**

  Adding/uploading user\'s own video   Core requirement: download only, no upload

  Video editing or trimming            Out of scope for v1

  Streaming or playback                Downloader only, not a player

  Account/login system                 No accounts needed for URL-based download

  Recommendations or discovery         Strictly URL-driven, no algorithmic content

  Browser history tracking             Privacy-first; only download history stored
  ------------------------------------ ---------------------------------------------

**6. Non-Functional Requirements**

**6.1 Performance**

-   URL validation: \< 2 seconds

-   Metadata fetch (title, duration, thumbnail): \< 5 seconds

-   Download speed: limited only by user\'s internet connection, no artificial throttling

-   Support concurrent downloads: up to 5 at a time

**6.2 Accuracy**

-   The downloaded video MUST be identical to the video accessible at the provided URL

-   System must handle URL parameters (playlists, timestamps) without downloading wrong content

-   If the exact video cannot be resolved, show an explicit error --- do not download a substitute

**6.3 Privacy & Security**

-   No video URLs or user data sent to external servers beyond what is needed to fetch the video

-   No analytics or telemetry on what URLs users download

-   HTTPS-only communication

-   Downloaded files scanned for malware before saving (optional, platform-dependent)

**6.4 Compatibility**

-   Web app: Chrome, Firefox, Safari, Edge (latest 2 versions)

-   Desktop: Windows 10+, macOS 12+, Ubuntu 20+

-   Mobile (stretch goal): iOS 16+, Android 12+

**7. Supported Video Platforms**

The following platforms must be supported at launch:

  ----------------------- ------------------------------- -----------------
  **Platform**            **URL Pattern Example**         **Priority**

  YouTube                 youtube.com/watch?v=\...        P0 (Critical)

  Vimeo                   vimeo.com/\[id\]                P0 (Critical)

  Dailymotion             dailymotion.com/video/\...      P1

  Twitter / X             x.com/\[user\]/status/\...      P1

  Facebook                facebook.com/watch?v=\...       P1

  Instagram               instagram.com/reel/\...         P1

  TikTok                  tiktok.com/@user/video/\...     P2

  Reddit (hosted video)   v.redd.it/\...                  P2

  Direct video files      .mp4 / .webm / .mkv URLs        P0 (Critical)
  ----------------------- ------------------------------- -----------------

**8. User Stories**

  -------- -------------- ----------------------------------------------------- -------------------------------------
  **ID**   **As a\...**   **I want to\...**                                     **So that\...**

  US-01    User           Paste a YouTube URL and download that exact video     I can watch it offline

  US-02    User           See the video title and duration before downloading   I can confirm it\'s the right video

  US-03    User           Choose video quality before downloading               I can save storage space if needed

  US-04    User           Download a 24-minute video from a specific URL        The full video is saved, not a clip

  US-05    User           Download from multiple URLs in one session            I can batch process my links

  US-06    User           Get an error if the URL doesn\'t work                 I know to check my link

  US-07    User           Download audio only from a URL                        I just want the soundtrack
  -------- -------------- ----------------------------------------------------- -------------------------------------

**9. Error Handling & Edge Cases**

  ------------------------------------- ----------------------------------------------------------------------------------------
  **Scenario**                          **System Response**

  URL is invalid / not a video page     Show: \'This URL does not point to a video. Please check the link.\'

  Video is private or region-locked     Show: \'This video is not available for download (private/restricted).\'

  URL redirects to different video      Follow redirect; show final video metadata for user to confirm before downloading

  Playlist URL provided                 Ask: \'This is a playlist. Download this specific video or all videos?\'

  Download interrupted (network drop)   Auto-retry 3 times; then show resume option

  Unsupported platform URL              Show: \'This platform is not yet supported. Supported platforms: \[list\].\'

  Video removed or deleted              Show: \'This video is no longer available at this URL.\'

  URL has timestamp (?t=145)            Download full video; note: \'Full video will be downloaded (not just from timestamp)\'
  ------------------------------------- ----------------------------------------------------------------------------------------

**10. Technical Architecture (High Level)**

**10.1 Core Components**

  ------------------- ------------------------------------- -------------------------
  **Component**       **Responsibility**                    **Technology Options**

  URL Parser          Validate and parse input URLs         yt-dlp, custom regex

  Platform Resolver   Identify platform, extract video ID   yt-dlp extractors

  Metadata Fetcher    Get title, duration, formats          yt-dlp, platform APIs

  Download Engine     Fetch and save video stream           yt-dlp, FFmpeg, aria2c

  Format Converter    Convert to requested format           FFmpeg

  Progress Tracker    Real-time download progress UI        WebSockets / SSE

  File Manager        Save to correct location, name file   OS file APIs
  ------------------- ------------------------------------- -------------------------

**10.2 Recommended Tech Stack**

-   Backend: Python + yt-dlp + FFmpeg (most comprehensive URL support)

-   Frontend: React.js (web) or Electron (desktop)

-   API: REST or local IPC for desktop

-   File storage: Local filesystem only

**11. Acceptance Criteria**

The product is considered ready for launch when ALL of the following pass:

  --------------- --------------------------------------------- ------------------------------------------------- ---------------
  **Test Case**   **Input**                                     **Expected Output**                               **Pass/Fail**

  TC-01           https://www.youtube.com/watch?v=PKo1SLqElV8   Downloads exact 24m 22s video                     

  TC-02           Any YouTube URL                               Video at that URL downloaded, not related video   

  TC-03           Invalid URL (not a video)                     Error message shown, no download                  

  TC-04           Private video URL                             Appropriate error shown                           

  TC-05           Direct .mp4 URL                               File downloaded correctly                         

  TC-06           URL with ?t= timestamp                        Full video downloaded with notice                 

  TC-07           URL with playlist                             Prompts user for single vs. all                   

  TC-08           5 URLs simultaneously                         All 5 correct videos downloaded                   
  --------------- --------------------------------------------- ------------------------------------------------- ---------------

**12. Suggested Delivery Timeline**

  ----------------------------- ----------------------------------------------------------- ----------------
  **Phase**                     **Scope**                                                   **Duration**

  Phase 1: MVP                  YouTube + direct URLs, single download, quality selection   4 weeks

  Phase 2: Platform Expansion   Add Vimeo, Twitter, Facebook, Instagram, TikTok             3 weeks

  Phase 3: Batch & Format       Batch downloads, MP3 extraction, history                    2 weeks

  Phase 4: Polish               UI improvements, error handling, performance tuning         2 weeks
  ----------------------------- ----------------------------------------------------------- ----------------

**Appendix: Key Principle Summary**

The single most important rule of this product:

**\"The URL is the instruction. The video at the URL is the only valid output.\"**

No recommendations. No substitutions. No user uploads. Paste URL → Get that video.