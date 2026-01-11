import { Card, CardContent } from "@/components/ui/card";
import { PanelTop, Tag, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import TableTopBar from "../Tables/TableTopBar";

export default function Banner() {
  const [data, setData] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  console.log(statusFilter);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/site`);
        const json = await res.json();
        setData(json?.data);
      } catch (error) {
        console.error("Failed to load site data:", error);
      }
    };

    loadData();
  }, []);

  if (!data) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="py-10 space-y-8">
      {/* Page header */}
      <TableTopBar
        title="Banner"
        href="/banner/update"
        linkTitle="Update Banner"
        data={data}
        model="site"
        onStatusFilter={setStatusFilter}
      />

      {/* Seminar Banner Card */}
      <Card className="shadow-md border border-muted">
        <CardContent className="space-y-6">
          <SectionHeader
            icon={<PanelTop className="text-blue-600" />}
            title="Seminar Banner"
            subtitle="Home page banner information"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem
              icon={<Clock className="w-5 h-5" />}
              label="Description"
              value={data.homeBannerInfo?.description || "N/A"}
            />
          </div>
        </CardContent>
      </Card>

      {/* Admission Banner Card */}
      <Card className="shadow-md border border-muted">
        <CardContent className="space-y-6 ">
          <SectionHeader
            icon={<Tag className="text-green-600" />}
            title="Admission Banner"
            subtitle="Admission page banner information"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem
              icon={<Clock className="w-5 h-5" />}
              label="Description"
              value={data.admissionBannerInfo?.description || "N/A"}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Reusable Section Header
function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable Info Item Component
function InfoItem({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div
        className={`p-3 rounded-lg ${
          highlight
            ? "bg-primary/10 border border-primary/20 font-semibold"
            : "bg-muted/20"
        }`}
      >
        <p className={highlight ? "text-primary" : ""}>{value}</p>
      </div>
    </div>
  );
}
