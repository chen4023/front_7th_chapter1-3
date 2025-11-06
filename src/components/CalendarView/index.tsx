import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { IconButton, MenuItem, Select, Stack } from '@mui/material';

import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { Event } from '../../types';

interface CalendarViewProps {
  view: 'week' | 'month';
  setView: (view: 'week' | 'month') => void;
  currentDate: Date;
  holidays: Record<string, string>;
  filteredEvents: Event[];
  notifiedEvents: string[];
  navigate: (direction: 'prev' | 'next') => void;
  weekDays: readonly string[];
  onEventDragStart?: (event: Event) => void;
  onEventDrop?: (targetDate: string) => void;
  onDateClick?: (dateString: string) => void;
}

export const CalendarView = ({
  view,
  setView,
  currentDate,
  holidays,
  filteredEvents,
  notifiedEvents,
  navigate,
  weekDays,
  onEventDragStart,
  onEventDrop,
  onDateClick,
}: CalendarViewProps) => {
  return (
    <>
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
        <IconButton aria-label="Previous" onClick={() => navigate('prev')}>
          <ChevronLeft />
        </IconButton>
        <Select
          size="small"
          aria-label="뷰 타입 선택"
          value={view}
          onChange={(e) => setView(e.target.value as 'week' | 'month')}
        >
          <MenuItem value="week" aria-label="week-option">
            Week
          </MenuItem>
          <MenuItem value="month" aria-label="month-option">
            Month
          </MenuItem>
        </Select>
        <IconButton aria-label="Next" onClick={() => navigate('next')}>
          <ChevronRight />
        </IconButton>
      </Stack>

      {view === 'week' && (
        <WeekView
          currentDate={currentDate}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          weekDays={weekDays}
          onEventDragStart={onEventDragStart}
          onEventDrop={onEventDrop}
          onDateClick={onDateClick}
        />
      )}
      {view === 'month' && (
        <MonthView
          currentDate={currentDate}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          weekDays={weekDays}
          holidays={holidays}
          onEventDragStart={onEventDragStart}
          onEventDrop={onEventDrop}
          onDateClick={onDateClick}
        />
      )}
    </>
  );
};
