import type { Preview } from '@storybook/react-vite';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import React from 'react';

// MUI 테마 (App.tsx와 동일하게)
const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Chromatic 설정
    chromatic: {
      // 애니메이션 안정화를 위한 지연
      delay: 300,
      // 여러 뷰포트에서 테스트
      viewports: [375, 768, 1024, 1920],
      // 스냅샷에서 특정 요소 제외 (예: 동적 시간)
      diffThreshold: 0.2,
      // 애니메이션 비활성화
      disableSnapshot: false,
    },
    // Actions 설정
    actions: { argTypesRegex: '^on[A-Z].*' },
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <div style={{ minHeight: '100vh', padding: '20px' }}>
            <Story />
          </div>
        </SnackbarProvider>
      </ThemeProvider>
    ),
  ],
};

export default preview;

