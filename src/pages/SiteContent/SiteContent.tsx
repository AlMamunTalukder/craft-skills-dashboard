 

import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Youtube,
  Link2,
  Image as ImageIcon,
  Group,
  MessageCircle,
  Send,
  Users,
  GraduationCap,
  BookOpen,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import TableTopBar from "../Tables/TableTopBar";


export default function SiteContent() {
  const [data, setData] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredData = statusFilter
    ? data.filter((item: any) => String(item.status) === statusFilter)
    : data;

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
      {/* the rest stays the SAME */}

      {/* Page header */}

      <TableTopBar
        title="Site Content"
        href="/sitecontent/update"
        linkTitle="Update Site Content"
        data={data}
        model="site" 
        onStatusFilter={setStatusFilter}
      />

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users className="h-6 w-6" />}
          title="Total Teachers"
          value={data.totalsTeachers || 0}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<BookOpen className="h-6 w-6" />}
          title="Total Courses"
          value={data.totalCourses || 0}
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<GraduationCap className="h-6 w-6" />}
          title="Total Batches"
          value={data.totalBatches || 0}
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
        <StatCard
          icon={<Trophy className="h-6 w-6" />}
          title="Success Rate"
          value={`${data.successRate || 0}%`}
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
      </div>

      {/* Main Card */}
      <Card className="shadow-md border border-muted">
        <CardContent className="space-y-10 p-8">
          {/* Tagline */}
          <SectionHeader icon={<MessageCircle />} title="Tagline" />
          <p className="text-xl font-semibold bg-muted/20 p-4 rounded-lg">
            {data.tagline}
          </p>

          {/* Contact Info */}
          <SectionHeader icon={<Phone />} title="Contact Information" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ContactItem icon={<Mail />} label="Email" value={data.email} />
            <ContactItem icon={<Phone />} label="Phone 1" value={data.phone1} />
            <ContactItem
              icon={<Phone />}
              label="Phone 2"
              value={data.phone2 || ""}
            />
            {/* <ContactItem
              icon={<MapPin />}
              label="Address"
              value={data.address}
            /> */}
          </div>

          {/* Social Links */}
          <SectionHeader icon={<Link2 />} title="Social Media Links" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SocialItem
              icon={<Facebook className="text-blue-600" />}
              label="Facebook Page"
              link={data.facebook}
            />
            <SocialItem
              icon={<Group className="text-blue-700" />}
              label="Facebook Group"
              link={data.facebookGroup}
            />
            <SocialItem
              icon={<MessageCircle className="text-green-600" />}
              label="WhatsApp Group"
              link={data.whatsapp}
            />
            <SocialItem
              icon={<Send className="text-blue-400" />}
              label="Telegram Channel"
              link={data.telegram}
            />
            <SocialItem
              icon={<Youtube className="text-red-600" />}
              label="YouTube Channel"
              link={data.youtube}
            />
          </div>

          {/* Logos */}
          {/* <SectionHeader icon={<ImageIcon />} title="Brand Logos" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <LogoItem label="Header Logo" src={data.logoLight} />
            <LogoItem label="Footer Logo" src={data.logoDark} />
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}

// Stats Card Component
function StatCard({
  icon,
  title,
  value,
  color,
  bgColor,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
  bgColor: string;
}) {
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

// Reusable Section Header
function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b pb-2 mb-4">
      <div className="text-muted-foreground">{icon}</div>
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
}

// Reusable Contact Item
function ContactItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 items-start bg-muted/20 p-4 rounded-lg">
      <div className="text-muted-foreground mt-1">{icon}</div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base">{value}</p>
      </div>
    </div>
  );
}

// Reusable Social Link Item
function SocialItem({
  icon,
  label,
  link,
}: {
  icon: React.ReactNode;
  label: string;
  link: string;
}) {
  return (
    <div className="flex gap-3 items-start bg-muted/20 p-4 rounded-lg">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <a
          href={link}
          className="text-blue-600 hover:underline break-all"
          target="_blank"
          rel="noopener noreferrer"
        >
          {link}
        </a>
      </div>
    </div>
  );
}

// Reusable Logo Viewer
// function LogoItem({ label, src }: { label: string; src: string }) {
//   return (
//     <div>
//       <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
//       <div className="border rounded bg-muted/20 p-3 flex items-center justify-center hover:bg-muted/30 transition-colors">
//         <img
//           width={200}
//           height={200}
//           src={src}
//           alt={label}
//           className="h-20 object-contain"
//         />
//       </div>
//     </div>
//   );
// }
