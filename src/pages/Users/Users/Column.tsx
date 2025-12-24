// // src/pages/User/Columns.tsx
// import type { ColumnDef } from '@tanstack/react-table';
// import { Button } from '@/components/ui/button';
// import { Edit, Trash2, Eye } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { Badge } from '@/components/ui/badge';
// import { Switch } from '@/components/ui/switch';
// import DeleteDialog from '@/components/common/DeleteDialog';
// import { useState } from 'react';
// import PasswordResetModal from '../_components/PasswordResetModal';

// export const userColumns = (
//   onDelete: (id: string) => Promise<void>,
//   refreshUsers: () => void
// ): ColumnDef<any>[] => [
//   {
//     accessorKey: 'sl',
//     header: 'SL',
//     cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
//   },
//   {
//     accessorKey: 'name',
//     header: 'Name',
//     cell: ({ row }) => (
//       <div className="flex items-center gap-2">
//         {row.original.image ? (
//           <img 
//             src={row.original.image} 
//             alt={row.original.name}
//             className="h-8 w-8 rounded-full object-cover"
//           />
//         ) : (
//           <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
//             <span className="font-medium text-primary">
//               {row.original.firstName?.charAt(0).toUpperCase()}
//             </span>
//           </div>
//         )}
//         <div>
//           <span className="font-medium block">{row.original.firstName} {row.original.lastName}</span>
//           <span className="text-xs text-muted-foreground">
//             {row.original.email || row.original.phone}
//           </span>
//         </div>
//       </div>
//     ),
//   },
//   {
//     accessorKey: 'email',
//     header: 'Email',
//     cell: ({ row }) => (
//       <div className="text-sm text-muted-foreground">{row.original.email || '-'}</div>
//     ),
//   },
//   {
//     accessorKey: 'phone',
//     header: 'Phone',
//     cell: ({ row }) => (
//       <div className="text-sm">{row.original.phone || '-'}</div>
//     ),
//   },
//   {
//     accessorKey: 'role',
//     header: 'Role',
//     cell: ({ row }) => {
//       const role = row.original.role;
      
//       const roleVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
//         admin: 'destructive',
//         teacher: 'default',
//         student: 'secondary',
//       };
      
//       const variant = roleVariants[role] || 'secondary';
      
//       return (
//         <Badge variant={variant} className="capitalize">
//           {role}
//         </Badge>
//       );
//     },
//   },
//   {
//     accessorKey: 'status',
//     header: 'Status',
//     cell: ({ row }) => {
//       const user = row.original;
//       const userId = user._id || user.id;
      
//       const handleToggleStatus = async (checked: boolean) => {
//         try {
//           const status = checked ? 'active' : 'inactive';
//           const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/status`, {
//             method: 'PUT',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             credentials: 'include',
//             body: JSON.stringify({ status }),
//           });

//           const result = await response.json();

//           if (!result.success) {
//             throw new Error(result.message || 'Failed to update user status');
//           }

//           toast.success(`User ${checked ? 'activated' : 'deactivated'}`);
//           refreshUsers();
//         } catch (error: any) {
//           toast.error(error.message);
//         }
//       };
      
//       return (
//         <div className="flex items-center gap-2">
//           <Switch
//             checked={user.status === 'active'}
//             onCheckedChange={handleToggleStatus}
//             disabled={user.status === 'banned'}
//           />
//           <Badge variant={
//             user.status === 'active' ? 'default' : 
//             user.status === 'inactive' ? 'secondary' : 'destructive'
//           } className="capitalize">
//             {user.status}
//           </Badge>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: 'createdAt',
//     header: 'Created At',
//     cell: ({ row }) => {
//       const date = row.original.createdAt;
//       return date ? new Date(date).toLocaleDateString() : 'N/A';
//     },
//   },
//   {
//     id: 'password',
//     header: 'Password',
//     cell: ({ row }) => {
//       const user = row.original;
//       const [showResetModal, setShowResetModal] = useState(false);
      
//       return (
//         <>
//           <div className="flex items-center gap-2">
//             <span className="text-sm text-muted-foreground">••••••••</span>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setShowResetModal(true)}
//             >
//               Reset
//             </Button>
//           </div>
          
//           <PasswordResetModal
//             userId={user._id || user.id}
//             userName={`${user.firstName} ${user.lastName}`}
//             isOpen={showResetModal}
//             onClose={() => setShowResetModal(false)}
//             onSuccess={refreshUsers}
//           />
//         </>
//       );
//     },
//   },
//   {
//     id: 'actions',
//     header: 'Actions',
//     cell: ({ row }) => {
//       const user = row.original;
//       const userId = user._id || user.id;
      
//       if (!userId) return null;
      
//       return (
//         <div className="flex items-center gap-2">
//           <Button size="sm" variant="ghost" asChild title="Edit">
//             <Link to={`/users/edit/${userId}`}>
//               <Edit className="h-4 w-4" />
//             </Link>
//           </Button>
          
//           <DeleteDialog
//             onConfirm={() => onDelete(userId)}
//             title="Delete User?"
//             description={`Are you sure you want to delete user "${user.firstName} ${user.lastName}"? This action cannot be undone.`}
//           >
//             <Button
//               size="sm"
//               variant="ghost"
//               className="text-red-600 hover:text-red-700 hover:bg-red-50"
//               title="Delete"
//             >
//               <Trash2 className="h-4 w-4" />
//             </Button>
//           </DeleteDialog>
//         </div>
//       );
//     },
//   },
// ];