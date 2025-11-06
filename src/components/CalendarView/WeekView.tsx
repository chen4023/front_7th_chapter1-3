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
import React from 'react';

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
}

export const WeekView = ({
  currentDate,
  filteredEvents,
  notifiedEvents,
  weekDays,
  onEventDragStart,
  onEventDrop,
}: WeekViewProps) => {
  const weekDates = getWeekDates(currentDate);
  const [dragOverCell, setDragOverCell] = React.useState<string | null>(null);

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

                return (
                  <TableCell
                    key={date.toISOString()}
                    onDragOver={(e) => handleDragOver(e, dateString)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, dateString)}
                    sx={{
                      height: '120px',
                      verticalAlign: 'top',
                      width: '14.28%',
                      padding: 1,
                      border: '1px solid #e0e0e0',
                      overflow: 'hidden',
                      backgroundColor: isDragOver ? '#e3f2fd' : 'inherit',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {date.getDate()}
                    </Typography>
                    {filteredEvents
                      .filter(
                        (event) => new Date(event.date).toDateString() === date.toDateString()
                      )
                      .map((event) => {
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
