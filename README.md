# Saver-ur

We have built the MVP for **Saver-ur**, checking all the boxes from the PRD requirements! 💜

## Tech Stack Used:
- **Frontend**
  - **Framework:** React + Vite
  - **Styling:** Tailwind CSS (configured with `--color-primary` variants and Google Fonts)
  - **Auth:** `@clerk/react` for user sign-in and Dashboard routing
  - **Routing:** `react-router-dom`
  - **Icons:** `lucide-react`
- **Backend:**
  - **Framework:** Node.js + Express + TypeScript
  - **Fetcher:** Standalone `yt-dlp.exe` integrated securely using `spawn`! (No Python install needed to test on Windows).

## How to Run:
1. **Start the Backend:**
   Open a terminal in the `/backend` folder and run:
   ```bash
   npm run dev
   ```
   > Keep this running. It handles formatting, parsing, and URL downloading requests on port 4000.

2. **Start the Frontend:**
   Open a new terminal in the `/frontend` folder and run:
   ```bash
   npm run dev
   ```

3. Open the provided `localhost` link to use the site!

### Features Built:
- **Beautiful Purple MVP UI:** Clean one-input flow with responsive layout.
- **Auto-detection badges:** Changes URL badges automatically when typing YouTube, Facebook, or Instagram links.
- **Authentication:** Clerk UI ready and connected to Dashboard History.
- **Backend Jobs:** Seamless HTTP pooling implemented using Express API, connecting to `yt-dlp` safely.
# Saver-UR  
