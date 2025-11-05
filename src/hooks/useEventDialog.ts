import { useState } from 'react';

import { Event } from '../types';

export const useEventDialog = () => {
  // Overlap Dialog State
  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);

  // Recurring Dialog State
  const [isRecurringDialogOpen, setIsRecurringDialogOpen] = useState(false);
  const [pendingRecurringEdit, setPendingRecurringEdit] = useState<Event | null>(null);
  const [pendingRecurringDelete, setPendingRecurringDelete] = useState<Event | null>(null);
  const [recurringEditMode, setRecurringEditMode] = useState<boolean | null>(null);
  const [recurringDialogMode, setRecurringDialogMode] = useState<'edit' | 'delete'>('edit');

  // Overlap Dialog Actions
  const openOverlapDialog = (events: Event[]) => {
    setOverlappingEvents(events);
    setIsOverlapDialogOpen(true);
  };

  const closeOverlapDialog = () => {
    setIsOverlapDialogOpen(false);
    setOverlappingEvents([]);
  };

  // Recurring Dialog Actions
  const openRecurringEditDialog = (event: Event) => {
    setPendingRecurringEdit(event);
    setRecurringDialogMode('edit');
    setIsRecurringDialogOpen(true);
  };

  const openRecurringDeleteDialog = (event: Event) => {
    setPendingRecurringDelete(event);
    setRecurringDialogMode('delete');
    setIsRecurringDialogOpen(true);
  };

  const closeRecurringDialog = () => {
    setIsRecurringDialogOpen(false);
    setPendingRecurringEdit(null);
    setPendingRecurringDelete(null);
  };

  return {
    // Overlap Dialog
    isOverlapDialogOpen,
    overlappingEvents,
    openOverlapDialog,
    closeOverlapDialog,
    setIsOverlapDialogOpen,
    setOverlappingEvents,

    // Recurring Dialog
    isRecurringDialogOpen,
    pendingRecurringEdit,
    pendingRecurringDelete,
    recurringEditMode,
    recurringDialogMode,
    openRecurringEditDialog,
    openRecurringDeleteDialog,
    closeRecurringDialog,
    setRecurringEditMode,
  };
};
