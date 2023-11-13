'use client';

import { Crisp } from 'crisp-sdk-web';
import { useEffect } from 'react';

const CrispChat = () => {
  useEffect(() => {
    Crisp.configure('7d550844-406d-4e3b-900d-69522c8715e5');
  }, []);

  return null;
};
export default CrispChat;
