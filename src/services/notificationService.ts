import { supabase } from '@/lib/supabase-client';
import { Notification, CreateNotificationInput } from '@/types/notification';

/**
 * Fetch notifications for the current user
 */
export const fetchNotifications = async (limit = 10): Promise<Notification[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Try to fetch from notifications table if it exists
  let { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  // If notifications table doesn't exist, generate notifications from activity
  if (error?.code === '42P01' || error?.message?.includes('relation "notifications" does not exist')) {
    // Fallback: Generate notifications from various sources
    return generateNotificationsFromActivity(user.id, limit);
  }

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return data || [];
};

/**
 * Generate notifications from user activity (fallback when notifications table doesn't exist)
 */
const generateNotificationsFromActivity = async (userId: string, limit: number): Promise<Notification[]> => {
  const notifications: Notification[] = [];
  
  try {
    // Check for new comments on user's posts
    const { data: postComments } = await supabase
      .from('post_comments')
      .select(`
        id,
        content,
        created_at,
        user_id,
        post_id,
        profiles!user_id(full_name, display_name)
      `)
      .eq('post_id', userId) // This would need proper join logic
      .order('created_at', { ascending: false })
      .limit(3);

    if (postComments) {
      postComments.forEach(comment => {
        notifications.push({
          id: `comment-${comment.id}`,
          user_id: userId,
          type: 'post_comment',
          title: 'New comment on your post',
          message: `${comment.profiles?.display_name || 'Someone'} commented on your post`,
          link: `/community/posts/${comment.post_id}`,
          read: false,
          created_at: comment.created_at,
          metadata: {
            sender_id: comment.user_id,
            sender_name: comment.profiles?.display_name || comment.profiles?.full_name,
            post_id: comment.post_id
          }
        });
      });
    }

    // Check for new marketplace activity
    const { data: listings } = await supabase
      .from('marketplace_listings')
      .select('id, title, created_at')
      .neq('seller_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(2);

    if (listings) {
      listings.forEach(listing => {
        notifications.push({
          id: `listing-${listing.id}`,
          user_id: userId,
          type: 'marketplace',
          title: 'New marketplace listing',
          message: `New listing available: ${listing.title}`,
          link: `/marketplace/listings/${listing.id}`,
          read: false,
          created_at: listing.created_at,
          metadata: {
            listing_id: listing.id
          }
        });
      });
    }

    // Check for trip updates
    const { data: trips } = await supabase
      .from('trips')
      .select('id, title, start_date')
      .gte('start_date', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(2);

    if (trips) {
      trips.forEach(trip => {
        notifications.push({
          id: `trip-${trip.id}`,
          user_id: userId,
          type: 'trip',
          title: 'New trip available',
          message: `Check out the upcoming trip: ${trip.title}`,
          link: `/trips/${trip.id}`,
          read: false,
          created_at: new Date().toISOString(),
          metadata: {
            trip_id: trip.id
          }
        });
      });
    }

    // Add a system notification
    notifications.push({
      id: 'system-welcome',
      user_id: userId,
      type: 'system',
      title: 'Welcome to Unimog Community Hub',
      message: 'Check out the latest features and community updates',
      link: '/dashboard',
      read: false,
      created_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating notifications:', error);
  }

  // Sort by date and limit
  return notifications
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }

  return true;
};

/**
 * Mark all notifications as read for current user
 */
export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', user.id)
    .eq('read', false);

  if (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }

  return true;
};

/**
 * Get unread notification count
 */
export const getUnreadNotificationCount = async (): Promise<number> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('read', false);

  if (error) {
    // If notifications table doesn't exist, return 0
    if (error.code === '42P01' || error.message?.includes('relation "notifications" does not exist')) {
      return 0;
    }
    console.error('Error getting unread count:', error);
    return 0;
  }

  return count || 0;
};

/**
 * Create a new notification
 */
export const createNotification = async (input: CreateNotificationInput): Promise<Notification | null> => {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      ...input,
      read: false,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating notification:', error);
    return null;
  }

  return data;
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  if (error) {
    console.error('Error deleting notification:', error);
    return false;
  }

  return true;
};