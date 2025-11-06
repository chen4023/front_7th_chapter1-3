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
import React, { useRef, useState } from 'react';

import { Event } from '../../types';
import { formatDate, formatMonth, getEventsForDay, getWeeksAtMonth } from '../../utils/dateUtils';
import { EventBadge } from '../EventBadge';

interface MonthViewProps {
  currentDate: Date;
  filteredEvents: Event[];
  notifiedEvents: string[];
  weekDays: readonly string[];
  holidays: Record<string, string>;
  onEventDragStart?: (event: Event) => void;
  onEventDrop?: (targetDate: string) => void;
  onDateClick?: (dateString: string) => void;
}

export const MonthView = ({
  currentDate,
  filteredEvents,
  notifiedEvents,
  weekDays,
  holidays,
  onEventDragStart,
  onEventDrop,
  onDateClick,
}: MonthViewProps) => {
  const weeks = getWeeksAtMonth(currentDate);
  const [dragOverCell, setDragOverCell] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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
    <Stack data-testid="month-view" spacing={4} sx={{ width: '100%' }}>
      <Typography variant="h5">{formatMonth(currentDate)}</Typography>
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
            {weeks.map((week, weekIndex) => (
              <TableRow key={weekIndex}>
                {week.map((day, dayIndex) => {
                  const dateString = day ? formatDate(currentDate, day) : '';
                  const holiday = holidays[dateString];
                  const dayEvents = day ? getEventsForDay(filteredEvents, day) : [];

                  const isDragOver = dragOverCell === dateString;

                  return (
                    <TableCell
                      key={dayIndex}
                      onDragOver={(e) => day && handleDragOver(e, dateString)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => day && handleDrop(e, dateString)}
                      onClick={(e) => day && handleCellClick(e, dateString)}
                      sx={{
                        height: '120px',
                        verticalAlign: 'top',
                        width: '14.28%',
                        padding: 1,
                        border: '1px solid #e0e0e0',
                        overflow: 'hidden',
                        position: 'relative',
                        backgroundColor: isDragOver ? '#e3f2fd' : 'inherit',
                        transition: 'background-color 0.2s',
                        cursor: day ? 'pointer' : 'default',
                      }}
                    >
                      {day && (
                        <>
                          <Typography variant="body2" fontWeight="bold">
                            {day}
                          </Typography>
                          {holiday && (
                            <Typography variant="body2" color="error">
                              {holiday}
                            </Typography>
                          )}
                          {dayEvents.map((event) => {
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
                        </>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
