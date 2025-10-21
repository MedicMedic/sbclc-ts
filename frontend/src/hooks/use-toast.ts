// src/hooks/use-toast.ts
import { useState } from 'react';

export const useToast = () => {
  return {
    toast: ({ title, description, variant }: any) => {
      console.log(`${variant || 'info'}: ${title} - ${description}`);
      alert(`${title}\n${description}`);
    }
  };
};