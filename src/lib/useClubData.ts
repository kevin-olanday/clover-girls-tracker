import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import { ClubEvent, Expense, Venue, IncomeRecord, Member, EventMemberLink } from './types';
import { mockEvents, mockExpenses, mockVenues, mockIncome, mockMembers, mockEventMembers } from './mockData';

type ConnectionState = 'connecting' | 'connected' | 'error';

export function useClubData() {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [income, setIncome] = useState<IncomeRecord[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [eventMembers, setEventMembers] = useState<EventMemberLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState<ConnectionState>(
    isSupabaseConfigured ? 'connecting' : 'error'
  );

  const loadAll = useCallback(async () => {
    const demoMode = typeof window !== 'undefined' && sessionStorage.getItem('clover-demo-mode') === 'true';
    if (!supabase || demoMode) {
      setEvents(mockEvents);
      setExpenses(mockExpenses);
      setVenues(mockVenues);
      setIncome(mockIncome);
      setMembers(mockMembers);
      setEventMembers(mockEventMembers);
      setConnection('error');
      setLoading(false);
      return;
    }
    try {
      const [ev, ex, ve, inc, mb, em] = await Promise.all([
        supabase.from('events').select('*').order('date', { ascending: true }),
        supabase.from('expenses').select('*').order('id', { ascending: false }),
        supabase.from('venues').select('*').order('date', { ascending: true }),
        supabase.from('income_records').select('*').order('date', { ascending: false }),
        supabase.from('members').select('*').order('last_name', { ascending: true }).order('first_name', { ascending: true }),
        supabase.from('event_members').select('*').order('created_at', { ascending: false }),
      ]);

      if (ev.error || ex.error || ve.error || inc.error || mb.error || em.error) throw new Error('query failed');

      setEvents((ev.data as ClubEvent[]) || []);
      setExpenses((ex.data as Expense[]) || []);
      setVenues((ve.data as Venue[]) || []);
      setIncome((inc.data as IncomeRecord[]) || []);
      setMembers((mb.data as Member[]) || []);
      setEventMembers((em.data as EventMemberLink[]) || []);
      setConnection('connected');
    } catch {
      setEvents([]);
      setExpenses([]);
      setVenues([]);
      setIncome([]);
      setMembers([]);
      setEventMembers([]);
      setConnection('error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return { events, expenses, venues, income, members, eventMembers, loading, connection, reload: loadAll };
}
