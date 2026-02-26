const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto('https://atm-buddy-lite.lovable.app/', {
    waitUntil: 'domcontentloaded',
  });

    await page.getByPlaceholder('ตัวอย่าง: 123456').fill('345678');
    await page.getByPlaceholder('รหัส PIN 4 หลัก').fill('9999');
    await page.click('button:has-text("เข้าสู่ระบบ")');
    await page.getByText('ฝากเงินDeposit').click();
    await page.getByRole('spinbutton').fill('100000');
    await page.click('button:has-text("ฝากเงิน")')
    await page.click('button:has-text("กลับ")')
    await page.getByText('โอนเงินTransfer').click();
});

test('Transfer success', async ({ page }) => {
    await page.getByRole('spinbutton').fill('50000');
    await page.getByRole('textbox', { name: 'กรอกหมายเลขบัญชี 6 หลัก' }).fill('789012')
    await page.getByRole('textbox', { name: 'เช่น เงินค่าอาหาร, ค่าเช่าบ้าน' }).fill('ค่าเทอมปีการศึกษา 2569');
    await page.getByRole('button', { name: 'โอนเงิน ฿' }).click();

    await expect(
        page
        .getByRole('region', { name: 'Notifications (F8)' })
        .getByRole('status')
        .filter({ hasText: 'โอนเงินสำเร็จ' })
    ).toBeVisible();
});

test('Transfer fail amounts over 200,000', async ({ page }) => {
    await page.getByRole('spinbutton').fill('200001');
    await page.getByRole('textbox', { name: 'กรอกหมายเลขบัญชี 6 หลัก' }).fill('789012')
    await page.getByRole('textbox', { name: 'เช่น เงินค่าอาหาร, ค่าเช่าบ้าน' }).fill('ค่าเทอมปีการศึกษา 2569');
    await page.getByRole('button', { name: 'โอนเงิน ฿' }).click();

    await expect(
        page
        .getByRole('region', { name: 'Notifications (F8)' })
        .getByRole('status')
        .filter({ hasText: 'โอนเงินสำเร็จ' })
    ).not.toBeVisible();
})

test('Transfer fail account number incorrect', async ({ page }) => {
    await page.getByRole('spinbutton').fill('50000');
    await page.getByRole('textbox', { name: 'กรอกหมายเลขบัญชี 6 หลัก' }).fill('111111')
    await page.getByRole('textbox', { name: 'เช่น เงินค่าอาหาร, ค่าเช่าบ้าน' }).fill('ค่าเทอมปีการศึกษา 2569');
    await page.getByRole('button', { name: 'โอนเงิน ฿' }).click();

    await expect(
        page
        .getByRole('region', { name: 'Notifications (F8)' })
        .getByRole('status')
        .filter({ hasText: 'ไม่พบบัญชีปลายทาง' })
    ).toBeVisible();
})

test('Transfer fail amounts is over than in bank account', async ({ page }) => {
    await page.getByRole('spinbutton').fill('200000');
    await page.getByRole('textbox', { name: 'กรอกหมายเลขบัญชี 6 หลัก' }).fill('789012')
    await page.getByRole('textbox', { name: 'เช่น เงินค่าอาหาร, ค่าเช่าบ้าน' }).fill('ค่าเทอมปีการศึกษา 2569');
    await page.getByRole('button', { name: 'โอนเงิน ฿' }).click();

    const transferButton = page.getByRole('button', { name: /^โอนเงิน/ });

    await page.getByRole('spinbutton').fill('100000');
    await page.getByRole('textbox', { name: 'กรอกหมายเลขบัญชี 6 หลัก' }).fill('789012')
    await page.getByRole('textbox', { name: 'เช่น เงินค่าอาหาร, ค่าเช่าบ้าน' }).fill('ค่าเทอมปีการศึกษา 2569');
    
    await expect(transferButton).toBeDisabled();
})

test('Transfer fail account number is same as this account', async ({ page }) => {
    await page.getByRole('spinbutton').fill('50000');
    await page.getByRole('textbox', { name: 'กรอกหมายเลขบัญชี 6 หลัก' }).fill('345678')
    await page.getByRole('textbox', { name: 'เช่น เงินค่าอาหาร, ค่าเช่าบ้าน' }).fill('ค่าเทอมปีการศึกษา 2569');
    await page.getByRole('button', { name: 'โอนเงิน ฿' }).click();

    await expect(
        page
        .getByRole('region', { name: 'Notifications (F8)' })
        .getByRole('status')
        .filter({ hasText: 'ไม่สามารถโอนได้' })
    ).toBeVisible();
})
