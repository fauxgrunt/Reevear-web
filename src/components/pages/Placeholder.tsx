export function Placeholder({ children }: { children: string }) {
  return <mark className="page-placeholder">{children}</mark>;
}
