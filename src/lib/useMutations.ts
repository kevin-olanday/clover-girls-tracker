import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { ClubEvent, Expense, Venue, IncomeRecord, Member, EventMemberLink } from '@/lib/types';
import toast from 'react-hot-toast';

export function useMutations(reload: () => void, createdByName?: string | null) {
  const [saving, setSaving] = useState(false);
  // Use a ref so callbacks don't need re-memoisation when the user loads
  const byRef = useRef(createdByName);
  byRef.current = createdByName;

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
        return supabase.from('events').insert({ ...e, created_by_name: byRef.current || null });
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
        return supabase.from('expenses').insert({ ...e, created_by_name: byRef.current || null });
      }, id ? 'Expense updated' : 'Expense added'),
    [wrap]
  );

  const toggleExpensePurchased = useCallback(
    async (id: string, current: boolean, actualCost?: number) => {
      // optimistic
      toast.success(current ? 'Marked as not purchased' : 'Marked as purchased');
      try {
        if (supabase) {
          const { error } = await supabase
            .from('expenses')
            .update({
              is_purchased: !current,
              ...(actualCost !== undefined ? { actual_cost: actualCost } : {}),
            })
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
        const venuePayload = { ...v, created_by_name: byRef.current || null };
        let venueId = id;

        if (id) {
          const { error } = await supabase.from('venues').update(venuePayload).eq('id', id);
          if (error) throw error;
        } else {
          const { data, error } = await supabase
            .from('venues')
            .insert(venuePayload)
            .select('id')
            .single();
          if (error || !data) throw error || new Error('Venue was not created');
          venueId = (data as { id: string }).id;
        }

        if (!venueId) throw new Error('Venue id is missing');
        const rentalPayload = {
          venue_id: venueId,
          description: `${v.name || 'Venue'} rental`,
          priority: 'High',
          estimated_cost: Number(v.rental_fee) || 0,
          actual_cost: 0,
          is_purchased: false,
          item_type: 'Venue Rental',
          event_id: null,
          created_by_name: byRef.current || null,
        };
        const { data: existingRental, error: rentalLookupError } = await supabase
          .from('expenses')
          .select('id')
          .eq('venue_id', venueId)
          .maybeSingle();
        if (rentalLookupError) throw rentalLookupError;

        const rentalResult = existingRental
          ? await supabase.from('expenses').update(rentalPayload).eq('id', existingRental.id)
          : await supabase.from('expenses').insert(rentalPayload);
        if (rentalResult.error) throw rentalResult.error;
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
        return supabase.from('income_records').insert({ ...i, created_by_name: byRef.current || null });
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
        return supabase.from('members').insert({ ...m, created_by_name: byRef.current || null });
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

  const importEventParticipants = useCallback(
    async (
      event_id: string,
      rows: Array<{ first_name: string; last_name: string; role: string; phone_number: string; email: string; notes: string }>,
      existingMembers: Member[],
      linkedMemberIds: Set<string>,
    ): Promise<{ created: number; linked: number; skipped: number }> => {
      if (!supabase) return { created: 0, linked: 0, skipped: rows.length };

      let created = 0, linked = 0, skipped = 0;
      const localMembers = [...existingMembers];
      const localLinked = new Set(linkedMemberIds);

      for (const row of rows) {
        const existing = localMembers.find(
          (m) =>
            m.first_name.toLowerCase() === row.first_name.toLowerCase() &&
            m.last_name.toLowerCase() === row.last_name.toLowerCase(),
        );

        let memberId: string | undefined;

        if (existing) {
          memberId = existing.id;
        } else {
          const { data, error } = await supabase
            .from('members')
            .insert({
              first_name: row.first_name,
              last_name: row.last_name,
              role: row.role || 'Member',
              phone_number: row.phone_number || null,
              email: row.email || null,
              notes: row.notes || null,
              created_by_name: byRef.current || null,
            })
            .select('id')
            .single();
          if (error || !data) { skipped++; continue; }
          memberId = (data as { id: string }).id;
          created++;
          localMembers.push({
            id: memberId,
            first_name: row.first_name,
            last_name: row.last_name,
            role: row.role || 'Member',
            phone_number: row.phone_number || null,
            email: row.email || null,
            notes: row.notes || null,
            created_at: new Date().toISOString(),
            created_by_name: byRef.current || null,
          });
        }

        if (!memberId || localLinked.has(memberId)) { skipped++; continue; }

        const { error: linkError } = await supabase
          .from('event_members')
          .insert({ event_id, member_id: memberId });
        if (!linkError) {
          linked++;
          localLinked.add(memberId);
        } else {
          skipped++;
        }
      }

      const total = linked + created;
      if (total > 0) {
        toast.success(`${total} participant${total !== 1 ? 's' : ''} added to event`);
      } else {
        toast.error('No new participants were imported');
      }

      await reload();
      return { created, linked, skipped };
    },
    [reload],
  );

  const importMembers = useCallback(
    async (
      rows: Array<{ first_name: string; last_name: string; role: string; phone_number: string; email: string; notes: string }>,
      existingMembers: Member[],
    ): Promise<{ created: number; linked: number; skipped: number }> => {
      if (!supabase) return { created: 0, linked: 0, skipped: rows.length };

      let created = 0, skipped = 0;
      const localMembers = [...existingMembers];

      for (const row of rows) {
        const exists = localMembers.find(
          (m) =>
            m.first_name.toLowerCase() === row.first_name.toLowerCase() &&
            m.last_name.toLowerCase() === row.last_name.toLowerCase(),
        );
        if (exists) { skipped++; continue; }

        const { data, error } = await supabase
          .from('members')
          .insert({
            first_name: row.first_name,
            last_name: row.last_name,
            role: row.role || 'Member',
            phone_number: row.phone_number || null,
            email: row.email || null,
            notes: row.notes || null,
            created_by_name: byRef.current || null,
          })
          .select('id')
          .single();
        if (error || !data) { skipped++; continue; }
        created++;
        localMembers.push({
          id: (data as { id: string }).id,
          first_name: row.first_name,
          last_name: row.last_name,
          role: row.role || 'Member',
          phone_number: row.phone_number || null,
          email: row.email || null,
          notes: row.notes || null,
          created_at: new Date().toISOString(),
          created_by_name: byRef.current || null,
        });
      }

      if (created > 0) {
        toast.success(`${created} participant${created !== 1 ? 's' : ''} added`);
      } else {
        toast.error('No new participants were imported');
      }

      await reload();
      return { created, linked: 0, skipped };
    },
    [reload],
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
    importEventParticipants,
    importMembers,
  };
}
