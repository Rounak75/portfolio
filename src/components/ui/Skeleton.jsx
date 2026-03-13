import clsx from 'clsx'

export function Skeleton({ className, isDark, style }) {
  return (
    <div className={clsx('rounded-lg animate-pulse',
      isDark ? 'bg-white/[0.06]' : 'bg-black/[0.07]', className)} style={style} />
  )
}

export function SkeletonText({ lines = 3, isDark, className }) {
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} isDark={isDark} className="h-3"
          style={{ width: i === lines - 1 ? '65%' : '100%' }} />
      ))}
    </div>
  )
}

export function SkeletonAvatar({ size = 48, isDark }) {
  return <Skeleton isDark={isDark} style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0 }} />
}

export function SkeletonStat({ isDark }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Skeleton isDark={isDark} className="h-8 w-16 rounded-lg" />
      <Skeleton isDark={isDark} className="h-3 w-12 rounded" />
    </div>
  )
}

export function SkeletonCard({ isDark }) {
  return (
    <div className={clsx('rounded-2xl border overflow-hidden',
      isDark ? 'bg-white/[0.03] border-white/[0.07]' : 'bg-white border-black/[0.07] shadow-sm'
    )}>
      <Skeleton isDark={isDark} className="h-44 w-full rounded-none" />
      <div className="p-6 space-y-4">
        <Skeleton isDark={isDark} className="h-3 w-24" />
        <Skeleton isDark={isDark} className="h-5 w-3/4" />
        <SkeletonText lines={2} isDark={isDark} />
        <div className="flex gap-2 pt-1">
          {[60, 50, 70].map((w, i) => (
            <Skeleton key={i} isDark={isDark} className="h-5 rounded-md" style={{ width: w }} />
          ))}
        </div>
        <div className="flex gap-2 pt-1">
          <Skeleton isDark={isDark} className="h-10 flex-1 rounded-xl" />
          <Skeleton isDark={isDark} className="h-10 flex-1 rounded-xl" />
          <Skeleton isDark={isDark} className="h-10 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonTimeline({ isDark }) {
  return (
    <div className="flex gap-5">
      <SkeletonAvatar size={30} isDark={isDark} />
      <div className="flex-1 space-y-2 pt-1">
        <Skeleton isDark={isDark} className="h-3 w-28" />
        <Skeleton isDark={isDark} className="h-4 w-48" />
        <Skeleton isDark={isDark} className="h-3 w-36" />
      </div>
    </div>
  )
}