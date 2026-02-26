const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto('https://atm-buddy-lite.lovable.app/', {
    waitUntil: 'domcontentloaded',
  });

    await page.getByPlaceholder('ตัวอย่าง: 123456').fill('789012');
    await page.getByPlaceholder('รหัส PIN 4 หลัก').fill('5678');
    await page.click('button:has-text("เข้าสู่ระบบ")');
    await page.getByText('ถอนเงินWithdrawal').click();
});

test('Withdrawal success', async ({ page }) => {
    await page.getByRole('spinbutton').fill('50000');
    await page.click('button:has-text("ถอนเงิน")')

    await expect(
        page
        .getByRole('region', { name: 'Notifications (F8)' })
        .getByRole('status')
        .filter({ hasText: 'ถอนเงินสำเร็จ' })
    ).toBeVisible();
});

test('Withdrawal amounts over 50,000', async ({ page }) => {
    await page.getByRole('spinbutton').fill('50001');
    await page.click('button:has-text("ถอนเงิน")')

    await expect(
        page
        .getByRole('region', { name: 'Notifications (F8)' })
        .getByRole('status')
        .filter({ hasText: 'ถอนเงินสำเร็จ' })
    ).not.toBeVisible();
});

test('Withdrawal amounts over than bank account have', async ({ page }) => {
    await page.getByRole('spinbutton').fill('50000');
    await page.click('button:has-text("ถอนเงิน")')

    const withdrawalButton = page.getByRole('button', { name: /^ถอนเงิน/ })

    await page.getByRole('spinbutton').fill('30000');

    await expect(withdrawalButton).toBeDisabled();
});