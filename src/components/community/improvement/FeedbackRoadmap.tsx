
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { 
  CalendarIcon, 
  PlusIcon, 
  ChevronRightIcon, 
  ChevronDownIcon,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  CheckIcon
} from 'lucide-react';
import {
  RoadmapItem,
  getRoadmapItems,
  createRoadmapItem,
  updateRoadmapItemStatus,
  getAvailableFeedbackForRoadmap,
  generateRoadmapRecommendations,
  RoadmapFilter
} from '@/services/feedback/roadmapService';

export function FeedbackRoadmap() {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newItem, setNewItem] = useState<Partial<RoadmapItem>>({
    title: '',
    description: '',
    status: 'planned',
    priority: 'medium',
    category: 'feature'
  });
  const [availableFeedback, setAvailableFeedback] = useState<any[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);
  const [filter, setFilter] = useState<RoadmapFilter>({
    status: [],
    priority: [],
    category: [],
    sort: 'priority',
    sortDirection: 'desc'
  });
  
  // Load roadmap items
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const fetchedItems = await getRoadmapItems(filter);
      setItems(fetchedItems);
      setLoading(false);
    };
    
    fetchItems();
  }, [filter]);
  
  // Create new roadmap item
  const handleCreateItem = async () => {
    if (!newItem.title || !newItem.description) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a title and description for the roadmap item.',
        variant: 'destructive'
      });
      return;
    }
    
    setLoading(true);
    
    const createdItem = await createRoadmapItem({
      title: newItem.title || '',
      description: newItem.description || '',
      status: (newItem.status as RoadmapItem['status']) || 'planned',
      priority: (newItem.priority as RoadmapItem['priority']) || 'medium',
      category: newItem.category || 'feature',
      target_completion: newItem.target_completion,
      feedback_ids: selectedFeedback.length > 0 ? selectedFeedback : undefined
    });
    
    setLoading(false);
    
    if (createdItem) {
      setItems(prev => [createdItem, ...prev]);
      setShowNewDialog(false);
      
      // Reset form
      setNewItem({
        title: '',
        description: '',
        status: 'planned',
        priority: 'medium',
        category: 'feature'
      });
      setSelectedFeedback([]);
      
      toast({
        title: 'Roadmap Item Created',
        description: 'The new roadmap item has been created successfully.'
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to create roadmap item. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  // Update item status
  const handleStatusChange = async (itemId: string, newStatus: RoadmapItem['status']) => {
    const updated = await updateRoadmapItemStatus(itemId, newStatus);
    
    if (updated) {
      // Update local state
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, status: newStatus } : item
      ));
      
      toast({
        title: 'Status Updated',
        description: `Item status changed to ${newStatus.replace('_', ' ')}.`
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update status. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  // Load feedback for new roadmap item
  const fetchAvailableFeedback = async () => {
    const feedback = await getAvailableFeedbackForRoadmap();
    setAvailableFeedback(feedback);
  };
  
  // Toggle feedback selection
  const toggleFeedbackSelection = (id: string) => {
    setSelectedFeedback(prev => 
      prev.includes(id) 
        ? prev.filter(fid => fid !== id) 
        : [...prev, id]
    );
  };
  
  // Get roadmap recommendations
  const getRecommendations = async () => {
    setLoading(true);
    const recommendations = await generateRoadmapRecommendations();
    setLoading(false);
    
    if (recommendations.length > 0) {
      // Show the first recommendation in the dialog
      const firstRecommendation = recommendations[0];
      setNewItem({
        title: firstRecommendation.title,
        description: firstRecommendation.description,
        status: firstRecommendation.status,
        priority: firstRecommendation.priority,
        category: firstRecommendation.category
      });
      setSelectedFeedback(firstRecommendation.feedback_ids || []);
      setShowNewDialog(true);
      
      toast({
        title: 'Recommendation Generated',
        description: 'A roadmap item has been suggested based on popular feedback.'
      });
    } else {
      toast({
        title: 'No Recommendations',
        description: 'No recommendations available. Try adding more feedback first.'
      });
    }
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300';
      case 'on_hold':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800/60 dark:text-gray-300';
      default:
        return '';
    }
  };
  
  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-slate-100 text-slate-800 hover:bg-slate-100 dark:bg-slate-900/30 dark:text-slate-300';
      case 'medium':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300';
      case 'urgent':
        return 'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300';
      default:
        return '';
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planned':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'on_hold':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  // Apply filter
  const applyFilter = (key: keyof RoadmapFilter, value: any) => {
    setFilter(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Group items by status for kanban view
  const groupedItems = {
    planned: items.filter(item => item.status === 'planned'),
    in_progress: items.filter(item => item.status === 'in_progress'),
    completed: items.filter(item => item.status === 'completed'),
    on_hold: items.filter(item => item.status === 'on_hold')
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Community Roadmap</CardTitle>
              <CardDescription>
                Plan and track feature development based on user feedback
              </CardDescription>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline"
                onClick={getRecommendations}
                disabled={loading}
              >
                Recommend Item
              </Button>
              <Button onClick={() => {
                fetchAvailableFeedback();
                setShowNewDialog(true);
              }}>
                <PlusIcon className="mr-2 h-4 w-4" />
                New Item
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="kanban">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <TabsList>
                <TabsTrigger value="kanban">Kanban</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <Select 
                  value={filter.sort} 
                  onValueChange={(value: any) => applyFilter('sort', value)}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="votes">User Votes</SelectItem>
                    <SelectItem value="created">Date Created</SelectItem>
                    <SelectItem value="target">Target Date</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={filter.sortDirection}
                  onValueChange={(value: any) => applyFilter('sortDirection', value)}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Kanban View */}
            <TabsContent value="kanban" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Planned Column */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-950 p-2 rounded-md">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium">Planned</h3>
                    <Badge className="ml-auto bg-blue-100 text-blue-800">
                      {groupedItems.planned.length}
                    </Badge>
                  </div>
                  
                  {groupedItems.planned.map(item => (
                    <Card key={item.id} className="border-l-4 border-l-blue-500">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-base">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                          <Badge variant="outline">{item.category}</Badge>
                          {item.user_votes > 0 && (
                            <Badge variant="secondary">{item.user_votes} votes</Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="py-2 px-4">
                        <Select 
                          defaultValue={item.status} 
                          onValueChange={(value: any) => handleStatusChange(item.id, value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="on_hold">On Hold</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </CardFooter>
                    </Card>
                  ))}
                  
                  {groupedItems.planned.length === 0 && (
                    <div className="border border-dashed rounded-md p-4 text-center text-muted-foreground text-sm">
                      No planned items
                    </div>
                  )}
                </div>
                
                {/* In Progress Column */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-950 p-2 rounded-md">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <h3 className="font-medium">In Progress</h3>
                    <Badge className="ml-auto bg-yellow-100 text-yellow-800">
                      {groupedItems.in_progress.length}
                    </Badge>
                  </div>
                  
                  {groupedItems.in_progress.map(item => (
                    <Card key={item.id} className="border-l-4 border-l-yellow-500">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-base">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                          <Badge variant="outline">{item.category}</Badge>
                          {item.user_votes > 0 && (
                            <Badge variant="secondary">{item.user_votes} votes</Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="py-2 px-4">
                        <Select 
                          defaultValue={item.status} 
                          onValueChange={(value: any) => handleStatusChange(item.id, value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="on_hold">On Hold</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </CardFooter>
                    </Card>
                  ))}
                  
                  {groupedItems.in_progress.length === 0 && (
                    <div className="border border-dashed rounded-md p-4 text-center text-muted-foreground text-sm">
                      No in-progress items
                    </div>
                  )}
                </div>
                
                {/* Completed Column */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-950 p-2 rounded-md">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h3 className="font-medium">Completed</h3>
                    <Badge className="ml-auto bg-green-100 text-green-800">
                      {groupedItems.completed.length}
                    </Badge>
                  </div>
                  
                  {groupedItems.completed.map(item => (
                    <Card key={item.id} className="border-l-4 border-l-green-500">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-base">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                          <Badge variant="outline">{item.category}</Badge>
                          {item.completed_at && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.completed_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {groupedItems.completed.length === 0 && (
                    <div className="border border-dashed rounded-md p-4 text-center text-muted-foreground text-sm">
                      No completed items
                    </div>
                  )}
                </div>
                
                {/* On Hold Column */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-900 p-2 rounded-md">
                    <XCircle className="h-5 w-5 text-gray-500" />
                    <h3 className="font-medium">On Hold</h3>
                    <Badge className="ml-auto bg-gray-100 text-gray-800">
                      {groupedItems.on_hold.length}
                    </Badge>
                  </div>
                  
                  {groupedItems.on_hold.map(item => (
                    <Card key={item.id} className="border-l-4 border-l-gray-500">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-base">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                          <Badge variant="outline">{item.category}</Badge>
                          {item.user_votes > 0 && (
                            <Badge variant="secondary">{item.user_votes} votes</Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="py-2 px-4">
                        <Select 
                          defaultValue={item.status} 
                          onValueChange={(value: any) => handleStatusChange(item.id, value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="on_hold">On Hold</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </CardFooter>
                    </Card>
                  ))}
                  
                  {groupedItems.on_hold.length === 0 && (
                    <div className="border border-dashed rounded-md p-4 text-center text-muted-foreground text-sm">
                      No on-hold items
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            {/* List View */}
            <TabsContent value="list" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Votes</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No roadmap items found
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <Collapsible>
                            <div className="flex items-center space-x-2">
                              <CollapsibleTrigger className="text-muted-foreground hover:bg-muted p-1 rounded-full">
                                <ChevronRightIcon className="h-4 w-4" />
                              </CollapsibleTrigger>
                              <span>{item.title}</span>
                            </div>
                            <CollapsibleContent className="p-2 ml-5 mt-1 bg-muted/20 rounded-md">
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </CollapsibleContent>
                          </Collapsible>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>
                            <span className="flex items-center space-x-1">
                              {getStatusIcon(item.status)}
                              <span>
                                {item.status.replace('_', ' ')}
                              </span>
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell>{item.user_votes}</TableCell>
                        <TableCell>
                          {new Date(item.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Select 
                            defaultValue={item.status} 
                            onValueChange={(value: any) => handleStatusChange(item.id, value)}
                          >
                            <SelectTrigger className="h-8 w-[130px] text-xs">
                              <SelectValue placeholder="Update status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="planned">Planned</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="on_hold">On Hold</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* New Roadmap Item Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Roadmap Item</DialogTitle>
            <DialogDescription>
              Add an item to the community roadmap based on user feedback.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Title *</label>
              <Input 
                id="title" 
                value={newItem.title} 
                onChange={(e) => setNewItem({...newItem, title: e.target.value})} 
                placeholder="Brief, descriptive title"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Description *</label>
              <Textarea 
                id="description" 
                value={newItem.description} 
                onChange={(e) => setNewItem({...newItem, description: e.target.value})} 
                placeholder="Detailed description of the feature or improvement" 
                className="resize-none min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
                <Select 
                  value={newItem.status}
                  onValueChange={(value: any) => setNewItem({...newItem, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-sm font-medium mb-1">Priority</label>
                <Select 
                  value={newItem.priority}
                  onValueChange={(value: any) => setNewItem({...newItem, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
                <Select 
                  value={newItem.category}
                  onValueChange={(value: any) => setNewItem({...newItem, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="improvement">Improvement</SelectItem>
                    <SelectItem value="bug_fix">Bug Fix</SelectItem>
                    <SelectItem value="community_request">Community Request</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="ui_ux">UI/UX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label htmlFor="target" className="block text-sm font-medium mb-1">Target Completion Date</label>
              <Input 
                id="target" 
                type="date" 
                value={newItem.target_completion} 
                onChange={(e) => setNewItem({...newItem, target_completion: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Related Feedback</label>
              
              {availableFeedback.length > 0 ? (
                <div className="max-h-[200px] overflow-y-auto border rounded-md p-2">
                  {availableFeedback.map(feedback => (
                    <div key={feedback.id} className="flex items-center space-x-2 py-2 border-b last:border-0">
                      <div 
                        className={`w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer
                          ${selectedFeedback.includes(feedback.id) 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-background'}`}
                        onClick={() => toggleFeedbackSelection(feedback.id)}
                      >
                        {selectedFeedback.includes(feedback.id) && <CheckIcon className="h-3 w-3" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">{feedback.content}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{feedback.type.replace('_', ' ')}</Badge>
                          <Badge>{feedback.votes} votes</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(feedback.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border rounded-md p-4 text-center text-muted-foreground">
                  No available feedback to link
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateItem} disabled={loading}>
              {loading ? 'Creating...' : 'Create Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
