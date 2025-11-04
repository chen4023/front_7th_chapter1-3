import { test, expect } from '@playwright/test';

test('반복 일정 관리 워크플로우 전반', async ({ page }) => {
  await page.goto('/');

  // 앱 준비
  await expect(page.getByText('일정 로딩 완료!').first()).toBeVisible();

  // 반복 일정 생성(매주, 3회까지 - 15,22,29)
  await page.getByLabel('제목').fill('E2E 반복 테스트');
  await page.getByLabel('날짜').fill('2025-11-15');
  await page.getByLabel('시작 시간').fill('14:00');
  await page.getByLabel('종료 시간').fill('15:00');
  await page.getByLabel('설명').fill('설명');
  await page.getByLabel('위치').fill('장소');
  await page.getByLabel('반복 일정').check();
  await page.locator('#repeat').click();
  await page.locator('[data-value="weekly"]').click(); //체크
  await page.locator('#repeat-interval').fill('1');
  await page.locator('#repeat-end-date').fill('2025-11-29');
  await page.getByTestId('event-submit-button').click();
  await expect(page.getByText('일정이 추가되었습니다')).toBeVisible();

  const list = page.getByTestId('event-list');
  await expect(list.getByText('E2E 반복 테스트')).toHaveCount(3);
  // 반복 아이콘 노출 확인
  await expect(page.getByTestId('RepeatIcon').first()).toBeVisible();

  // 시리즈 전체 수정(아니오)
  await list.getByLabel('Edit event').first().click();
  await expect(page.getByText('반복 일정 수정')).toBeVisible();
  await page.getByRole('button', { name: '아니오' }).click(); // 시리즈 전체 수정
  const titleInput = page.getByLabel('제목');
  await titleInput.clear();
  await titleInput.fill('E2E 전체수정');
  await page.getByTestId('event-submit-button').click();
  await expect(page.getByText('일정이 수정되었습니다')).toBeVisible();
  await expect(list.getByText('E2E 전체수정')).toHaveCount(3);
  // 단일 수정(예) - 이건 단일 일정으로 변환됨
  await list.getByLabel('Edit event').first().click();
  await expect(page.getByText('반복 일정 수정')).toBeVisible();
  await page.getByRole('dialog').getByText('예').click();
  const title2 = page.getByLabel('제목');
  await title2.clear();
  await title2.fill('E2E 단일수정');
  await page.getByTestId('event-submit-button').click();
  await expect(page.getByText('일정이 수정되었습니다')).toBeVisible();
  await expect(list.getByText('E2E 단일수정')).toHaveCount(1);
  await expect(list.getByText('E2E 전체수정')).toHaveCount(2);

  // 단일 일정 삭제(다이얼로그 없음)
  const singleEvent = list.filter({ hasText: 'E2E 단일수정' });
  await singleEvent.getByLabel('Delete event').first().click();
  await expect(page.getByText('일정이 삭제되었습니다').first()).toBeVisible();
  await expect(list.getByText('E2E 단일수정')).toHaveCount(0);

  // 반복 일정 단일 삭제(다이얼로그 뜸)
  const repeatEvent = list.filter({ hasText: 'E2E 전체수정' });
  await repeatEvent.getByLabel('Delete event').first().click();
  await expect(page.getByText('반복 일정 삭제')).toBeVisible();
  await page.getByRole('dialog').getByText('예').click();
  await expect(page.getByText('일정이 삭제되었습니다').first()).toBeVisible();
  await expect(list.getByText('E2E 전체수정')).toHaveCount(1);

  // 시리즈 삭제(아니오)
  await list.getByLabel('Delete event').first().click();
  await expect(page.getByText('반복 일정 삭제')).toBeVisible();
  await page.getByRole('dialog').getByText('아니오').click();
  await expect(page.getByText('일정이 삭제되었습니다').first()).toBeVisible();
  await expect(list.getByText('E2E 전체수정')).toHaveCount(0);
});
