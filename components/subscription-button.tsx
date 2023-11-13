'use client';

import axios from 'axios';
import toast from 'react-hot-toast';
import { Zap } from 'lucide-react';
import { useState } from 'react';

import { Button } from './ui/button';

interface SubscriptionButtonProps {
  isPro: boolean;
}

const SubscriptionButton = ({ isPro }: SubscriptionButtonProps) => {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);

      const res = await axios.get('/api/stripe');
      window.location.href = res.data.url;
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      disabled={loading}
      variant={isPro ? 'default' : 'premium'}
      onClick={onClick}>
      {isPro ? 'Manage Subscription' : 'Upgrade'}
      {!isPro && <Zap className='w-4 h-4 ml-2 fill-white' />}
    </Button>
  );
};

export default SubscriptionButton;
