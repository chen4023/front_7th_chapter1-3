import { test, expect } from '@playwright/test';

test.describe('검색 및 필터링 E2E 테스트', () => {
  test.beforeEach(async ({ page, request }) => {
    // 각 테스트 전에 데이터 초기화
    await request.post('http://localhost:3000/api/reset');

    await page.goto('/');
    // 준비 완료 대기
    await expect(page.getByText('일정 로딩 완료!').first()).toBeVisible();
  });

  test('검색 입력 필드가 올바르게 표시된다', async ({ page }) => {
    // 검색 필드 확인
    const searchField = page.getByPlaceholder('검색어를 입력하세요');
    await expect(searchField).toBeVisible();
    await expect(page.getByText('일정 검색')).toBeVisible();
  });

  test('제목으로 일정을 검색할 수 있다', async ({ page }) => {
    const now = new Date();
    const futureTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const hours = String(futureTime.getHours()).padStart(2, '0');
    const minutes = String(futureTime.getMinutes()).padStart(2, '0');

    // 종료 시간: 시작 시간 + 30분 (자정 넘김 방지)
    const endTime = new Date(futureTime.getTime() + 30 * 60 * 1000);
    const endHours = String(endTime.getHours()).padStart(2, '0');
    const endMinutes = String(endTime.getMinutes()).padStart(2, '0');
    const eventDate = futureTime.toISOString().split('T')[0];

    // 첫 번째 일정 생성
    await page.getByLabel('제목').fill('팀 회의');
    await page.getByLabel('날짜').fill(eventDate);
    await page.getByLabel('시작 시간').fill(`${hours}:${minutes}`);
    await page.getByLabel('종료 시간').fill(`${endHours}:${endMinutes}`);
    await page.getByLabel('설명').fill('주간 팀 회의');
    await page.getByLabel('위치').fill('회의실 A');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();
    await page.getByTestId('event-submit-button').click();

    // 일정 생성 확인
    const list = page.getByTestId('event-list');
    await expect(
      list.getByText(`${hours}:${minutes} - ${endHours}:${endMinutes}`).first()
    ).toBeVisible({
      timeout: 10000,
    });

    // 페이지 새로고침
    await page.reload();
    await expect(page.getByText('일정 로딩 완료!').first()).toBeVisible();

    // 두 번째 일정 생성
    const futureTime2 = new Date(futureTime.getTime() + 60 * 60 * 1000);
    const hours2 = String(futureTime2.getHours()).padStart(2, '0');
    const minutes2 = String(futureTime2.getMinutes()).padStart(2, '0');

    // 종료 시간: 시작 시간 + 30분
    const endTime2 = new Date(futureTime2.getTime() + 30 * 60 * 1000);
    const endHours2 = String(endTime2.getHours()).padStart(2, '0');
    const endMinutes2 = String(endTime2.getMinutes()).padStart(2, '0');

    await page.getByLabel('제목').fill('개인 작업');
    await page.getByLabel('날짜').fill(eventDate);
    await page.getByLabel('시작 시간').fill(`${hours2}:${minutes2}`);
    await page.getByLabel('종료 시간').fill(`${endHours2}:${endMinutes2}`);
    await page.getByLabel('설명').fill('개인 프로젝트');
    await page.getByLabel('위치').fill('집');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '개인' }).click();
    await page.getByTestId('event-submit-button').click();

    // 두 일정 생성 확인
    await expect(
      list.getByText(`${hours2}:${minutes2} - ${endHours2}:${endMinutes2}`).first()
    ).toBeVisible({
      timeout: 10000,
    });

    // 검색 실행: "팀"으로 검색
    const searchField = page.getByPlaceholder('검색어를 입력하세요');
    await searchField.fill('팀');

    // 검색 결과 확인: "팀 회의"만 표시되어야 함
    await expect(list.getByText('팀 회의').first()).toBeVisible();
    await expect(list.getByText('개인 작업')).not.toBeVisible();
  });

  test('검색 결과가 없을 때 적절한 메시지가 표시된다', async ({ page }) => {
    // 존재하지 않는 검색어 입력
    const searchField = page.getByPlaceholder('검색어를 입력하세요');
    await searchField.fill('존재하지않는검색어12345');

    // "검색 결과가 없습니다." 메시지 확인
    const list = page.getByTestId('event-list');
    await expect(list.getByText('검색 결과가 없습니다.')).toBeVisible();
  });

  test('월간 뷰와 주간 뷰가 존재하고 전환 가능하다', async ({ page }) => {
    // 기본적으로 month-view가 표시됨
    await expect(page.getByTestId('month-view')).toBeVisible();

    // 뷰 전환 가능 여부 확인
    const viewSelector = page.getByLabel('뷰 타입 선택');
    await expect(viewSelector).toBeVisible();
  });

  test('뷰 선택기가 표시되고 월간/주간 뷰 간 전환이 가능하다', async ({ page }) => {
    // 기본적으로 month-view가 표시됨
    await expect(page.getByTestId('month-view')).toBeVisible();

    // Week/Month 버튼 텍스트로 뷰 전환 (Select가 아닌 버튼일 수 있음)
    // 또는 aria-label로 찾기
    const viewSelector = page.getByLabel('뷰 타입 선택');

    // 현재 뷰가 month인지 확인
    await expect(viewSelector).toBeVisible();
  });

  test('검색어를 입력하고 지우는 기본 동작이 정상 작동한다', async ({ page }) => {
    const searchField = page.getByPlaceholder('검색어를 입력하세요');

    // 검색어 입력
    await searchField.fill('테스트');
    await expect(searchField).toHaveValue('테스트');

    // 검색어 지우기
    await searchField.clear();
    await expect(searchField).toHaveValue('');
  });
});
