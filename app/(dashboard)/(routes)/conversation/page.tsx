'use client';

import * as z from 'zod';
import axios from 'axios';
import OpenAI from 'openai';
import toast from 'react-hot-toast';
import { MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { formSchema } from './constanst';
import { cn } from '@/lib/utils';
import { useProModal } from '@/hooks/use-pro-modal';

import Heading from '@/components/heading';
import Empty from '@/components/empty';
import Loader from '@/components/loader';
import UserAvatar from '@/components/user-avatar';
import BotAvatar from '@/components/bot-avatar';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ConversationPage = () => {
  const router = useRouter();
  const proModal = useProModal();

  const [messages, setMessages] = useState<
    OpenAI.Chat.ChatCompletionMessageParam[]
  >([]);

  const renderMessageContent = (
    content: string | OpenAI.Chat.ChatCompletionContentPart[]
  ) => {
    if (typeof content === 'string') {
      return <p className='text-sm'>{content}</p>;
    }

    return content.map((part, index) => {
      if (part.type === 'text') {
        return (
          <p
            key={index}
            className='text-sm'>
            {part.text}
          </p>
        );
      }
      // Handle other types if necessary
      return null;
    });
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: OpenAI.Chat.ChatCompletionMessageParam = {
        role: 'user',
        content: values.prompt,
      };

      const newMessages = [...messages, userMessage];

      const res = await axios.post('/api/conversation', {
        messages: newMessages,
      });

      setMessages((current) => [...current, userMessage, res.data]);

      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error('Something went wrong.');
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title='Conversation'
        description='Our most advanced conversation model.'
        icon={MessageSquare}
        iconColor='text-violet-500'
        bgColor='bg-violet-500/10'
      />

      <div className='px-4 lg:px-8'>
        <Form {...form}>
          <form
            action=''
            onSubmit={form.handleSubmit(onSubmit)}
            className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2'>
            <FormField
              name='prompt'
              render={({ field }) => (
                <FormItem className='col-span-12 lg:col-span-10'>
                  <FormControl className='m-0 p-0'>
                    <Input
                      className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                      disabled={isLoading}
                      autoComplete='off'
                      placeholder='How do I calculate the radius of a circle?'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              className='col-span-12 lg:col-span-2 w-full'
              disabled={isLoading}>
              Generate
            </Button>
          </form>
        </Form>
      </div>

      <div className='space-y-4 mt-4'>
        {isLoading && (
          <div className='p-8 rounded-lg w-full flex items-center justify-center bg-muted'>
            <Loader />
          </div>
        )}

        {messages.length === 0 && !isLoading && (
          <Empty label='No conversation started.' />
        )}

        <div className='flex flex-col-reverse gap-y-4'>
          {messages.map((message, index) => (
            <div
              key={`${message.content}-${index}`}
              className={cn(
                'p-8 w-full flex items-start gap-x-8 rounded-lg',
                message.role === 'user'
                  ? 'bg-white border border-black/10'
                  : 'bg-muted'
              )}>
              {message.role === 'user' ? <UserAvatar /> : <BotAvatar />}
              {message.content && renderMessageContent(message.content)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
