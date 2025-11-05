import { FormControl, FormLabel, Stack, TextField, Typography } from '@mui/material';
import { Event } from '../../types';
import { EventListItem } from './EventListItem';

interface EventListProps {
  events: Event[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  notifiedEvents: string[];
  notificationOptions: readonly { value: number; label: string }[];
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  searchTerm,
  onSearchChange,
  notifiedEvents,
  notificationOptions,
  onEdit,
  onDelete,
}) => {
  return (
    <Stack data-testid="event-list" spacing={2} sx={{ width: '30%', height: '100%', overflowY: 'auto' }}>
      <FormControl fullWidth>
        <FormLabel htmlFor="search">일정 검색</FormLabel>
        <TextField
          id="search"
          size="small"
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </FormControl>

      {events.length === 0 ? (
        <Typography>검색 결과가 없습니다.</Typography>
      ) : (
        events.map((event) => (
          <EventListItem
            key={event.id}
            event={event}
            isNotified={notifiedEvents.includes(event.id)}
            notificationOptions={notificationOptions}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </Stack>
  );
};

