import 'server-only';

import type {Localized} from './types';
import {getSupabaseAdmin} from './supabase';

export type AdminOrg = {
  id: string;
  name: string;
  category: string;
  country: string;
  mission: Localized;
  url: string | null;
  email: string | null;
  status: string;
  sort: number;
};

export type AdminNews = {
  id: string;
  day: string;
  month: Localized;
  source: Localized;
  title: Localized;
  body: Localized;
  published: boolean;
  sort: number;
};

export type AdminOpp = {
  id: string;
  title: Localized;
  body: Localized;
  deadline: Localized;
  published: boolean;
  sort: number;
};

export type AdminRequest = {
  id: string;
  organization: string;
  email: string;
  country: string | null;
  category: string;
  message: string | null;
  status: string;
  created_at: string;
};

export type AdminSubscriber = {
  id: string;
  email: string;
  locale: string | null;
  created_at: string;
};

async function all<T>(table: string, order: string, ascending = true): Promise<T[]> {
  try {
    const {data, error} = await getSupabaseAdmin()
      .from(table)
      .select('*')
      .order(order, {ascending});
    return error || !data ? [] : (data as T[]);
  } catch {
    return [];
  }
}

export const getAdminOrgs = () => all<AdminOrg>('organizations', 'sort');
export const getAdminNews = () => all<AdminNews>('news', 'sort');
export const getAdminOpps = () => all<AdminOpp>('opportunities', 'sort');
export const getAdminRequests = () =>
  all<AdminRequest>('membership_requests', 'created_at', false);
export const getAdminSubscribers = () =>
  all<AdminSubscriber>('newsletter_subscribers', 'created_at', false);
