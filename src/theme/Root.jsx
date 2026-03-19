import React from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

export default function Root({ children }) {
  return (
    <>
      {children}
      <SpeedInsights />
      <Analytics />
    </>
  );
}