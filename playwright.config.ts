import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  fullyParallel: false, // 파일 간 순차 실행 (데이터 충돌 방지)
  workers: 1, // 단일 worker로 실행
  retries: 0, // 실패 테스트 재시도 횟수
  use: {
    // 공통으로 사용하는 브라우저 설정
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry', // 첫 번째 재시도에서만 트레이스 기록
    video: 'on-first-retry', // 첫 번째 재시도에서만 테스트 영상 녹화 저장
    screenshot: 'only-on-failure', // 테스트 실패 시에만 스크린샷 자동 캡쳐
  },
  // reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  webServer: {
    command: 'TEST_ENV=e2e pnpm dev',
    url: 'http://localhost:5173',
    // reuseExistingServer: !process.env.CI, // 이미 서버가 켜져있으면 새로켜지 않고 CI 환경에서만 새 서버를 띄움
    env: { TEST_ENV: 'e2e' }, // e2e 테스트 환경 명시
  },
  globalSetup: './e2e/global-setup.ts',
});
