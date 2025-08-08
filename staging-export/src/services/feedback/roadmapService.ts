
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  created_at: string;
  target_completion?: string;
  completed_at?: string;
  feedback_ids?: string[];
  user_votes: number;
}

export interface RoadmapFilter {
  status?: string[];
  priority?: string[];
  category?: string[];
  sort?: 'priority' | 'votes' | 'created' | 'target';
  sortDirection?: 'asc' | 'desc';
}

// Create a new roadmap item
export const createRoadmapItem = async (
  item: Omit<RoadmapItem, 'id' | 'created_at' | 'user_votes'>
): Promise<RoadmapItem | null> => {
  try {
    const newItem = {
      id: uuidv4(),
      ...item,
      created_at: new Date().toISOString(),
      user_votes: 0
    };
    
    const { data, error } = await supabase
      .from('roadmap_items')
      .insert(newItem)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating roadmap item:', error);
      return null;
    }
    
    // If feedback IDs are provided, link them to the roadmap item
    if (item.feedback_ids && item.feedback_ids.length > 0) {
      const linkPromises = item.feedback_ids.map(feedbackId => 
        supabase
          .from('feedback_roadmap')
          .insert({
            feedback_id: feedbackId,
            roadmap_id: newItem.id
          })
      );
      
      // Execute all links in parallel
      await Promise.all(linkPromises);
      
      // Update status of linked feedback items
      await supabase
        .from('feedback')
        .update({ status: 'reviewing' })
        .in('id', item.feedback_ids);
    }
    
    return data as RoadmapItem;
  } catch (error) {
    console.error('Unexpected error in createRoadmapItem:', error);
    return null;
  }
};

// Get roadmap items with optional filtering
export const getRoadmapItems = async (
  filter?: RoadmapFilter
): Promise<RoadmapItem[]> => {
  try {
    let query = supabase
      .from('roadmap_items')
      .select('*');
    
    // Apply filters
    if (filter) {
      if (filter.status && filter.status.length > 0) {
        query = query.in('status', filter.status);
      }
      
      if (filter.priority && filter.priority.length > 0) {
        query = query.in('priority', filter.priority);
      }
      
      if (filter.category && filter.category.length > 0) {
        query = query.in('category', filter.category);
      }
      
      // Apply sorting
      if (filter.sort) {
        const direction = filter.sortDirection || 'desc';
        let sortField: string;
        
        switch (filter.sort) {
          case 'priority':
            // Custom priority ordering
            sortField = filter.sortDirection === 'asc' 
              ? 'priority.low,priority.medium,priority.high,priority.urgent'
              : 'priority.urgent,priority.high,priority.medium,priority.low';
            break;
          case 'votes':
            sortField = 'user_votes';
            break;
          case 'created':
            sortField = 'created_at';
            break;
          case 'target':
            sortField = 'target_completion';
            break;
        }
        
        query = query.order(sortField, { ascending: direction === 'asc' });
      } else {
        // Default sorting
        query = query.order('created_at', { ascending: false });
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching roadmap items:', error);
      return [];
    }
    
    return data as RoadmapItem[];
  } catch (error) {
    console.error('Unexpected error in getRoadmapItems:', error);
    return [];
  }
};

// Update roadmap item status
export const updateRoadmapItemStatus = async (
  itemId: string,
  status: RoadmapItem['status']
): Promise<boolean> => {
  try {
    // Get the item's associated feedback items first
    const { data: relationData, error: relationError } = await supabase
      .from('feedback_roadmap')
      .select('feedback_id')
      .eq('roadmap_id', itemId);
    
    if (relationError) {
      console.error('Error fetching feedback relations:', relationError);
    }
    
    // Update the roadmap item
    const updateData: Partial<RoadmapItem> = { status };
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }
    
    const { error } = await supabase
      .from('roadmap_items')
      .update(updateData)
      .eq('id', itemId);
    
    if (error) {
      console.error('Error updating roadmap item:', error);
      return false;
    }
    
    // If the item is marked as completed, update associated feedback items
    if (status === 'completed' && relationData && relationData.length > 0) {
      const feedbackIds = relationData.map(r => r.feedback_id);
      
      const { error: feedbackError } = await supabase
        .from('feedback')
        .update({ status: 'implemented' })
        .in('id', feedbackIds);
      
      if (feedbackError) {
        console.error('Error updating feedback status:', feedbackError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error in updateRoadmapItemStatus:', error);
    return false;
  }
};

// Get feedback items that can be added to the roadmap
export const getAvailableFeedbackForRoadmap = async (): Promise<any[]> => {
  try {
    // Get feedback items that don't have a roadmap association
    // Only include feature requests and suggestions with multiple votes
    const { data, error } = await supabase
      .rpc('get_unassigned_feedback_for_roadmap');
    
    if (error) {
      console.error('Error fetching available feedback:', error);
      
      // Fallback query if RPC is not defined
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('feedback')
        .select('id, type, content, votes, created_at')
        .in('type', ['feature_request', 'suggestion'])
        .gt('votes', 0)
        .not('status', 'eq', 'implemented')
        .order('votes', { ascending: false });
      
      if (fallbackError) {
        console.error('Error with fallback feedback query:', fallbackError);
        return [];
      }
      
      return fallbackData || [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error in getAvailableFeedbackForRoadmap:', error);
    return [];
  }
};

// Generate roadmap recommendations based on feedback
export const generateRoadmapRecommendations = async (): Promise<RoadmapItem[]> => {
  try {
    const { data: feedback, error } = await supabase
      .from('feedback')
      .select('id, type, content, votes, created_at')
      .in('type', ['feature_request', 'suggestion'])
      .gt('votes', 2)
      .is('status', null)
      .order('votes', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error('Error fetching feedback for recommendations:', error);
      return [];
    }
    
    // Transform top voted feedback into roadmap recommendations
    return feedback.map(item => ({
      id: uuidv4(),
      title: `New Feature: ${item.content.substring(0, 50)}${item.content.length > 50 ? '...' : ''}`,
      description: item.content,
      status: 'planned',
      priority: item.votes > 10 ? 'high' : item.votes > 5 ? 'medium' : 'low',
      category: 'community_request',
      created_at: new Date().toISOString(),
      feedback_ids: [item.id],
      user_votes: item.votes
    }));
  } catch (error) {
    console.error('Unexpected error in generateRoadmapRecommendations:', error);
    return [];
  }
};
