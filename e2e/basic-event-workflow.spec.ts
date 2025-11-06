import { test, expect } from '@playwright/test';

test.describe.serial('기본 일정 관리', () => {
  // 테스트 파일 시작 시 한 번만 데이터 초기화
  test.beforeAll(async ({ request }) => {
    await request.post('http://localhost:3000/api/reset');
  });

  test('일정 정보를 입력하고 추가 버튼을 클릭하면 새로운 일정이 생성된다', async ({ page }) => {
    await page.goto('/');

    // 준비 완료 대기
    await expect(page.getByText('일정 로딩 완료!').first()).toBeVisible();

    // 일정 정보 입력
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

    // 일정 추가
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible();

    // 생성된 일정 확인
    const list = page.getByTestId('event-list');
    await expect(list.getByText('강아지 산책')).toBeVisible();
    await expect(list.getByText('2025-11-20')).toBeVisible();
    await expect(list.getByText('14:00 - 15:00')).toBeVisible();
  });

  test('수정 버튼을 클릭하고 정보를 변경하면 일정이 수정된다', async ({ page }) => {
    await page.goto('/');

    // 준비 완료 대기
    await expect(page.getByText('일정 로딩 완료!').first()).toBeVisible();

    const list = page.getByTestId('event-list');

    // 수정 버튼 클릭
    await list.getByLabel('Edit event').first().click();

    // 제목 수정
    const title = page.getByLabel('제목');
    await title.clear();
    await title.fill('강아지 산택(수정)');

    // 수정 사항 저장
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 수정되었습니다')).toBeVisible();

    // 수정된 일정 확인
    await expect(list.getByText('강아지 산택(수정)')).toBeVisible();
  });

  test('삭제 버튼을 클릭하면 일정이 삭제된다', async ({ page }) => {
    await page.goto('/');
    const list = page.getByTestId('event-list');
    // 삭제 버튼 클릭
    await list.getByLabel('Delete event').first().click();
    await expect(page.getByText('일정이 삭제되었습니다')).toBeVisible();
    // 일정이 삭제되었는지 확인
    await expect(list.getByText('강아지 산택(수정)')).toHaveCount(0);
  });
});
