import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ClubEvent, Expense, Venue, IncomeRecord, Member, EventMemberLink } from '@/lib/types';
import toast from 'react-hot-toast';

export function useMutations(reload: () => void) {
  const [saving, setSaving] = useState(false);

  const wrap = useCallback(async <T,>(fn: () => Promise<T>, successMsg: string): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await fn();
      if (supabase && result && typeof result === 'object' && 'error' in result && (result as any).error) {
        throw (result as any).error;
      }
      toast.success(successMsg);
      await reload();
      return true;
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      console.error(err);
      return false;
    } finally {
      setSaving(false);
    }
  }, [reload]);

  const saveEvent = useCallback(
    (e: Partial<ClubEvent>, id?: string) =>
      wrap(async () => {
        if (!supabase) return;
        if (id) {
          return supabase.from('events').update(e).eq('id', id);
        }
        return supabase.from('events').insert(e);
      }, id ? 'Event updated' : 'Event created'),
    [wrap]
  );

  const deleteEvent = useCallback(
    (id: string) =>
      wrap(async () => {
        if (!supabase) return;
        return supabase.from('events').delete().eq('id', id);
      }, 'Event deleted'),
    [wrap]
  );

  const saveExpense = useCallback(
    (e: Partial<Expense>, id?: string) =>
      wrap(async () => {
        if (!supabase) return;
        if (id) return supabase.from('expenses').update(e).eq('id', id);
        return supabase.from('expenses').insert(e);
      }, id ? 'Expense updated' : 'Expense added'),
    [wrap]
  );

  const toggleExpensePurchased = useCallback(
    async (id: string, current: boolean) => {
      // optimistic
      toast.success(current ? 'Marked as not purchased' : 'Marked as purchased');
      try {
        if (supabase) {
          const { error } = await supabase
            .from('expenses')
            .update({ is_purchased: !current })
            .eq('id', id);
          if (error) throw error;
        }
        await reload();
        return true;
      } catch {
        toast.error('Could not update purchase status');
        await reload();
        return false;
      }
    },
    [reload]
  );

  const deleteExpense = useCallback(
    (id: string) =>
      wrap(async () => {
        if (!supabase) return;
        return supabase.from('expenses').delete().eq('id', id);
      }, 'Expense deleted'),
    [wrap]
  );

  const saveVenue = useCallback(
    (v: Partial<Venue>, id?: string) =>
      wrap(async () => {
        if (!supabase) return;
        if (id) return supabase.from('venues').update(v).eq('id', id);
        return supabase.from('venues').insert(v);
      }, id ? 'Venue updated' : 'Venue added'),
    [wrap]
  );

  const updateVenueStatus = useCallback(
    async (id: string, status: Venue['status']) => {
      toast.success(`Venue marked as ${status}`);
      try {
        if (supabase) {
          const { error } = await supabase.from('venues').update({ status }).eq('id', id);
          if (error) throw error;
        }
        await reload();
        return true;
      } catch {
        toast.error('Could not update venue status');
        await reload();
        return false;
      }
    },
    [reload]
  );

  const deleteVenue = useCallback(
    (id: string) =>
      wrap(async () => {
        if (!supabase) return;
        return supabase.from('venues').delete().eq('id', id);
      }, 'Venue deleted'),
    [wrap]
  );

  const saveIncome = useCallback(
    (i: Partial<IncomeRecord>, id?: string) =>
      wrap(async () => {
        if (!supabase) return;
        if (id) return supabase.from('income_records').update(i).eq('id', id);
        return supabase.from('income_records').insert(i);
      }, id ? 'Income record updated' : 'Income record added'),
    [wrap]
  );

  const updateIncomeStatus = useCallback(
    async (id: string, status: IncomeRecord['status']) => {
      toast.success(`Payment marked as ${status}`);
      try {
        if (supabase) {
          const { error } = await supabase.from('income_records').update({ status }).eq('id', id);
          if (error) throw error;
        }
        await reload();
        return true;
      } catch {
        toast.error('Could not update payment status');
        await reload();
        return false;
      }
    },
    [reload]
  );

  const deleteIncome = useCallback(
    (id: string) =>
      wrap(async () => {
        if (!supabase) return;
        return supabase.from('income_records').delete().eq('id', id);
      }, 'Income record deleted'),
    [wrap]
  );

  const saveMember = useCallback(
    (m: Partial<Member>, id?: string) =>
      wrap(async () => {
        if (!supabase) return;
        if (id) return supabase.from('members').update(m).eq('id', id);
        return supabase.from('members').insert(m);
      }, id ? 'Member updated' : 'Member added'),
    [wrap]
  );

  const deleteMember = useCallback(
    (id: string) =>
      wrap(async () => {
        if (!supabase) return;
        return supabase.from('members').delete().eq('id', id);
      }, 'Member deleted'),
    [wrap]
  );

  const saveEventMemberLink = useCallback(
    (event_id: string, member_id: string) =>
      wrap(async () => {
        if (!supabase) return;
        return supabase.from('event_members').insert({ event_id, member_id });
      }, 'Member linked to event'),
    [wrap]
  );

  const deleteEventMemberLink = useCallback(
    (event_id: string, member_id: string) =>
      wrap(async () => {
        if (!supabase) return;
        return supabase.from('event_members').delete().eq('event_id', event_id).eq('member_id', member_id);
      }, 'Member removed from event'),
    [wrap]
  );

  return {
    saving,
    saveEvent,
    deleteEvent,
    saveExpense,
    toggleExpensePurchased,
    deleteExpense,
    saveVenue,
    updateVenueStatus,
    deleteVenue,
    saveIncome,
    updateIncomeStatus,
    deleteIncome,
    saveMember,
    deleteMember,
    saveEventMemberLink,
    deleteEventMemberLink,
  };
}
