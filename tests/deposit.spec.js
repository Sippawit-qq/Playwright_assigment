const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto('https://atm-buddy-lite.lovable.app/', {
    waitUntil: 'domcontentloaded',
  });

    await page.getByPlaceholder('ตัวอย่าง: 123456').fill('468102');
    await page.getByPlaceholder('รหัส PIN 4 หลัก').fill('4681');
    await page.click('button:has-text("เข้าสู่ระบบ")');
    await page.getByText('ฝากเงินDeposit').click();
});

test('Deposit success', async ({ page }) => {
    await page.getByRole('spinbutton').fill('50000');
    await page.click('button:has-text("ฝากเงิน")')

    await expect(
        page
        .getByRole('region', { name: 'Notifications (F8)' })
        .getByRole('status')
        .filter({ hasText: 'ฝากเงินสำเร็จ' })
    ).toBeVisible();
});

test('Deposit fail', async ({ page }) => {
    await page.getByRole('spinbutton').fill('100001');
    await page.click('button:has-text("ฝากเงิน")')

    await expect(
        page
        .getByRole('region', { name: 'Notifications (F8)' })
        .getByRole('status')
        .filter({ hasText: 'ฝากเงินสำเร็จ' })
    ).not.toBeVisible();
});