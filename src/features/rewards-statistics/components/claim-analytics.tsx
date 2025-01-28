'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type * as Referral from '@/models/referral';
import { ClaimSizeChart } from './claim-size-chart';
import { ClaimBreakdownTable } from './claim-breakdown-table';
import { OverallStats } from './overall-stats';

export default function ClaimAnalytics({
  claimAnalytics
}: {
  claimAnalytics: Referral.ClaimAnalytics;
}) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Claim Analytics</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <OverallStats overall={claimAnalytics?.overall || {}} />
        <div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
          <ClaimBreakdownTable
            breakdown={claimAnalytics?.breakdown || {}}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <ClaimSizeChart breakdown={claimAnalytics?.breakdown || {}} />
        </div>
      </CardContent>
    </Card>
  );
}
