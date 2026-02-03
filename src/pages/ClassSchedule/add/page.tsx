import { Card, CardContent } from '@/components/ui/card';
import FormHeader from '@/components/Forms/FormHeader';
import ClassScheduleForm from '@/components/Forms/ClassScheduleForm';

export default function AddSchedule() {
  return (
    <div className="container mx-auto py-6">
      <FormHeader
        href="/schedules"
        parent="Schedules"
        title="Add New Schedule"
        editingId={""}
      />
      <Card>
        <CardContent className="pt-6">
          <ClassScheduleForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}