import "./source.css";

export default function GuardianLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="guardian-identity">{children}</div>;
}
