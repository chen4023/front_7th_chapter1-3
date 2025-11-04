import { test, expect } from '@playwright/test';

test('기본 일정 CRUD 플로우', async ({ page }) => {
  await page.goto('/');

  // 준비 완료 대기
  await expect(page.getByText('일정 로딩 완료!').first()).toBeVisible();

  // Create
  await page.getByLabel('제목').fill('강아지 산책');
  await page.getByLabel('날짜').fill('2025-11-20');
  await page.getByLabel('시작 시간').fill('14:00');
  await page.getByLabel('종료 시간').fill('15:00');
  await page.getByLabel('설명').fill('오랜만에 즐거운 산책 진행');
  await page.getByLabel('위치').fill('한강');
  await page.getByLabel('카테고리').click();
  await page.getByRole('option', { name: '업무' }).click();
  await page.getByLabel('알림 설정').click();
  await page
    .getByRole('option', { name: /분 전|알림 없음/ })
    .first()
    .click();

  await page.getByTestId('event-submit-button').click();
  await expect(page.getByText('일정이 추가되었습니다')).toBeVisible();

  const list = page.getByTestId('event-list');
  await expect(list.getByText('강아지 산책')).toBeVisible();
  await expect(list.getByText('2025-11-20')).toBeVisible();
  await expect(list.getByText('14:00 - 15:00')).toBeVisible();

  // Update
  await list.getByLabel('Edit event').first().click();
  const title = page.getByLabel('제목');
  await title.clear();
  await title.fill('강아지 산택(수정)');
  await page.getByTestId('event-submit-button').click();
  await expect(page.getByText('일정이 수정되었습니다')).toBeVisible();
  await expect(list.getByText('강아지 산택(수정)')).toBeVisible();

  // Delete
  await list.getByLabel('Delete event').first().click();
  await expect(page.getByText('일정이 삭제되었습니다')).toBeVisible();
  await expect(list.getByText('강아지 산택(수정)')).toHaveCount(0);
});
