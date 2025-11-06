"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Users,
  GraduationCap,
  TrendingUp,
  Clock,
  Award,
  Calendar,
  BarChart3,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";



import {
    Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";

const Home = () => {

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
  

  const recentCourses = [
    {
      id: 1,
      title: "Web Development Bootcamp",
      progress: 85,
      students: 234,
      duration: "8 weeks",
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      progress: 45,
      students: 189,
      duration: "10 weeks",
    },
    {
      id: 3,
      title: "UI/UX Design Masterclass",
      progress: 30,
      students: 156,
      duration: "6 weeks",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Live Q&A Session",
      date: "2024-01-15",
      time: "14:00",
      type: "workshop",
    },
    {
      id: 2,
      title: "New Course Launch",
      date: "2024-01-20",
      time: "10:00",
      type: "launch",
    },
    {
      id: 3,
      title: "Student Meetup",
      date: "2024-01-25",
      time: "16:00",
      type: "meetup",
    },
  ];

  

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your learning platform today.
        </p>
      </div>

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

    

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Courses - Left Column */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Courses</CardTitle>
            <CardDescription>
              Your most popular courses with student progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between space-x-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {course.title}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{course.students} students</span>
                        <Clock className="h-3 w-3" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Progress value={course.progress} className="w-24" />
                    <span className="text-sm text-muted-foreground">
                      {course.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-4 w-full" variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              View All Courses
            </Button>
          </CardContent>
        </Card>

        {/* Right Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Workshops and important dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center space-x-4">
                    <div className="rounded-lg bg-secondary p-2">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{event.time}</span>
                      </div>
                    </div>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                ))}
              </div>
              <Button className="mt-4 w-full" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                  <BookOpen className="h-5 w-5" />
                  <span className="text-xs">Add Course</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                  <Users className="h-5 w-5" />
                  <span className="text-xs">Manage Students</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                  <GraduationCap className="h-5 w-5" />
                  <span className="text-xs">Add Teacher</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xs">View Reports</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Platform Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>Overall system health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Server Status</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700"
                  >
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <PlayCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Video Streaming</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Stable
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Certificate System</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-orange-50 text-orange-700"
                  >
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};



export default Home;


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
