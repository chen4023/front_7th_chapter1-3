import { Stack } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { EventBadge } from '../components/EventBadge';
import { Event } from '../types';

const meta = {
  title: 'Components/EventBadge',
  component: EventBadge,
  parameters: {
    layout: 'padded',
    // 이 컴포넌트는 모든 뷰포트에서 테스트
    chromatic: {
      viewports: [375, 768, 1024],
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EventBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 이벤트 데이터
const baseEvent: Event = {
  id: '1',
  title: '팀 회의',
  date: '2024-01-15',
  startTime: '10:00',
  endTime: '11:00',
  description: '주간 팀 회의',
  location: '회의실 A',
  category: '업무',
  repeat: { type: 'none', interval: 1 },
  notificationTime: 10,
};

// 1. 기본 상태
export const Default: Story = {
  args: {
    event: baseEvent,
    isNotified: false,
  },
};

// 2. 알림이 활성화된 상태
export const Notified: Story = {
  args: {
    event: baseEvent,
    isNotified: true,
  },
  parameters: {
    docs: {
      description: {
        story: '알림이 활성화된 일정은 빨간색 배경과 아이콘으로 표시됩니다.',
      },
    },
  },
};

// 3. 반복 일정
export const Repeating: Story = {
  args: {
    event: {
      ...baseEvent,
      title: '매일 스탠드업',
      repeat: {
        type: 'daily',
        interval: 1,
        endDate: '2024-12-31',
      },
    },
    isNotified: false,
  },
};

// 4. 반복 + 알림
export const RepeatingAndNotified: Story = {
  args: {
    event: {
      ...baseEvent,
      title: '주간 회고',
      repeat: {
        type: 'weekly',
        interval: 1,
      },
    },
    isNotified: true,
  },
};

// 5. 긴 제목 (텍스트 truncate 테스트)
export const LongTitle: Story = {
  args: {
    event: {
      ...baseEvent,
      title: '2024년 상반기 전사 전략 회의 및 각 부서별 목표 수립을 위한 워크샵과 피드백 세션',
    },
    isNotified: false,
  },
};

// 6. 여러 상태 조합
export const CombinedStates: Story = {
  args: {
    event: baseEvent,
    isNotified: false,
  },
  render: () => (
    <Stack spacing={0}>
      <EventBadge event={baseEvent} isNotified={false} />
      <EventBadge event={{ ...baseEvent, title: '점심 약속' }} isNotified={true} />
      <EventBadge
        event={{ ...baseEvent, title: '매주 회의', repeat: { type: 'weekly', interval: 1 } }}
        isNotified={false}
      />
      <EventBadge
        event={{ ...baseEvent, title: '매우 긴 제목의 일정입니다 텍스트 오버플로우 테스트' }}
        isNotified={true}
      />
    </Stack>
  ),
};
