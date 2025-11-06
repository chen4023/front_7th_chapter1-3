import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useRef } from 'react';

import { Event } from '../../types';
import { formatWeek, getWeekDates } from '../../utils/dateUtils';
import { EventBadge } from '../EventBadge';

interface WeekViewProps {
  currentDate: Date;
  filteredEvents: Event[];
  notifiedEvents: string[];
  weekDays: readonly string[];
  onEventDragStart?: (event: Event) => void;
  onEventDrop?: (targetDate: string) => void;
  onDateClick?: (dateString: string) => void;
}

export const WeekView = ({
  currentDate,
  filteredEvents,
  notifiedEvents,
  weekDays,
  onEventDragStart,
  onEventDrop,
  onDateClick,
}: WeekViewProps) => {
  const weekDates = getWeekDates(currentDate);
  const [dragOverCell, setDragOverCell] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const lastDropTimeRef = useRef<number>(0);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent, dateString: string) => {
    e.preventDefault();
    setDragOverCell(dateString);
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = (e: React.DragEvent, dateString: string) => {
    e.preventDefault();
    setDragOverCell(null);
    lastDropTimeRef.current = Date.now();
    setIsDragging(false);
    if (onEventDrop) {
      onEventDrop(dateString);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragOverCell(null);
  };

  const handleCellClick = (e: React.MouseEvent, dateString: string) => {
    // 드래그 중에는 클릭 이벤트 무시
    if (isDragging) return;

    // 드롭 직후(200ms 이내)에는 클릭 이벤트 무시
    if (Date.now() - lastDropTimeRef.current < 200) return;

    // 이벤트가 있는 경우에도 셀의 빈 공간을 클릭하면 날짜 선택되도록
    // EventBadge 클릭은 이벤트 버블링으로 막힘
    if (onDateClick && (e.target as HTMLElement).closest('[data-event-badge]') === null) {
      onDateClick(dateString);
    }
  };

  return (
    <Stack data-testid="week-view" spacing={4} sx={{ width: '100%' }}>
      <Typography variant="h5">{formatWeek(currentDate)}</Typography>
      <TableContainer>
        <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
          <TableHead>
            <TableRow>
              {weekDays.map((day) => (
                <TableCell key={day} sx={{ width: '14.28%', padding: 1, textAlign: 'center' }}>
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {weekDates.map((date) => {
                const dateString = date.toISOString().split('T')[0];
                const isDragOver = dragOverCell === dateString;
                const dateEvents = filteredEvents.filter(
                  (event) => new Date(event.date).toDateString() === date.toDateString()
                );

                return (
                  <TableCell
                    key={date.toISOString()}
                    onDragOver={(e) => handleDragOver(e, dateString)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, dateString)}
                    onClick={(e) => handleCellClick(e, dateString)}
                    sx={{
                      height: '120px',
                      verticalAlign: 'top',
                      width: '14.28%',
                      padding: 1,
                      border: '1px solid #e0e0e0',
                      overflow: 'hidden',
                      backgroundColor: isDragOver ? '#e3f2fd' : 'inherit',
                      transition: 'background-color 0.2s',
                      cursor: 'pointer',
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {date.getDate()}
                    </Typography>
                    {dateEvents.map((event) => {
                      const isNotified = notifiedEvents.includes(event.id);
                      return (
                        <EventBadge
                          key={event.id}
                          event={event}
                          isNotified={isNotified}
                          onDragStart={
                            onEventDragStart
                              ? (draggedEvent) => {
                                  handleDragStart();
                                  onEventDragStart(draggedEvent);
                                }
                              : undefined
                          }
                          onDragEnd={handleDragEnd}
                        />
                      );
                    })}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
