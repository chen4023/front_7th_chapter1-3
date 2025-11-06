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
import React, { useState } from 'react';

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
}

export const MonthView = ({
  currentDate,
  filteredEvents,
  notifiedEvents,
  weekDays,
  holidays,
  onEventDragStart,
  onEventDrop,
}: MonthViewProps) => {
  const weeks = getWeeksAtMonth(currentDate);
  const [dragOverCell, setDragOverCell] = useState<string | null>(null);

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
    if (onEventDrop) {
      onEventDrop(dateString);
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

                  const isDragOver = dragOverCell === dateString;

                  return (
                    <TableCell
                      key={dayIndex}
                      onDragOver={(e) => day && handleDragOver(e, dateString)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => day && handleDrop(e, dateString)}
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
                          {getEventsForDay(filteredEvents, day).map((event) => {
                            const isNotified = notifiedEvents.includes(event.id);
                            return (
                              <EventBadge
                                key={event.id}
                                event={event}
                                isNotified={isNotified}
                                onDragStart={onEventDragStart}
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
