export type CancellationStep = 
  | 'initial'
  | 'foundJob'
  | 'review'
  | 'visa'
  | 'visaNoHelp'
  | 'visaHelp'
  | 'downsell'
  | 'offerDeclined'
  | 'offerDeclinedReason'
  | 'offerAccepted'
  | 'pageEnd'
  | 'complete';

export type DownsellVariant = 'A' | 'B';

export type CancellationReason = {
  foundJob: boolean;
  foundJobThroughUs?: boolean;
  feedback?: string;
  visaType?: string;
};

export type Subscription = {
  id: string;
  userId: string;
  monthlyPrice: number; // in cents
  status: 'active' | 'pending_cancellation' | 'cancelled';
};
