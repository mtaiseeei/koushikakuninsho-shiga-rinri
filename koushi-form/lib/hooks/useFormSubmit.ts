import { useState } from 'react';
import axios from 'axios';
import { FormData } from '@/types/form';
import { SubmitResponse } from '@/types/api';

export function useFormSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submitForm = async (data: FormData): Promise<SubmitResponse | null> => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await axios.post('/api/submit', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      const message = axios.isAxiosError(error) && error.response?.data?.error
        ? error.response.data.error
        : 'フォームの送信に失敗しました';
      setSubmitError(message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitForm,
    isSubmitting,
    submitError,
  };
}