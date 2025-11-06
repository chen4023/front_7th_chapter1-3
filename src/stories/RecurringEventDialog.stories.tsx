import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import RecurringEventDialog from '../components/RecurringEventDialog';

const meta = {
  title: 'Components/RecurringEventDialog',
  component: RecurringEventDialog,
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
} satisfies Meta<typeof RecurringEventDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockEvent = {
  id: '1',
  title: '매주 회의',
  date: '2024-01-15',
  startTime: '10:00',
  endTime: '11:00',
  description: '',
  location: '',
  category: '업무',
  repeat: { type: 'weekly' as const, interval: 1 },
  notificationTime: 10,
};

// 1. 수정 모드
export const EditMode: Story = {
  args: {
    open: true,
    event: mockEvent,
    mode: 'edit',
  },
};

// 2. 삭제 모드
export const DeleteMode: Story = {
  args: {
    open: true,
    event: mockEvent,
    mode: 'delete',
  },
};

// 3. 이동 모드
export const MoveMode: Story = {
  args: {
    open: true,
    event: mockEvent,
    mode: 'move',
  },
};

// 4. 닫힌 상태
export const Closed: Story = {
  args: {
    open: false,
    event: mockEvent,
    mode: 'edit',
  },
};
