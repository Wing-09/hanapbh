export default function LodgingCardsSkeleton() {
  return Array.from({ length: 4 }).map((_, index) => (
    <div key={index} className="h-fit space-y-3">
      <div className="aspect-square w-full h-auto animate-pulse bg-muted-foreground rounded-xl"></div>
      <div className="w-3/4 h-4 bg-muted-foreground animate-pulse rounded-full"></div>
      <div className="w-2/4 h-4 bg-muted-foreground animate-pulse rounded-full"></div>
    </div>
  ));
}
