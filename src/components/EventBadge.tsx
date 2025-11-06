import { Notifications, Repeat } from '@mui/icons-material';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

import { Event } from '../types';
import { getRepeatTypeLabel } from '../utils/repeatTypeUtils';

interface EventBadgeProps {
  event: Event;
  isNotified: boolean;
  sx?: SxProps<Theme>;
  onDragStart?: (event: Event) => void;
}

export const EventBadge = ({ event, isNotified, sx = {}, onDragStart }: EventBadgeProps) => {
  const isRepeating = event.repeat.type !== 'none';

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    if (onDragStart) {
      onDragStart(event);
    }
  };

  return (
    <Box
      draggable={!!onDragStart}
      onDragStart={handleDragStart}
      sx={{
        p: 0.5,
        my: 0.5,
        backgroundColor: isNotified ? '#ffebee' : '#f5f5f5',
        borderRadius: 1,
        fontWeight: isNotified ? 'bold' : 'normal',
        color: isNotified ? '#d32f2f' : 'inherit',
        minHeight: '18px',
        width: '100%',
        overflow: 'hidden',
        cursor: onDragStart ? 'grab' : 'default',
        '&:active': onDragStart
          ? {
              cursor: 'grabbing',
            }
          : {},
        ...sx,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        {isNotified && <Notifications fontSize="small" />}
        {isRepeating && (
          <Tooltip
            title={`${event.repeat.interval}${getRepeatTypeLabel(event.repeat.type)}마다 반복${
              event.repeat.endDate ? ` (종료: ${event.repeat.endDate})` : ''
            }`}
          >
            <Repeat fontSize="small" />
          </Tooltip>
        )}
        <Typography variant="caption" noWrap sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
          {event.title}
        </Typography>
      </Stack>
    </Box>
  );
};
