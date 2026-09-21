import { Analytics } from '@vercel/analytics/react';
import { isAnalyticsEnabled, sanitizeAnalyticsEvent } from '../../site/analytics.mjs';

export const SiteAnalytics = () => (
  isAnalyticsEnabled() ? (
    <Analytics
      debug={false}
      mode={`production`}
      beforeSend={sanitizeAnalyticsEvent}
    />
  ) : null
);
