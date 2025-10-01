import { Play } from 'lucide-react';

interface VideoSectionProps {
  videoId: string;
  title?: string;
  description?: string;
}

export const VideoSection = ({
  videoId,
  title = "See the Unimog Community Hub in Action",
  description = "Watch how our platform brings Unimog enthusiasts together from around the world"
}: VideoSectionProps) => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-military-green/10 rounded-full mb-4">
            <Play className="w-4 h-4 text-military-green" />
            <span className="text-sm font-medium text-military-green">Platform Overview</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-border">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="Unimog Community Hub Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        {/* Optional: Add a subtle decoration */}
        <div className="max-w-5xl mx-auto mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Join thousands of Unimog enthusiasts worldwide
          </p>
        </div>
      </div>
    </section>
  );
};
