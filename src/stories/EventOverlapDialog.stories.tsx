import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { EventOverlapDialog } from '../components/EventOverlapDialog';

const meta = {
  title: 'Components/EventOverlapDialog',
  component: EventOverlapDialog,
  parameters: {
    layout: 'centered',
    chromatic: {
      viewports: [375, 768],
    },
  },
  args: {
    onClose: fn(),
    onConfirm: fn(),
  },
} satisfies Meta<typeof EventOverlapDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockEvents = [
  {
    id: '1',
    title: '팀 회의',
    date: '2024-01-15',
    startTime: '10:00',
    endTime: '11:00',
    description: '',
    location: '',
    category: '업무',
    repeat: { type: 'none' as const, interval: 1 },
    notificationTime: 10,
  },
];

// 1. 단일 겹침
export const SingleOverlap: Story = {
  args: {
    open: true,
    overlappingEvents: mockEvents,
  },
};

// 2. 여러 개 겹침
export const MultipleOverlaps: Story = {
  args: {
    open: true,
    overlappingEvents: [
      ...mockEvents,
      {
        ...mockEvents[0],
        id: '2',
        title: '점심 약속',
        startTime: '10:30',
        endTime: '11:30',
      },
      {
        ...mockEvents[0],
        id: '3',
        title: '전화 미팅',
        startTime: '10:45',
        endTime: '11:15',
      },
    ],
  },
};

// 3. 긴 일정명
export const LongEventNames: Story = {
  args: {
    open: true,
    overlappingEvents: [
      {
        ...mockEvents[0],
        title: '2024년 상반기 전사 전략 회의 및 각 부서별 목표 수립 워크샵',
      },
      {
        ...mockEvents[0],
        id: '2',
        title: '프로젝트 A 킥오프 미팅 및 요구사항 분석 세션',
      },
    ],
  },
};

// 4. 많은 일정이 겹침 (스크롤 테스트)
export const ManyOverlaps: Story = {
  args: {
    open: true,
    overlappingEvents: [
      { ...mockEvents[0], id: '1', title: '회의 1', startTime: '10:00', endTime: '10:30' },
      { ...mockEvents[0], id: '2', title: '회의 2', startTime: '10:15', endTime: '10:45' },
      { ...mockEvents[0], id: '3', title: '회의 3', startTime: '10:20', endTime: '10:50' },
      { ...mockEvents[0], id: '4', title: '회의 4', startTime: '10:30', endTime: '11:00' },
      { ...mockEvents[0], id: '5', title: '회의 5', startTime: '10:40', endTime: '11:10' },
      { ...mockEvents[0], id: '6', title: '회의 6', startTime: '10:45', endTime: '11:15' },
    ],
  },
};
