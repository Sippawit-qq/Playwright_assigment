const { test, expect } = require('@playwright/test');

test('Login success', async ({ page }) => {
  await page.goto('https://atm-buddy-lite.lovable.app/');

  await page.getByPlaceholder('ตัวอย่าง: 123456').fill('468102');
  await page.getByPlaceholder('รหัส PIN 4 หลัก').fill('4681');
  await page.click('button:has-text("เข้าสู่ระบบ")');

   await expect(page.getByRole('button', { name: 'ออกจากระบบ' })).toBeVisible();
});

test('Login wrong password', async ({ page }) => {
  await page.goto('https://atm-buddy-lite.lovable.app/');

  await page.getByPlaceholder('ตัวอย่าง: 123456').fill('468102');
  await page.getByPlaceholder('รหัส PIN 4 หลัก').fill('9999');
  await page.click('button:has-text("เข้าสู่ระบบ")');

   await expect(page.getByRole('button', { name: 'ออกจากระบบ' })).not.toBeVisible();
});

test('Login wrong username', async ({ page }) => {
  await page.goto('https://atm-buddy-lite.lovable.app/');

await page.getByPlaceholder('ตัวอย่าง: 123456').fill('468111');
  await page.getByPlaceholder('รหัส PIN 4 หลัก').fill('4681');
  await page.click('button:has-text("เข้าสู่ระบบ")');

   await expect(page.getByRole('button', { name: 'ออกจากระบบ' })).not.toBeVisible();
});