import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { CalendarView } from '../components/CalendarView';
import { WEEK_DAYS } from '../constants/calendar';
import { Event } from '../types';

const meta = {
  title: 'Components/CalendarView',
  component: CalendarView,
  parameters: {
    layout: 'fullscreen',
    chromatic: {
      viewports: [768, 1024, 1920],
      delay: 500, // 캘린더 렌더링 안정화
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    setView: fn(),
    navigate: fn(),
    onEventDragStart: fn(),
    onEventDrop: fn(),
    onDateClick: fn(),
  },
} satisfies Meta<typeof CalendarView>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock 데이터
const mockEvents: Event[] = [
  {
    id: '1',
    title: '팀 회의',
    date: '2024-01-15',
    startTime: '10:00',
    endTime: '11:00',
    description: '',
    location: '',
    category: '업무',
    repeat: { type: 'none', interval: 1 },
    notificationTime: 10,
  },
  {
    id: '2',
    title: '점심 약속',
    date: '2024-01-15',
    startTime: '12:00',
    endTime: '13:00',
    description: '',
    location: '',
    category: '개인',
    repeat: { type: 'none', interval: 1 },
    notificationTime: 10,
  },
  {
    id: '3',
    title: '프로젝트 리뷰',
    date: '2024-01-16',
    startTime: '14:00',
    endTime: '16:00',
    description: '',
    location: '',
    category: '업무',
    repeat: { type: 'weekly', interval: 1 },
    notificationTime: 60,
  },
];

const mockHolidays = {
  '2024-01-01': '신정',
  '2024-01-15': '한글날',
};

const currentDate = new Date('2024-01-15');

// 1. 주간 뷰 - 빈 상태
export const WeekViewEmpty: Story = {
  args: {
    view: 'week',
    currentDate,
    holidays: {},
    filteredEvents: [],
    notifiedEvents: [],
    weekDays: WEEK_DAYS,
  },
};

// 2. 주간 뷰 - 일정 있음
export const WeekViewWithEvents: Story = {
  args: {
    view: 'week',
    currentDate,
    holidays: {},
    filteredEvents: mockEvents,
    notifiedEvents: ['1'],
    weekDays: WEEK_DAYS,
  },
};

// 3. 월간 뷰 - 빈 상태
export const MonthViewEmpty: Story = {
  args: {
    view: 'month',
    currentDate,
    holidays: {},
    filteredEvents: [],
    notifiedEvents: [],
    weekDays: WEEK_DAYS,
  },
};

// 4. 월간 뷰 - 일정 있음
export const MonthViewWithEvents: Story = {
  args: {
    view: 'month',
    currentDate,
    holidays: {},
    filteredEvents: mockEvents,
    notifiedEvents: ['1', '2'],
    weekDays: WEEK_DAYS,
  },
};

// 5. 월간 뷰 - 공휴일 포함
export const MonthViewWithHolidays: Story = {
  args: {
    view: 'month',
    currentDate,
    holidays: mockHolidays,
    filteredEvents: mockEvents,
    notifiedEvents: [],
    weekDays: WEEK_DAYS,
  },
};

// 6. 월간 뷰 - 많은 일정 (overflow 테스트)
export const MonthViewManyEvents: Story = {
  args: {
    view: 'month',
    currentDate,
    holidays: {},
    filteredEvents: [
      ...mockEvents,
      { ...mockEvents[0], id: '4', title: '일정 4', date: '2024-01-15' },
      { ...mockEvents[0], id: '5', title: '일정 5', date: '2024-01-15' },
      { ...mockEvents[0], id: '6', title: '일정 6', date: '2024-01-15' },
      { ...mockEvents[0], id: '7', title: '일정 7', date: '2024-01-15' },
      { ...mockEvents[0], id: '8', title: '일정 8', date: '2024-01-15' },
    ],
    notifiedEvents: [],
    weekDays: WEEK_DAYS,
  },
};
