// Title + optional subtitle at the top of every route.
export function PageHeader({ title, description }) {
  return (
    <div className="px-1">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
