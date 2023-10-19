import { Skeleton } from "~/islands/primitives/skeleton";

const LoadingEditor = () => (
  <div className="border rounded-md border-border">
    <Skeleton className="h-10 border-b rounded-t rounded-b-none bg-muted border-border">
      <div className="flex items-center justify-between px-4 h-full">
        <div className="flex items-center space-x-7">
          <Skeleton className="w-20 h-6 rounded-md bg-muted-foreground" />
          <div className="flex space-x-2">
            <Skeleton className="w-5 h-5 rounded-md bg-muted-foreground" />
            <Skeleton className="w-5 h-5 rounded-md bg-muted-foreground" />
            <Skeleton className="w-5 h-5 hidden g:block rounded-md bg-muted-foreground" />
            <Skeleton className="w-5 h-5 lg:block hidden rounded-md bg-muted-foreground" />
          </div>
          <div className="hidden space-x-2 lg:flex">
            <Skeleton className="w-5 h-5 rounded-md bg-muted-foreground" />
            <Skeleton className="w-5 h-5 rounded-md bg-muted-foreground" />
            <Skeleton className="w-5 h-5 rounded-md bg-muted-foreground" />
            <Skeleton className="w-5 h-5 rounded-md bg-muted-foreground" />
          </div>
          <div className="hidden space-x-2 xl:flex">
            <Skeleton className="w-5 h-5 rounded-md bg-muted-foreground" />
            <Skeleton className="w-5 h-5 rounded-md bg-muted-foreground" />
          </div>
        </div>
        <Skeleton className="w-5 h-5 rounded-md bg-muted-foreground" />
      </div>
    </Skeleton>
    <Skeleton className="w-full rounded-t-none rounded-b h-10 bg-card" />
  </div>
);

export default LoadingEditor;
