// // src/pages/Attendance/CreateAttendance.tsx
// import { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Loader2, ArrowLeft } from 'lucide-react';
// import toast from 'react-hot-toast';
// import AttendanceFormModal from '../_components/AttendanceFormModal';

// export default function CreateAttendance() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(!!id);
//   const [saving, setSaving] = useState(false);
//   const [initialData, setInitialData] = useState<any>(null);
//   const [showFormModal, setShowFormModal] = useState(true);
//   const isEditing = !!id;

//   // Fetch attendance data if editing
//   useEffect(() => {
//     if (!id) {
//       setLoading(false);
//       return;
//     }

//     const fetchAttendance = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${import.meta.env.VITE_API_URL}/attendance/${id}`, {
//           credentials: 'include',
//         });
        
//         const result = await response.json();
        
//         if (!result.success) throw new Error(result.message || 'Failed to load attendance routine');
        
//         setInitialData(result.data);
//         setShowFormModal(true);
//       } catch (error: any) {
//         console.error('Error loading attendance:', error);
//         toast.error(error.message);
//         navigate('/attendance');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAttendance();
//   }, [id, navigate]);

//   const handleSubmit = async (formData: any) => {
//     try {
//       setSaving(true);
      
//       const url = isEditing 
//         ? `${import.meta.env.VITE_API_URL}/attendance/${id}`
//         : `${import.meta.env.VITE_API_URL}/attendance`;
      
//       const method = isEditing ? 'PUT' : 'POST';
      
//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();

//       if (!result.success) {
//         throw new Error(result.message || 'Failed to save');
//       }

//       toast.success(isEditing ? 'Attendance routine updated' : 'Attendance routine created');
//       navigate('/attendance');
//     } catch (error: any) {
//       toast.error(error.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCloseModal = () => {
//     navigate('/attendance');
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto py-6">
//         <div className="flex items-center justify-center h-64">
//           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//           <span className="ml-2">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-6">
//       <div className="flex items-center gap-4 mb-6">
//         <Button variant="outline" size="sm" onClick={() => navigate('/attendance')}>
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back to Attendance
//         </Button>
//         <h1 className="text-2xl font-bold">
//           {isEditing ? 'Edit Attendance Routine' : 'Create Attendance Routine'}
//         </h1>
//       </div>

//       <AttendanceFormModal
//         isOpen={showFormModal}
//         onClose={handleCloseModal}
//         onSubmit={handleSubmit}
//         isSubmitting={saving}
//         initialValues={initialData}
//       />
//     </div>
//   );
// }