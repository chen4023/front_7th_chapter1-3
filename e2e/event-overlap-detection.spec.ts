import { test, expect } from '@playwright/test';

test.describe.serial('일정 겹침 감지 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // 준비 완료 대기
    await expect(page.getByText('일정 로딩 완료!').first()).toBeVisible();
  });

  test('겹치는 시간대에 일정을 추가하면 경고 다이얼로그가 표시된다', async ({ page }) => {
    // 첫 번째 일정 생성
    await page.getByLabel('제목').fill('회의');
    await page.getByLabel('날짜').fill('2025-11-15');
    await page.getByLabel('시작 시간').fill('14:00');
    await page.getByLabel('종료 시간').fill('15:00');
    await page.getByLabel('설명').fill('팀 회의');
    await page.getByLabel('위치').fill('회의실 A');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();

    await page.getByTestId('event-submit-button').click();

    // 일정이 리스트에 추가되었는지 확인
    const list = page.getByTestId('event-list');
    await expect(list.getByText('14:00 - 15:00')).toBeVisible({ timeout: 10000 });

    // 페이지 새로고침으로 폼 초기화
    await page.reload();
    await expect(page.getByText('일정 로딩 완료!').first()).toBeVisible();

    // 겹치는 시간대의 두 번째 일정 생성 시도
    await page.getByLabel('제목').fill('점심 약속');
    await page.getByLabel('날짜').fill('2025-11-15');
    await page.getByLabel('시작 시간').fill('14:30');
    await page.getByLabel('종료 시간').fill('15:30');
    await page.getByLabel('설명').fill('고객과 점심');
    await page.getByLabel('위치').fill('레스토랑');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();

    await page.getByTestId('event-submit-button').click();

    // 일정 겹침 경고 다이얼로그 확인
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('일정 겹침 경고')).toBeVisible();
    await expect(dialog.getByText(/다음 일정과 겹칩니다|일정이 겹치는 시간대/)).toBeVisible();
  });

  test('일정 겹침 경고에서 "계속 진행"을 선택하면 일정이 추가된다', async ({ page }) => {
    // 첫 번째 일정 생성
    await page.getByLabel('제목').fill('운동');
    await page.getByLabel('날짜').fill('2025-11-16');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('11:00');
    await page.getByLabel('설명').fill('아침 운동');
    await page.getByLabel('위치').fill('헬스장');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '개인' }).click();

    await page.getByTestId('event-submit-button').click();

    // 일정이 리스트에 추가되었는지 확인 (10:00 - 11:00 시간으로 확인)
    const list = page.getByTestId('event-list');
    await expect(list.getByText('10:00 - 11:00')).toBeVisible({ timeout: 10000 });

    // 페이지 새로고침으로 폼 초기화
    await page.reload();
    await expect(page.getByText('일정 로딩 완료!').first()).toBeVisible();

    // 겹치는 시간대의 두 번째 일정 생성 시도
    await page.getByLabel('제목').fill('요가');
    await page.getByLabel('날짜').fill('2025-11-16');
    await page.getByLabel('시작 시간').fill('10:30');
    await page.getByLabel('종료 시간').fill('11:30');
    await page.getByLabel('설명').fill('요가 클래스');
    await page.getByLabel('위치').fill('요가 스튜디오');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '개인' }).click();

    await page.getByTestId('event-submit-button').click();

    // 일정 겹침 경고 다이얼로그에서 "계속 진행" 클릭
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('일정 겹침 경고')).toBeVisible();
    await dialog.getByRole('button', { name: '계속' }).click();

    // 일정이 추가되었는지 확인 (10:30 - 11:30 시간으로 확인)
    await expect(list.getByText('10:30 - 11:30').first()).toBeVisible({ timeout: 10000 });
  });

  test('일정 겹침 경고에서 "취소"를 선택하면 일정이 추가되지 않는다', async ({ page }) => {
    // 첫 번째 일정 생성
    await page.getByLabel('제목').fill('독서');
    await page.getByLabel('날짜').fill('2025-11-17');
    await page.getByLabel('시작 시간').fill('16:00');
    await page.getByLabel('종료 시간').fill('17:00');
    await page.getByLabel('설명').fill('책 읽기');
    await page.getByLabel('위치').fill('도서관');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '개인' }).click();

    await page.getByTestId('event-submit-button').click();

    // 일정이 리스트에 추가되었는지 확인 (16:00 - 17:00 시간으로 확인)
    const list = page.getByTestId('event-list');
    await expect(list.getByText('16:00 - 17:00')).toBeVisible({ timeout: 10000 });

    // 페이지 새로고침으로 폼 초기화
    await page.reload();
    await expect(page.getByText('일정 로딩 완료!').first()).toBeVisible();

    // 겹치는 시간대의 두 번째 일정 생성 시도
    await page.getByLabel('제목').fill('영화 관람');
    await page.getByLabel('날짜').fill('2025-11-17');
    await page.getByLabel('시작 시간').fill('16:30');
    await page.getByLabel('종료 시간').fill('18:00');
    await page.getByLabel('설명').fill('영화 보기');
    await page.getByLabel('위치').fill('영화관');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '개인' }).click();

    await page.getByTestId('event-submit-button').click();

    // 일정 겹침 경고 다이얼로그에서 "취소" 클릭
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('일정 겹침 경고')).toBeVisible();
    await dialog.getByRole('button', { name: '취소' }).click();

    // 다이얼로그가 닫혔는지 확인
    await expect(dialog.getByText('일정 겹침 경고')).not.toBeVisible();

    // "영화 관람" 일정이 추가되지 않았는지 확인
    await expect(list.getByText('영화 관람')).not.toBeVisible();
  });

  test('기존 일정을 수정하여 다른 일정과 겹치면 경고가 표시된다', async ({ page }) => {
    // 첫 번째 일정 생성
    await page.getByLabel('제목').fill('점심 식사');
    await page.getByLabel('날짜').fill('2025-11-18');
    await page.getByLabel('시작 시간').fill('12:00');
    await page.getByLabel('종료 시간').fill('13:00');
    await page.getByLabel('설명').fill('팀 점심');
    await page.getByLabel('위치').fill('식당');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();

    await page.getByTestId('event-submit-button').click();

    // 일정이 리스트에 추가되었는지 확인 (12:00 - 13:00 시간으로 확인)
    const list = page.getByTestId('event-list');
    await expect(list.getByText('12:00 - 13:00')).toBeVisible({ timeout: 10000 });

    // 페이지 새로고침으로 폼 초기화
    await page.reload();
    await expect(page.getByText('일정 로딩 완료!').first()).toBeVisible();

    // 두 번째 일정 생성 (겹치지 않음)
    await page.getByLabel('제목').fill('오후 미팅');
    await page.getByLabel('날짜').fill('2025-11-18');
    await page.getByLabel('시작 시간').fill('15:00');
    await page.getByLabel('종료 시간').fill('16:00');
    await page.getByLabel('설명').fill('프로젝트 미팅');
    await page.getByLabel('위치').fill('회의실 B');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();

    await page.getByTestId('event-submit-button').click();

    // 일정이 리스트에 추가되었는지 확인
    await expect(list.getByText('오후 미팅')).toBeVisible({ timeout: 10000 });

    // 페이지 새로고침으로 다이얼로그 없애기
    await page.reload();
    await expect(page.getByText('일정 로딩 완료!').first()).toBeVisible();

    // 두 번째 일정 수정하여 첫 번째 일정과 겹치게 만들기
    const list2 = page.getByTestId('event-list');
    const editButtons = list2.getByLabel('Edit event');

    // "오후 미팅" 일정의 수정 버튼 클릭 (두 번째 일정)
    await editButtons.last().click();

    // 시간을 점심 시간과 겹치도록 수정
    const startTime = page.getByLabel('시작 시간');
    await startTime.fill('09:30');

    const endTime = page.getByLabel('종료 시간');
    await endTime.fill('13:30');

    await page.getByTestId('event-submit-button').click();

    // 일정 겹침 경고 확인
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('일정 겹침 경고')).toBeVisible();
    await expect(dialog.getByText('점심 식사')).toBeVisible();
  });

  test('완전히 포함되는 시간대에 일정을 추가하면 경고가 표시된다', async ({ page }) => {
    // 긴 일정 생성 (3시간)
    await page.getByLabel('제목').fill('세미나');
    await page.getByLabel('날짜').fill('2025-11-19');
    await page.getByLabel('시작 시간').fill('09:00');
    await page.getByLabel('종료 시간').fill('12:00');
    await page.getByLabel('설명').fill('기술 세미나');
    await page.getByLabel('위치').fill('컨퍼런스룸');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '업무' }).click();

    await page.getByTestId('event-submit-button').click();

    // 일정이 리스트에 추가되었는지 확인 (09:00 - 12:00 시간으로 확인)
    const list = page.getByTestId('event-list');
    await expect(list.getByText('09:00 - 12:00')).toBeVisible({ timeout: 10000 });

    // 페이지 새로고침으로 폼 초기화
    await page.reload();
    await expect(page.getByText('일정 로딩 완료!').first()).toBeVisible();

    // 세미나 시간 내에 완전히 포함되는 짧은 일정 추가 시도
    await page.getByLabel('제목').fill('커피 브레이크');
    await page.getByLabel('날짜').fill('2025-11-19');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('10:15');
    await page.getByLabel('설명').fill('잠깐 휴식');
    await page.getByLabel('위치').fill('카페테리아');
    await page.getByLabel('카테고리').click();
    await page.getByRole('option', { name: '개인' }).click();

    await page.getByTestId('event-submit-button').click();

    // 일정 겹침 경고 확인
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('일정 겹침 경고')).toBeVisible();
    await expect(dialog.getByText(/세미나/)).toBeVisible();
    await expect(dialog.getByText(/09:00.*12:00/)).toBeVisible();
  });
});
