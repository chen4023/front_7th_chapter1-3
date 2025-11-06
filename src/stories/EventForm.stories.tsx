import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { EventForm } from '../components/EventForm';
import { CATEGORIES, NOTIFICATION_OPTIONS } from '../constants/calendar';
import { getTimeErrorMessage } from '../utils/timeValidation';

const meta = {
  title: 'Components/EventForm',
  component: EventForm,
  parameters: {
    layout: 'padded',
    chromatic: {
      viewports: [375, 768],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    setTitle: fn(),
    setDate: fn(),
    setDescription: fn(),
    setLocation: fn(),
    setCategory: fn(),
    setIsRepeating: fn(),
    setRepeatType: fn(),
    setRepeatInterval: fn(),
    setRepeatEndDate: fn(),
    setNotificationTime: fn(),
    handleStartTimeChange: fn(),
    handleEndTimeChange: fn(),
    onSubmit: fn(),
  },
} satisfies Meta<typeof EventForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseArgs = {
  title: '',
  date: '2024-01-15',
  startTime: '10:00',
  endTime: '11:00',
  description: '',
  location: '',
  category: '업무',
  isRepeating: false,
  repeatType: 'none' as const,
  repeatInterval: 1,
  repeatEndDate: '',
  notificationTime: 10,
  startTimeError: null,
  endTimeError: null,
  editingEvent: null,
  categories: CATEGORIES,
  notificationOptions: NOTIFICATION_OPTIONS,
  getTimeErrorMessage,
};

// 1. 빈 폼 (일정 추가 모드)
export const Empty: Story = {
  args: baseArgs,
};

// 2. 모든 필드 입력됨
export const AllFieldsFilled: Story = {
  args: {
    ...baseArgs,
    title: '팀 회의',
    date: '2024-01-15',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 회의입니다',
    location: '회의실 A',
    category: '업무',
  },
};

// 3. 시간 유효성 에러
export const WithTimeError: Story = {
  args: {
    ...baseArgs,
    title: '일정',
    startTime: '14:00',
    endTime: '13:00',
    startTimeError: '시작 시간은 종료 시간보다 빨라야 합니다',
  },
};

// 4. 종료 시간 에러
export const WithEndTimeError: Story = {
  args: {
    ...baseArgs,
    title: '일정',
    startTime: '10:00',
    endTime: '10:00',
    endTimeError: '종료 시간은 시작 시간보다 늦어야 합니다',
  },
};

// 5. 반복 일정 활성화
export const RepeatingEnabled: Story = {
  args: {
    ...baseArgs,
    title: '주간 회의',
    isRepeating: true,
    repeatType: 'weekly',
    repeatInterval: 1,
    repeatEndDate: '2024-12-31',
  },
};

// 6. 일정 수정 모드
export const EditMode: Story = {
  args: {
    ...baseArgs,
    title: '기존 일정',
    date: '2024-01-15',
    startTime: '10:00',
    endTime: '11:00',
    description: '수정할 일정',
    location: '회의실 B',
    category: '업무',
    editingEvent: {
      id: '1',
      title: '기존 일정',
      date: '2024-01-15',
      startTime: '10:00',
      endTime: '11:00',
      description: '수정할 일정',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 1 },
      notificationTime: 10,
    },
  },
};

// 7. 긴 텍스트 입력
export const LongTexts: Story = {
  args: {
    ...baseArgs,
    title: '매우 긴 제목의 일정입니다. 이렇게 긴 제목도 올바르게 표시되어야 합니다.',
    description:
      '매우 긴 설명입니다. 여러 줄에 걸쳐서 입력될 수 있는 설명 텍스트가 올바르게 표시되는지 확인합니다.',
    location: '서울특별시 강남구 테헤란로 123 빌딩 5층 대회의실',
  },
};
