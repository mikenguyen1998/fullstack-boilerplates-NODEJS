export default function DashboardLoading() {
  return (
    <div className="flex animate-pulse flex-col gap-6">
      <div className="h-9 w-48 rounded bg-muted" />
      <div className="h-64 rounded-xl bg-muted" />
    </div>
  );
}
