import type { PageLoad } from './$types';

type PaymentStatus = 'Pending' | 'Paid' | 'Failed';

type DomainRow = {
  id: string;
  name: string;
  selectedUrls: number;
  scrapedArticles: number;
  paymentStatus: PaymentStatus;
  statusMessage: string;
  processId?: string;
};

export const load: PageLoad = async ({ fetch }) => {
  try {
    const res = await fetch('/api/domains');
    if (!res.ok) throw new Error('Failed to fetch domains');
    const domains: DomainRow[] = await res.json();
    return { domains };
  } catch (e) {
    console.error(e);
    return { domains: [] satisfies DomainRow[] };
  }
};


