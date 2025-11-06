import { Stack, Box, Typography } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { EventBadge } from '../components/EventBadge';
import { Event } from '../types';

const meta = {
  title: 'Edge Cases/Text Handling',
  parameters: {
    layout: 'padded',
    chromatic: {
      viewports: [375, 768],
    },
  },
} satisfies Meta;

export default meta;

const createEvent = (title: string): Event => ({
  id: Math.random().toString(),
  title,
  date: '2024-01-15',
  startTime: '10:00',
  endTime: '11:00',
  description: '',
  location: '',
  category: '업무',
  repeat: { type: 'none', interval: 1 },
  notificationTime: 10,
});

// 1. 다양한 길이의 제목
export const VariousLengths: StoryObj = {
  render: () => (
    <Stack spacing={2}>
      <Box sx={{ width: '200px', border: '1px dashed #ccc', p: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          너비 200px
        </Typography>
        <EventBadge event={createEvent('짧음')} isNotified={false} />
        <EventBadge event={createEvent('중간 길이의 제목입니다')} isNotified={false} />
        <EventBadge
          event={createEvent('매우 긴 제목의 일정입니다 이렇게 길면 어떻게 표시될까요')}
          isNotified={false}
        />
      </Box>
      <Box sx={{ width: '300px', border: '1px dashed #ccc', p: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          너비 300px
        </Typography>
        <EventBadge event={createEvent('짧음')} isNotified={false} />
        <EventBadge event={createEvent('중간 길이의 제목입니다')} isNotified={false} />
        <EventBadge
          event={createEvent('매우 긴 제목의 일정입니다 이렇게 길면 어떻게 표시될까요')}
          isNotified={false}
        />
      </Box>
    </Stack>
  ),
};

// 2. 아이콘과 텍스트 조합
export const WithIconsAndLongText: StoryObj = {
  render: () => (
    <Stack spacing={1} sx={{ width: '250px' }}>
      <EventBadge
        event={{
          ...createEvent('일반 텍스트'),
          repeat: { type: 'weekly', interval: 1 },
        }}
        isNotified={false}
      />
      <EventBadge
        event={{
          ...createEvent('매우 긴 텍스트입니다 반복 아이콘도 있습니다'),
          repeat: { type: 'daily', interval: 1 },
        }}
        isNotified={false}
      />
      <EventBadge
        event={{
          ...createEvent('알림과 반복이 모두 있는 매우 긴 텍스트'),
          repeat: { type: 'monthly', interval: 1 },
        }}
        isNotified={true}
      />
    </Stack>
  ),
};

// 3. 셀 내 여러 이벤트 (overflow 테스트)
export const CellWithManyEvents: StoryObj = {
  render: () => (
    <Box
      sx={{
        width: '180px',
        height: '120px',
        border: '1px solid #e0e0e0',
        p: 1,
        overflow: 'hidden',
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
        15
      </Typography>
      {['팀 회의', '점심 약속', '프로젝트 리뷰', '1:1 미팅', '워크샵', '저녁 식사', '운동'].map(
        (title, i) => (
          <EventBadge key={i} event={createEvent(title)} isNotified={i === 0} />
        )
      )}
    </Box>
  ),
};

// 4. 특수 문자 및 이모지
export const SpecialCharacters: StoryObj = {
  render: () => (
    <Stack spacing={1} sx={{ width: '300px' }}>
      <EventBadge event={createEvent('🎉 생일 파티')} isNotified={false} />
      <EventBadge event={createEvent('회의 (중요!)')} isNotified={false} />
      <EventBadge event={createEvent('A & B 프로젝트 논의')} isNotified={false} />
      <EventBadge event={createEvent('TODO: 문서 작성 완료하기')} isNotified={false} />
      <EventBadge event={createEvent('🚀 배포 일정 🎯')} isNotified={true} />
    </Stack>
  ),
};

// 5. 빈 텍스트
export const EmptyTitle: StoryObj = {
  render: () => (
    <Stack spacing={1} sx={{ width: '200px' }}>
      <EventBadge event={createEvent('')} isNotified={false} />
      <EventBadge event={createEvent(' ')} isNotified={false} />
      <EventBadge event={createEvent('정상 제목')} isNotified={false} />
    </Stack>
  ),
};

// 6. 다양한 너비에서 반응형 테스트
export const ResponsiveWidths: StoryObj = {
  render: () => (
    <Stack spacing={3}>
      {[150, 250, 350].map((width) => (
        <Box key={width} sx={{ width: `${width}px`, border: '1px dashed #ccc', p: 1 }}>
          <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
            {width}px
          </Typography>
          <EventBadge event={createEvent('짧은 제목')} isNotified={false} />
          <EventBadge event={createEvent('중간 길이의 일정 제목입니다')} isNotified={false} />
          <EventBadge
            event={createEvent('매우 긴 제목의 일정입니다 텍스트가 어떻게 처리되는지 확인')}
            isNotified={false}
          />
        </Box>
      ))}
    </Stack>
  ),
};
