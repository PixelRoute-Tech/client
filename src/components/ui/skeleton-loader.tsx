import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface SkeletonConfig {
  type: 'dashboard' | 'table' | 'form' | 'page';
  customLayout?: () => JSX.Element;
}

interface SkeletonLoaderProps {
  config: SkeletonConfig;
  className?: string;
}

export function SkeletonLoader({ config, className }: SkeletonLoaderProps) {
  if (config.customLayout) {
    return <div className={cn("space-y-4", className)}>{config.customLayout()}</div>;
  }

  switch (config.type) {
    case 'dashboard':
      return (
        <div className={cn("container mx-auto px-6 py-8 space-y-8", className)}>
          {/* Header */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg border p-6 space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg border p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="bg-card rounded-lg border p-6 space-y-4">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      );

    case 'table':
      return (
        <div className={cn("container mx-auto px-6 py-8 space-y-8", className)}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="flex gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          
          {/* Table */}
          <div className="bg-card rounded-lg border">
            <div className="p-4 border-b">
              <div className="flex gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-20" />
                ))}
              </div>
            </div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-4 border-b last:border-b-0">
                <div className="flex gap-4 items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                  <div className="flex gap-2 ml-auto">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'form':
      return (
        <div className={cn("container mx-auto px-6 py-8 space-y-8", className)}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-4 w-80" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Form */}
            <div className="lg:w-1/2 space-y-6">
              <div className="bg-card rounded-lg border p-6 space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
                <div className="flex gap-4 pt-4">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="lg:w-1/2">
              <div className="bg-card rounded-lg border p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-8 w-12" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'page':
    default:
      return (
        <div className={cn("container mx-auto px-6 py-8 space-y-8", className)}>
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-3/4" />
          </div>
        </div>
      );
  }
}

// Skeleton configurations for different pages
export const skeletonConfigs = {
  dashboard: { type: 'dashboard' as const },
  table: { type: 'table' as const },
  form: { type: 'form' as const },
  page: { type: 'page' as const },
  
  // Custom configurations
  themeSettings: {
    type: 'page' as const,
    customLayout: () => (
      <>
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg border p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-lg border p-6">
            <Skeleton className="h-6 w-28 mb-4" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </>
    )
  },
  
  login: {
    type: 'page' as const,
    customLayout: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md space-y-6 p-8">
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }
};