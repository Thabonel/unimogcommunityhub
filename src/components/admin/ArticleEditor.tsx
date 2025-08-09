
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save, Eye, ArrowUpToLine } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { ArticleData } from "@/types/article";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from '@/lib/supabase-client';

interface ArticleEditorProps {
  article?: ArticleData;
  onSave?: () => void;
  onCancel?: () => void;
}

export function ArticleEditor({ article, onSave, onCancel }: ArticleEditorProps) {
  const [title, setTitle] = useState(article?.title || "");
  const [content, setContent] = useState(article?.content || "");
  const [excerpt, setExcerpt] = useState(article?.excerpt || "");
  const [category, setCategory] = useState(article?.category || "Maintenance");
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">(article?.is_approved ? "published" : "draft");
  const [publishDate, setPublishDate] = useState<Date | undefined>(
    article?.published_at ? new Date(article.published_at) : new Date()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();
  
  // Auto-save timer
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Auto-save draft every 30 seconds
  useEffect(() => {
    let saveInterval: number;
    
    if (status === "draft" && (title || content)) {
      saveInterval = window.setInterval(() => {
        handleAutoSave();
      }, 30000);
    }
    
    return () => {
      if (saveInterval) clearInterval(saveInterval);
    };
  }, [title, content, excerpt, category, status, publishDate]);
  
  const handleAutoSave = async () => {
    // Only auto-save if this is an existing article and it's a draft
    if (article?.id && status === "draft") {
      try {
        await supabase
          .from("community_articles")
          .update({
            title,
            content,
            excerpt,
            category,
            is_approved: false,
            updated_at: new Date().toISOString()
          })
          .eq("id", article.id);
        
        setLastSaved(new Date());
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }
  };
  
  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };
  
  const handleSubmit = async (publishNow: boolean = false) => {
    setIsSubmitting(true);
    try {
      const articleData = {
        title,
        content,
        excerpt,
        category,
        is_approved: publishNow || status === "published",
        published_at: publishNow ? new Date().toISOString() : 
                    status === "scheduled" ? publishDate?.toISOString() : 
                    status === "published" ? (publishDate || new Date()).toISOString() : null,
        // Calculate approximate reading time (words / 200 words per minute)
        reading_time: Math.max(1, Math.ceil(content.split(/\s+/).length / 200))
      };
      
      if (article?.id) {
        // Update existing article
        await supabase
          .from("community_articles")
          .update(articleData)
          .eq("id", article.id);
          
        toast({
          title: "Article updated",
          description: publishNow ? "Article published successfully" : "Changes saved successfully"
        });
      } else {
        // Create new article
        const { data: userData } = await supabase.auth.getUser();
        const { error } = await supabase
          .from("community_articles")
          .insert({
            ...articleData,
            author_id: userData.user?.id,
            author_name: userData.user?.email || "Admin User"
          });
          
        if (error) throw error;
        
        toast({
          title: "Article created",
          description: publishNow ? "Article published successfully" : "Article saved as draft"
        });
      }
      
      if (onSave) onSave();
    } catch (error) {
      console.error("Error saving article:", error);
      toast({
        title: "Error",
        description: "Failed to save article. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{article ? "Edit Article" : "Create New Article"}</h2>
          {lastSaved && (
            <p className="text-sm text-muted-foreground">
              Last auto-saved: {format(lastSaved, "HH:mm:ss")}
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleSubmit(false)} 
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button 
            onClick={() => handleSubmit(true)} 
            disabled={isSubmitting || !title || !content}
          >
            <ArrowUpToLine className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Article title"
              className="text-lg font-medium"
            />
          </div>
          
          <div>
            <Label htmlFor="excerpt">Summary</Label>
            <Textarea 
              id="excerpt" 
              value={excerpt} 
              onChange={(e) => setExcerpt(e.target.value)} 
              placeholder="Brief summary of the article"
              className="h-20"
            />
          </div>
          
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea 
              id="content" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder="Write your article content here"
              className="h-64 font-mono"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="status">Publication Status</Label>
                <Select 
                  value={status} 
                  onValueChange={(value) => setStatus(value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {status === "scheduled" && (
                <div>
                  <Label>Publication Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {publishDate ? format(publishDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={publishDate}
                        onSelect={setPublishDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={category} 
                  onValueChange={setCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Repair">Repair</SelectItem>
                    <SelectItem value="Adventures">Adventures</SelectItem>
                    <SelectItem value="Modifications">Modifications</SelectItem>
                    <SelectItem value="Tyres">Tyres</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Tags</Label>
                <div className="flex mt-1 mb-1">
                  <Input 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    className="flex-1"
                  />
                  <Button 
                    variant="secondary"
                    onClick={handleAddTag}
                    className="ml-2"
                    type="button"
                    disabled={!tagInput}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.map((tag) => (
                    <div 
                      key={tag}
                      className="bg-muted px-2 py-1 rounded-md text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button 
                        onClick={() => handleRemoveTag(tag)}
                        className="text-muted-foreground hover:text-foreground ml-1"
                        type="button"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">SEO Preview</h3>
              <div className="space-y-2 border-l-4 border-primary pl-3">
                <p className="text-blue-600 text-lg font-medium truncate">
                  {title || "Article Title"}
                </p>
                <p className="text-green-700 text-sm">
                  unimogcommunityhub.com › {category?.toLowerCase() || 'category'} › {title 
                    ? title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
                    : 'article-slug'}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {excerpt || "Add a summary to preview how your article will appear in search results."}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Reading Time</h3>
              <p>{Math.max(1, Math.ceil((content.split(/\s+/).length) / 200))} min read</p>
            </CardContent>
          </Card>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.open(`/knowledge/${category?.toLowerCase()}/${title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}`, '_blank')}
            disabled={!title}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
