import { Close } from '@mui/icons-material';
import { Alert, AlertTitle, Box, IconButton, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import { CalendarView } from './components/CalendarView';
import { EventForm as EventFormComponent } from './components/EventForm';
import { EventList } from './components/EventList';
import { EventOverlapDialog } from './components/EventOverlapDialog';
import RecurringEventDialog from './components/RecurringEventDialog.tsx';
import { CATEGORIES, WEEK_DAYS, NOTIFICATION_OPTIONS } from './constants/calendar';
import { useCalendarView } from './hooks/useCalendarView.ts';
import { useEventDialog } from './hooks/useEventDialog';
import { useEventForm } from './hooks/useEventForm.ts';
import { useEventOperations } from './hooks/useEventOperations.ts';
import { useNotifications } from './hooks/useNotifications.ts';
import { useRecurringEventOperations } from './hooks/useRecurringEventOperations.ts';
import { useSearch } from './hooks/useSearch.ts';
import { Event, EventForm } from './types.ts';
import { findOverlappingEvents } from './utils/eventOverlap.ts';
import { isRecurringEvent } from './utils/repeatTypeUtils';
import { getTimeErrorMessage } from './utils/timeValidation.ts';

const categories = CATEGORIES;

const weekDays = WEEK_DAYS;

const notificationOptions = NOTIFICATION_OPTIONS;

function App() {
  const {
    title,
    setTitle,
    date,
    setDate,
    startTime,
    endTime,
    description,
    setDescription,
    location,
    setLocation,
    category,
    setCategory,
    isRepeating,
    setIsRepeating,
    repeatType,
    setRepeatType,
    repeatInterval,
    setRepeatInterval,
    repeatEndDate,
    setRepeatEndDate,
    notificationTime,
    setNotificationTime,
    startTimeError,
    endTimeError,
    editingEvent,
    setEditingEvent,
    handleStartTimeChange,
    handleEndTimeChange,
    resetForm,
    editEvent,
  } = useEventForm();

  const { events, saveEvent, deleteEvent, createRepeatEvent, fetchEvents } = useEventOperations(
    Boolean(editingEvent),
    () => setEditingEvent(null)
  );

  const { handleRecurringEdit, handleRecurringDelete, handleRecurringMove } =
    useRecurringEventOperations(events, async () => {
      // After recurring edit, refresh events from server
      await fetchEvents();
    });

  const { notifications, notifiedEvents, setNotifications } = useNotifications(events);
  const { view, setView, currentDate, holidays, navigate } = useCalendarView();
  const { searchTerm, filteredEvents, setSearchTerm } = useSearch(events, currentDate, view);

  const {
    isOverlapDialogOpen,
    overlappingEvents,
    openOverlapDialog,
    closeOverlapDialog,
    isRecurringDialogOpen,
    pendingRecurringEdit,
    pendingRecurringDelete,
    recurringEditMode,
    recurringDialogMode,
    openRecurringEditDialog,
    openRecurringDeleteDialog,
    closeRecurringDialog,
    setRecurringEditMode,
  } = useEventDialog();

  const { enqueueSnackbar } = useSnackbar();

  // Drag and Drop state
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null);
  const [pendingMove, setPendingMove] = useState<{
    event: Event;
    targetDate: string;
  } | null>(null);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);

  const handleRecurringConfirm = async (editSingleOnly: boolean) => {
    if (recurringDialogMode === 'edit' && pendingRecurringEdit) {
      // 편집 모드 저장하고 편집 폼으로 이동
      setRecurringEditMode(editSingleOnly);
      editEvent(pendingRecurringEdit);
      closeRecurringDialog();
    } else if (recurringDialogMode === 'delete' && pendingRecurringDelete) {
      // 반복 일정 삭제 처리
      try {
        await handleRecurringDelete(pendingRecurringDelete, editSingleOnly);
        enqueueSnackbar('일정이 삭제되었습니다', { variant: 'success' });
      } catch (error) {
        console.error(error);
        enqueueSnackbar('일정 삭제 실패', { variant: 'error' });
      }
      closeRecurringDialog();
    }
  };

  const handleEventDragStart = (event: Event) => {
    setDraggedEvent(event);
  };

  const handleEventDrop = async (targetDate: string) => {
    if (!draggedEvent) return;

    // Same date, no move needed
    if (draggedEvent.date === targetDate) {
      setDraggedEvent(null);
      return;
    }

    // Check if it's a recurring event
    if (isRecurringEvent(draggedEvent)) {
      setPendingMove({ event: draggedEvent, targetDate });
      setIsMoveDialogOpen(true);
    } else {
      // Non-recurring event, just update the date
      try {
        const movedEvent = { ...draggedEvent, date: targetDate };
        const response = await fetch(`/api/events/${draggedEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(movedEvent),
        });

        if (response.ok) {
          await fetchEvents();
          enqueueSnackbar('일정이 이동되었습니다', { variant: 'success' });
        } else {
          throw new Error('Failed to move event');
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar('일정 이동 실패', { variant: 'error' });
      }
    }

    setDraggedEvent(null);
  };

  const closeMoveDialog = () => {
    setIsMoveDialogOpen(false);
    setPendingMove(null);
    setDraggedEvent(null);
  };

  const handleMoveConfirm = async (moveSingleOnly: boolean) => {
    if (!pendingMove) return;

    try {
      await handleRecurringMove(pendingMove.event, pendingMove.targetDate, moveSingleOnly);
      enqueueSnackbar('일정이 이동되었습니다', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('일정 이동 실패', { variant: 'error' });
    }

    closeMoveDialog();
  };

  const handleEditEvent = (event: Event) => {
    if (isRecurringEvent(event)) {
      // Show recurring edit dialog
      openRecurringEditDialog(event);
    } else {
      // Regular event editing
      editEvent(event);
    }
  };

  const handleDeleteEvent = (event: Event) => {
    if (isRecurringEvent(event)) {
      // Show recurring delete dialog
      openRecurringDeleteDialog(event);
    } else {
      // Regular event deletion
      deleteEvent(event.id);
    }
  };

  const handleDateClick = (dateString: string) => {
    // 날짜 클릭 시 폼 초기화하고 해당 날짜로 설정
    if (editingEvent) {
      setEditingEvent(null);
    }
    resetForm();
    setDate(dateString);
  };

  const addOrUpdateEvent = async () => {
    if (!title || !date || !startTime || !endTime) {
      enqueueSnackbar('필수 정보를 모두 입력해주세요.', { variant: 'error' });
      return;
    }

    if (startTimeError || endTimeError) {
      enqueueSnackbar('시간 설정을 확인해주세요.', { variant: 'error' });
      return;
    }

    const eventData: Event | EventForm = {
      id: editingEvent ? editingEvent.id : undefined,
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      repeat: editingEvent
        ? editingEvent.repeat // Keep original repeat settings for recurring event detection
        : {
            type: isRepeating ? repeatType : 'none',
            interval: repeatInterval,
            endDate: repeatEndDate || undefined,
          },
      notificationTime,
    };

    const overlapping = findOverlappingEvents(eventData, events);
    const hasOverlapEvent = overlapping.length > 0;

    // 수정
    if (editingEvent) {
      if (hasOverlapEvent) {
        openOverlapDialog(overlapping);
        return;
      }

      if (
        editingEvent.repeat.type !== 'none' &&
        editingEvent.repeat.interval > 0 &&
        recurringEditMode !== null
      ) {
        await handleRecurringEdit(eventData as Event, recurringEditMode);
        setRecurringEditMode(null);
        enqueueSnackbar('일정이 수정되었습니다', { variant: 'success' });
      } else {
        await saveEvent(eventData);
      }

      resetForm();
      return;
    }

    // 생성
    if (isRepeating) {
      // 반복 생성은 반복 일정을 고려하지 않는다.
      await createRepeatEvent(eventData);
      resetForm();
      return;
    }

    if (hasOverlapEvent) {
      openOverlapDialog(overlapping);
      return;
    }

    await saveEvent(eventData);
    resetForm();
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', margin: 'auto', p: 5 }}>
      <Stack direction="row" spacing={6} sx={{ height: '100%' }}>
        <EventFormComponent
          title={title}
          setTitle={setTitle}
          date={date}
          setDate={setDate}
          startTime={startTime}
          endTime={endTime}
          description={description}
          setDescription={setDescription}
          location={location}
          setLocation={setLocation}
          category={category}
          setCategory={setCategory}
          isRepeating={isRepeating}
          setIsRepeating={setIsRepeating}
          repeatType={repeatType}
          setRepeatType={setRepeatType}
          repeatInterval={repeatInterval}
          setRepeatInterval={setRepeatInterval}
          repeatEndDate={repeatEndDate}
          setRepeatEndDate={setRepeatEndDate}
          notificationTime={notificationTime}
          setNotificationTime={setNotificationTime}
          startTimeError={startTimeError}
          endTimeError={endTimeError}
          editingEvent={editingEvent}
          handleStartTimeChange={handleStartTimeChange}
          handleEndTimeChange={handleEndTimeChange}
          categories={categories}
          notificationOptions={notificationOptions}
          onSubmit={addOrUpdateEvent}
          getTimeErrorMessage={getTimeErrorMessage}
        />

        <Stack flex={1} spacing={5}>
          <Typography variant="h4">일정 보기</Typography>

          <CalendarView
            view={view}
            setView={setView}
            currentDate={currentDate}
            holidays={holidays}
            filteredEvents={filteredEvents}
            notifiedEvents={notifiedEvents}
            navigate={navigate}
            weekDays={weekDays}
            onEventDragStart={handleEventDragStart}
            onEventDrop={handleEventDrop}
            onDateClick={handleDateClick}
          />
        </Stack>

        <EventList
          events={filteredEvents}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          notifiedEvents={notifiedEvents}
          notificationOptions={notificationOptions}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      </Stack>

      <EventOverlapDialog
        open={isOverlapDialogOpen}
        overlappingEvents={overlappingEvents}
        onClose={closeOverlapDialog}
        onConfirm={() => {
          closeOverlapDialog();
          saveEvent({
            id: editingEvent ? editingEvent.id : undefined,
            title,
            date,
            startTime,
            endTime,
            description,
            location,
            category,
            repeat: {
              type: isRepeating ? repeatType : 'none',
              interval: repeatInterval,
              endDate: repeatEndDate || undefined,
            },
            notificationTime,
          });
        }}
      />

      <RecurringEventDialog
        open={isRecurringDialogOpen}
        onClose={closeRecurringDialog}
        onConfirm={handleRecurringConfirm}
        event={recurringDialogMode === 'edit' ? pendingRecurringEdit : pendingRecurringDelete}
        mode={recurringDialogMode}
      />

      <RecurringEventDialog
        open={isMoveDialogOpen}
        onClose={closeMoveDialog}
        onConfirm={handleMoveConfirm}
        event={pendingMove?.event || null}
        mode="move"
      />

      {notifications.length > 0 && (
        <Stack position="fixed" top={16} right={16} spacing={2} alignItems="flex-end">
          {notifications.map((notification, index) => (
            <Alert
              key={index}
              severity="info"
              sx={{ width: 'auto' }}
              action={
                <IconButton
                  size="small"
                  onClick={() => setNotifications((prev) => prev.filter((_, i) => i !== index))}
                >
                  <Close />
                </IconButton>
              }
            >
              <AlertTitle>{notification.message}</AlertTitle>
            </Alert>
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default App;
