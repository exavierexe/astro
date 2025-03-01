import { NavBar } from "@/components/ui/navbar";

export default function BirthChartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
}