'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCurrentUser } from '@/hooks/use-current-user';
import { TbRefresh } from 'react-icons/tb';
import getInitials from '@/lib/initials-name';
import React, { useEffect, useState, useTransition } from 'react';
import TooltipFrag from '@/components/molecules/TooltipFrag';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { ProfileSchema } from '@/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { getProfile, updateProfile } from '@/service/auth';
import { useCurrentToken } from '@/hooks/use-current-token';
import generateAvatar from '@/lib/generateAvatar';
import Notify from '@/components/molecules/Notify';

export default function Profile() {
  const user = useCurrentUser();
  const token = useCurrentToken();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      imgUrl: '',
      name: '',
      address: '',
      contact: '',
    },
  });

  useEffect(() => {
    if (token?.token) {
      const fetchProfile = async () => {
        const data = await getProfile(token.token);
        form.setValue('imgUrl', data?.imgUrl);
        form.setValue('name', data?.name);
        form.setValue('address', data?.address);
        form.setValue('contact', data?.contact);
      };

      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token?.token]);

  const onSubmit = (values: z.infer<typeof ProfileSchema>) => {
    startTransition(() => {
      if (token?.token) {
        updateProfile(token.token, values).then((res) => {
          if (res.error) {
            Notify({
              type: 'error',
              message: res.error,
            });
          }
          if (res.success) {
            Notify({
              type: 'success',
              message: res.success,
            });
          }
        });
      }
    });
  };

  const handleShuffleImgProfile = () => {
    const newImgUrl = generateAvatar(user?.name!);
    form.setValue('imgUrl', newImgUrl, { shouldDirty: true });
  };

  return (
    <div>
      <Card className="max-w-[700px] mx-auto">
        <div className="relative w-full bg-secondary py-3">
          <div className="relative w-max h-max mx-auto top-10">
            <Avatar className="border-[3px] border-background w-20 h-20">
              <AvatarImage src={form.watch('imgUrl')} alt="avatar" />
              <AvatarFallback className="text-3xl font-bold">
                {getInitials(user?.name!).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <TooltipFrag content="Shuffle Image Profile">
              <Button
                variant="outline"
                size="icon"
                onClick={handleShuffleImgProfile}
                className="absolute bottom-0 right-0 rounded-full h-6 w-6">
                <TbRefresh className="h-4 w-4" />
              </Button>
            </TooltipFrag>
          </div>
        </div>
        <CardContent>
          <div className="mt-11 space-y-2 mx-auto w-max text-center">
            <h1 className="font-semibold text-xl">{user?.name}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Separator className="my-4" />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="Jhon Doe"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          min={0}
                          type="number"
                          disabled={isPending}
                          placeholder="08XXXXXXXXX"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={isPending}
                          placeholder="Jl. Jend. Sudirman No. .."
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Separator className="my-4" />
              <Button
                type="submit"
                disabled={!form.formState.isDirty || isPending}
                className="w-full">
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
