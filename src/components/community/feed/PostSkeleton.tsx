import { SkeletonCard } from "@/components/ui/skeleton";

interface PostSkeletonProps {
  count?: number;
}

export function PostSkeleton({ count = 3 }: PostSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} className="mb-4" />
      ))}
    </>
  );
}

export function PostListSkeleton() {
  return (
    <div className="space-y-4">
      <PostSkeleton count={5} />
    </div>
  );
}