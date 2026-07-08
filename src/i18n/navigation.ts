import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

/**
 * Locale-aware navigation helpers. Always import Link / useRouter / usePathname
 * from here (never from `next/link` or `next/navigation`) so that localized
 * pathnames and the active locale prefix are handled automatically.
 */
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
