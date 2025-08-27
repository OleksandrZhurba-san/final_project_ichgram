import { test, expect } from "@playwright/test";

test('home opens and renders smoething meaningful', async ({ page }) => {
  const res = await page.goto('/login');
  expect(res?.ok()).toBeTruthy();

  const anySignal = await Promise.race([
    page.getByTestId('root').waitFor({ timeout: 2000 }).then(() => 'ok').catch(() => null),
    page.getByRole('link', { name: /Log in|Sign up/i }).waitFor({ timeout: 2000 }).then(() => 'ok').catch(() => null),
  ]);

    expect(anySignal).toBe('ok');
});
