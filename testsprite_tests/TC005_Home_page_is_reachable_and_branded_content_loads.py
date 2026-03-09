import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> Navigate to http://localhost:5175
        await page.goto("http://localhost:5175", wait_until="commit", timeout=10000)
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        title = await frame.page.title()
        assert "Saver" in title, f"Page title does not contain 'Saver': {title}"
        logo = frame.locator('xpath=/html/body/div[1]/div/nav/div/div/a')
        assert await logo.is_visible(), "Expected logo text 'Saver-UR' to be visible"
        start_btn = frame.locator('xpath=/html/body/div[1]/div/main/div/section[1]/div[2]/div[2]/a')
        assert await start_btn.is_visible(), "Expected CTA 'Start Downloading' to be visible"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    