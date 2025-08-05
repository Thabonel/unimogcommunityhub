
import { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAnalytics } from "@/hooks/use-analytics";
import { supabase } from '@/lib/supabase';

const groupSchema = z.object({
  name: z.string().min(3, {
    message: "Group name must be at least 3 characters.",
  }).max(50, {
    message: "Group name cannot be longer than 50 characters."
  }),
  description: z.string().max(500, {
    message: "Description cannot be longer than 500 characters."
  }).optional(),
  isPrivate: z.boolean().default(false),
  membersCanInvite: z.boolean().default(false),
  autoApproveMembers: z.boolean().default(true),
});

type GroupFormValues = z.infer<typeof groupSchema>;

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGroupDialog({ open, onOpenChange }: CreateGroupDialogProps) {
  const { user } = useAuth();
  const { trackFeatureUse } = useAnalytics();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
      isPrivate: false,
      membersCanInvite: false,
      autoApproveMembers: true,
    },
  });

  const onSubmit = async (values: GroupFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a group",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Track group creation attempt
      trackFeatureUse('create_group', {
        is_private: values.isPrivate,
        members_can_invite: values.membersCanInvite,
        auto_approve_members: values.autoApproveMembers,
        action: 'submit'
      });

      // Create the group in the database
      const { data: group, error } = await supabase
        .from('community_groups')
        .insert({
          name: values.name,
          description: values.description,
          is_private: values.isPrivate,
          created_by: user.id,
          metadata: {
            members_can_invite: values.membersCanInvite,
            auto_approve_members: values.autoApproveMembers,
          }
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Add the creator as the first member with admin role
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user.id,
          role: 'admin',
          joined_at: new Date().toISOString()
        });
        
      if (memberError) {
        // If member creation fails, try to clean up the group
        await supabase
          .from('community_groups')
          .delete()
          .eq('id', group.id);
        throw memberError;
      }
      
      toast({
        title: "Group created!",
        description: `${values.name} has been successfully created.`,
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Failed to create group",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Group</DialogTitle>
          <DialogDescription>
            Connect with like-minded Unimog enthusiasts by creating a dedicated group.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Unimog Enthusiasts" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about your group..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isPrivate"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Private Group</FormLabel>
                    <FormDescription className="text-xs text-muted-foreground">
                      Members must be approved to join.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch('isPrivate') && (
              <>
                <FormField
                  control={form.control}
                  name="autoApproveMembers"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Auto-approve Members</FormLabel>
                        <FormDescription className="text-xs text-muted-foreground">
                          Automatically approve member requests.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="membersCanInvite"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Members Can Invite</FormLabel>
                        <FormDescription className="text-xs text-muted-foreground">
                          Allow members to invite others.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Group"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
