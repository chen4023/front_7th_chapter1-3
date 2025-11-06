import { test, expect } from '@playwright/test';

test.describe('알림 시스템 E2E 테스트', () => {
  test.beforeEach(async ({ page, request }) => {
    // 각 테스트 전에 데이터 초기화
    await request.post('http://localhost:3000/api/reset');

    await page.goto('/');
    await expect(page.getByText('일정 로딩 완료!').first()).toBeVisible();
  });

  test('알림 설정 옵션이 올바르게 표시된다', async ({ page }) => {
    await page.getByLabel('알림 설정').click();

    await expect(page.getByRole('option', { name: '1분 전' })).toBeVisible();
    await expect(page.getByRole('option', { name: '10분 전' })).toBeVisible();
    await expect(page.getByRole('option', { name: '1시간 전' })).toBeVisible();
    await expect(page.getByRole('option', { name: '2시간 전' })).toBeVisible();
    await expect(page.getByRole('option', { name: '1일 전' })).toBeVisible();
  });

  test('10분 전 알림을 설정하면 알림 시간에 맞춰 표시된다', async ({ page }) => {
    const now = new Date();
    // 9분 후 일정 생성 (10분 전 알림 범위에 포함되도록)
    const futureTime = new Date(now.getTime() + 9 * 60 * 1000);
    const hours = String(futureTime.getHours()).padStart(2, '0');
    const minutes = String(futureTime.getMinutes()).padStart(2, '0');
    const endHours = String(futureTime.getHours() + 1).padStart(2, '0');
    const eventDate = `${futureTime.getFullYear()}-${String(futureTime.getMonth() + 1).padStart(2, '0')}-${String(futureTime.getDate()).padStart(2, '0')}`;

    await page.getByLabel('제목').fill('알림 테스트');
    await page.getByLabel('날짜').fill(eventDate);
    await page.getByLabel('시작 시간').fill(`${hours}:${minutes}`);
    await page.getByLabel('종료 시간').fill(`${endHours}:${minutes}`);
    await page.getByLabel('설명').fill('알림 테스트 설명');
    await page.getByLabel('위치').fill('테스트 위치');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();

    await page.getByLabel('알림 설정').click();
    await page.getByRole('option', { name: '10분 전' }).click();

    await page.getByTestId('event-submit-button').click();

    // 일정 추가 완료 토스트 대기
    await expect(page.getByRole('alert').filter({ hasText: '일정이 추가되었습니다' })).toBeVisible({
      timeout: 5000,
    });

    // 알림 토스트가 표시될 때까지 대기 (최대 10초)
    const notification = page
      .getByRole('alert')
      .filter({ hasText: '알림 테스트 일정이 시작됩니다' });
    await expect(notification).toBeVisible({ timeout: 10000 });

    // 알림 메시지 확인
    const notificationText = await notification.textContent();
    expect(notificationText).toContain('알림 테스트 일정이 시작됩니다');
  });

  test('알림의 닫기 버튼을 클릭하면 알림이 사라진다', async ({ page }) => {
    const now = new Date();
    const futureTime = new Date(now.getTime() + 9 * 60 * 1000);
    const hours = String(futureTime.getHours()).padStart(2, '0');
    const minutes = String(futureTime.getMinutes()).padStart(2, '0');
    const endHours = String(futureTime.getHours() + 1).padStart(2, '0');
    const eventDate = `${futureTime.getFullYear()}-${String(futureTime.getMonth() + 1).padStart(2, '0')}-${String(futureTime.getDate()).padStart(2, '0')}`;

    await page.getByLabel('제목').fill('닫기 테스트');
    await page.getByLabel('날짜').fill(eventDate);
    await page.getByLabel('시작 시간').fill(`${hours}:${minutes}`);
    await page.getByLabel('종료 시간').fill(`${endHours}:${minutes}`);
    await page.getByLabel('설명').fill('테스트');
    await page.getByLabel('위치').fill('테스트');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();
    await page.getByLabel('알림 설정').click();
    await page.getByRole('option', { name: '10분 전' }).click();

    await page.getByTestId('event-submit-button').click();

    // 일정 추가 완료 대기
    const addToast = page.getByRole('alert').filter({ hasText: '일정이 추가되었습니다' });
    await expect(addToast).toBeVisible({ timeout: 5000 });

    // 토스트와 알림이 겹치지 않도록 잠시 대기
    await page.waitForTimeout(2000);

    // 알림이 표시될 때까지 대기
    const notification = page
      .getByRole('alert')
      .filter({ hasText: '닫기 테스트 일정이 시작됩니다' });
    await expect(notification).toBeVisible({ timeout: 10000 });

    // 닫기 버튼 클릭 (IconButton)
    const closeButton = notification.getByRole('button').first();
    await closeButton.click();

    // 알림이 사라졌는지 확인
    await expect(notification).not.toBeVisible({ timeout: 3000 });
  });

  test('과거 일정은 알림이 표시되지 않는다', async ({ page }) => {
    const past = new Date();
    past.setHours(past.getHours() - 2);
    const pastDate = `${past.getFullYear()}-${String(past.getMonth() + 1).padStart(2, '0')}-${String(past.getDate()).padStart(2, '0')}`;
    const pastStartTime = past.toTimeString().slice(0, 5);
    const pastEndTime = new Date(past.getTime() + 60 * 60 * 1000).toTimeString().slice(0, 5);

    await page.getByLabel('제목').fill('과거 일정');
    await page.getByLabel('날짜').fill(pastDate);
    await page.getByLabel('시작 시간').fill(pastStartTime);
    await page.getByLabel('종료 시간').fill(pastEndTime);
    await page.getByLabel('설명').fill('과거');
    await page.getByLabel('위치').fill('테스트');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();
    await page.getByLabel('알림 설정').click();
    await page.getByRole('option', { name: '10분 전' }).click();

    await page.getByTestId('event-submit-button').click();

    // 일정 추가 완료 대기
    await expect(
      page.getByRole('alert').filter({ hasText: '일정이 추가되었습니다' })
    ).toBeVisible();

    // 5초 대기 후 일정 시작 알림이 표시되지 않는지 확인
    await page.waitForTimeout(5000);
    const notification = page.getByRole('alert').filter({ hasText: '과거 일정 일정이 시작됩니다' });
    await expect(notification).not.toBeVisible();
  });

  test('알림 시간 내에 있는 일정만 알림이 표시된다', async ({ page }) => {
    const now = new Date();

    // 첫 번째 일정: 9분 후 (10분 전 알림 범위 내 → 즉시 표시)
    const futureTime1 = new Date(now.getTime() + 9 * 60 * 1000);
    const eventDate1 = `${futureTime1.getFullYear()}-${String(futureTime1.getMonth() + 1).padStart(2, '0')}-${String(futureTime1.getDate()).padStart(2, '0')}`;

    await page.getByLabel('제목').fill('곧 시작 일정');
    await page.getByLabel('날짜').fill(eventDate1);
    await page.getByLabel('시작 시간').fill(futureTime1.toTimeString().slice(0, 5));
    await page
      .getByLabel('종료 시간')
      .fill(new Date(futureTime1.getTime() + 60 * 60 * 1000).toTimeString().slice(0, 5));
    await page.getByLabel('설명').fill('테스트');
    await page.getByLabel('위치').fill('테스트');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();
    await page.getByLabel('알림 설정').click();
    await page.getByRole('option', { name: '10분 전' }).click();
    await page.getByTestId('event-submit-button').click();

    // 첫 번째 일정 추가 완료 대기
    const addToast1 = page.getByRole('alert').filter({ hasText: '일정이 추가되었습니다' });
    await expect(addToast1).toBeVisible({ timeout: 5000 });

    // 토스트와 폼이 충돌하지 않도록 잠시 대기
    await page.waitForTimeout(2000);

    // 두 번째 일정: 2시간 후 (10분 전 알림 범위 밖 → 표시 안됨)
    const futureTime2 = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const eventDate2 = `${futureTime2.getFullYear()}-${String(futureTime2.getMonth() + 1).padStart(2, '0')}-${String(futureTime2.getDate()).padStart(2, '0')}`;

    await page.getByLabel('제목').fill('나중 일정');
    await page.getByLabel('날짜').fill(eventDate2);
    await page.getByLabel('시작 시간').fill(futureTime2.toTimeString().slice(0, 5));
    await page
      .getByLabel('종료 시간')
      .fill(new Date(futureTime2.getTime() + 60 * 60 * 1000).toTimeString().slice(0, 5));
    await page.getByLabel('설명').fill('테스트');
    await page.getByLabel('위치').fill('테스트');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();
    await page.getByLabel('알림 설정').click();
    await page.getByRole('option', { name: '10분 전' }).click();
    await page.getByTestId('event-submit-button').click();

    // 두 번째 일정 추가 완료 대기
    const addToast2 = page.getByRole('alert').filter({ hasText: '일정이 추가되었습니다' });
    await expect(addToast2).toBeVisible({ timeout: 5000 });

    // 토스트가 알림과 겹치지 않도록 잠시 대기
    await page.waitForTimeout(2000);

    // '곧 시작 일정' 알림은 표시됨
    await expect(
      page.getByRole('alert').filter({ hasText: '곧 시작 일정 일정이 시작됩니다' })
    ).toBeVisible({ timeout: 10000 });

    // '나중 일정' 알림은 표시되지 않음
    const laterNotification = page
      .getByRole('alert')
      .filter({ hasText: '나중 일정 일정이 시작됩니다' });
    await expect(laterNotification).not.toBeVisible();
  });
});
