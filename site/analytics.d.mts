import type { BeforeSendEvent } from '@vercel/analytics';

export function isAnalyticsEnabled(): boolean;
export function sanitizeAnalyticsEvent(event: BeforeSendEvent): BeforeSendEvent | null;
