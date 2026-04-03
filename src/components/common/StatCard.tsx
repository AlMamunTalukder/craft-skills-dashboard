import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
  bgColor: string;
}

export function StatCard({ icon, title, value, color, bgColor }: StatCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${bgColor}`}>
            <div className={color}>{icon}</div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}