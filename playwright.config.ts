import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  timeout: process.env.CI ? 60_000 : 30_000, // CI에서는 60초로 증가
  fullyParallel: false, // 파일 간 순차 실행 (데이터 충돌 방지)
  workers: 1, // 단일 worker로 실행
  retries: process.env.CI ? 2 : 0, // CI에서는 2번 재시도
  use: {
    // 공통으로 사용하는 브라우저 설정
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure', // 실패 시 트레이스 보존
    video: 'retain-on-failure', // 실패 시 비디오 보존
    screenshot: 'only-on-failure', // 테스트 실패 시에만 스크린샷 자동 캡쳐
    actionTimeout: process.env.CI ? 15_000 : 10_000, // 개별 액션 타임아웃
    navigationTimeout: process.env.CI ? 30_000 : 20_000, // 페이지 네비게이션 타임아웃
  },
  expect: {
    timeout: process.env.CI ? 10_000 : 5_000, // expect 타임아웃
  },
  // reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  webServer: {
    command: 'TEST_ENV=e2e pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI, // 로컬에서는 재사용, CI에서는 새로 시작
    timeout: 120_000, // CI 환경에서 서버 시작 대기 시간 (2분)
    env: { TEST_ENV: 'e2e' }, // e2e 테스트 환경 명시
  },
  globalSetup: './e2e/global-setup.ts',
});
