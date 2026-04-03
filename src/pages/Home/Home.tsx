import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Users,
  GraduationCap,
  PlayCircle,
  Calendar,
  Ticket,
  UserPlus,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface SiteData {
  totalsTeachers: number;
  totalCourses: number;
  totalBatches: number;
  successRate: number;
  name: string;
}

interface Admission {
  _id: string;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
  batchId: string | { $oid: string };
}

interface CourseBatch {
  _id: string;
  name: string;
  code: string;
  description: string;
  registrationStart: string;
  registrationEnd: string;
  isActive: boolean;
}

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<SiteData | null>(null);
  const [recentAdmissions, setRecentAdmissions] = useState<Admission[]>([]);
  const [courseBatches, setCourseBatches] = useState<CourseBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<CourseBatch | null>(null);
  const [totalAdmittedStudents, setTotalAdmittedStudents] = useState(0);
  const [loading, setLoading] = useState(true);

  console.log(courseBatches)

  // Helper function to extract batchId as string
  const getBatchIdString = (batchId: any): string => {
    if (!batchId) return '';
    if (typeof batchId === 'string') return batchId;
    if (batchId && typeof batchId === 'object' && batchId.$oid) return batchId.$oid;
    if (batchId && typeof batchId === 'object' && batchId._id) return batchId._id;
    return String(batchId);
  };

  // Quick actions configuration
  const quickActions = [
    { path: "/seminar/new", icon: PlayCircle, label: "Add Seminar", color: "text-purple-600", hoverBg: "hover:bg-purple-50" },
    { path: "/course-batches/new", icon: GraduationCap, label: "Add Course Batch", color: "text-blue-600", hoverBg: "hover:bg-blue-50" },
    { path: "/courses/new", icon: BookOpen, label: "Add Course", color: "text-green-600", hoverBg: "hover:bg-green-50" },
    { path: "/coupons/new", icon: Ticket, label: "Add Coupon", color: "text-orange-600", hoverBg: "hover:bg-orange-50" },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load site data
        const siteRes = await fetch(`${import.meta.env.VITE_API_URL}/site`);
        const siteJson = await siteRes.json();
        setData(siteJson?.data);

        // Load all course batches
        const batchesRes = await fetch(`${import.meta.env.VITE_API_URL}/course-batches?sort=-createdAt`);
        const batchesJson = await batchesRes.json();
        const batches = batchesJson?.data || [];
        setCourseBatches(batches);

        // Load ALL admissions without limit
        const admissionsRes = await fetch(`${import.meta.env.VITE_API_URL}/admissions?limit=1000`);
        const admissionsJson = await admissionsRes.json();
        const allAdmissions = admissionsJson?.data || [];
        
        // Set recent admissions (last 5)
        setRecentAdmissions(allAdmissions.slice(0, 5));

        // Select default batch (active or first)
        const activeBatch = batches.find((batch: CourseBatch) => batch.isActive === true);
        const defaultBatch = activeBatch || batches[0];
        
        if (defaultBatch) {
          setSelectedBatch(defaultBatch);
          
          // Count admissions for this batch
          const batchAdmissions = allAdmissions.filter((ad: Admission) => {
            const admissionBatchId = getBatchIdString(ad.batchId);
            return admissionBatchId === defaultBatch._id;
          });
          
          setTotalAdmittedStudents(batchAdmissions.length);
        }
        
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  

  const handleViewAllAdmissions = () => {
    if (selectedBatch) {
      navigate(`/course-batches/details/${selectedBatch._id}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Welcome Section Skeleton */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-96" />
          <Skeleton className="h-5 w-80" />
        </div>

        {/* Stats Section Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Left Column Skeleton */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-32 w-full" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              ))}
              <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
          </Card>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-lg" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center mt-10 text-gray-500">No data available</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back to {data.name}!</h1>
        <p className="text-muted-foreground">Here's what's happening with your learning platform today.</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users className="h-6 w-6" />} title="Total Teachers" value={data.totalsTeachers || 0} color="text-blue-600" bgColor="bg-blue-50" />
        <StatCard icon={<BookOpen className="h-6 w-6" />} title="Total Courses" value={data.totalCourses || 0} color="text-green-600" bgColor="bg-green-50" />
        <StatCard icon={<GraduationCap className="h-6 w-6" />} title="Total Batches" value={data.totalBatches || 0} color="text-purple-600" bgColor="bg-purple-50" />
        <StatCard icon={<Trophy className="h-6 w-6" />} title="Success Rate" value={`${data.successRate || 0}%`} color="text-orange-600" bgColor="bg-orange-50" />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Recent Admissions - Left Column */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle>Recent Admissions</CardTitle>
                <CardDescription>Latest students who registered for courses</CardDescription>
              </div>
              {selectedBatch && (
                <Badge className="bg-purple-100 text-purple-700">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Batch: {selectedBatch.code}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>          
            {/* Selected Batch Summary */}
            {selectedBatch && (
              <div className="mb-6 p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700">{selectedBatch.name}</h4>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Start: {new Date(selectedBatch.registrationStart).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          End: {new Date(selectedBatch.registrationEnd).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {selectedBatch.description && (
                      <p className="text-xs text-muted-foreground mt-2">{selectedBatch.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-700">{totalAdmittedStudents}</p>
                    <p className="text-xs text-muted-foreground">Total Admitted</p>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Admissions List */}
            <div className="space-y-4">
              {recentAdmissions.length > 0 ? (
                recentAdmissions.map((admission) => (
                  <div key={admission._id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="rounded-lg bg-green-100 p-2 shrink-0">
                      <UserPlus className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none truncate">{admission.name}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <span className="text-xs text-muted-foreground truncate">{admission.email}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{admission.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Registered: {new Date(admission.registeredAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">No recent admissions found</div>
              )}
            </div>
            
            <Button className="mt-4 w-full" variant="outline" onClick={handleViewAllAdmissions} disabled={!selectedBatch}>
              <Users className="mr-2 h-4 w-4" />
              View All Admissions
            </Button>
          </CardContent>
        </Card>

        {/* Right Sidebar - Quick Actions */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link key={action.path} to={action.path}>
                    <Button variant="outline" className={`h-auto flex-col gap-2 p-4 w-full ${action.hoverBg} transition-colors`}>
                      <action.icon className={`h-5 w-5 ${action.color}`} />
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;

function StatCard({ icon, title, value, color, bgColor }: { icon: React.ReactNode; title: string; value: string | number; color: string; bgColor: string }) {
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