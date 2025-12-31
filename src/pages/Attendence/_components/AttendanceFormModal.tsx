// src/components/Attendance/AttendanceFormModal.tsx
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface AttendanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  initialValues?: any;
}

export default function AttendanceFormModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  initialValues,
}: AttendanceFormModalProps) {
  const [batchId, setBatchId] = useState(initialValues?.batchId || '');
  const [batchCode, setBatchCode] = useState(initialValues?.batchCode || '');
  const [mainClasses, setMainClasses] = useState(initialValues?.mainClasses?.toString() || '0');
  const [specialClasses, setSpecialClasses] = useState(initialValues?.specialClasses?.toString() || '0');
  const [guestClasses, setGuestClasses] = useState(initialValues?.guestClasses?.toString() || '0');

  const isEditing = !!initialValues;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!batchId.trim()) {
      toast.error('Batch ID is required');
      return;
    }

    if (!batchCode.trim()) {
      toast.error('Batch code is required');
      return;
    }

    const mainClassesNum = parseInt(mainClasses) || 0;
    const specialClassesNum = parseInt(specialClasses) || 0;
    const guestClassesNum = parseInt(guestClasses) || 0;

    if (mainClassesNum < 0 || specialClassesNum < 0 || guestClassesNum < 0) {
      toast.error('Class counts cannot be negative');
      return;
    }

    if (mainClassesNum + specialClassesNum + guestClassesNum === 0) {
      toast.error('At least one class is required');
      return;
    }

    const data = {
      batchId,
      batchCode,
      mainClasses: mainClassesNum,
      specialClasses: specialClassesNum,
      guestClasses: guestClassesNum,
    };

    await onSubmit(data);
    handleClose();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setBatchId('');
      setBatchCode('');
      setMainClasses('0');
      setSpecialClasses('0');
      setGuestClasses('0');
      onClose();
    }
  };

  const totalClasses = (parseInt(mainClasses) || 0) + (parseInt(specialClasses) || 0) + (parseInt(guestClasses) || 0);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Attendance Routine' : 'Create Attendance Routine'}
          </DialogTitle>
          <DialogDescription>
            Enter the batch details and number of classes for each type.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batchId">Batch ID *</Label>
            <Input
              id="batchId"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              placeholder="Enter batch ID"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="batchCode">Batch Code *</Label>
            <Input
              id="batchCode"
              value={batchCode}
              onChange={(e) => setBatchCode(e.target.value)}
              placeholder="Enter batch code"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mainClasses">Main Classes</Label>
              <Input
                id="mainClasses"
                type="number"
                min="0"
                value={mainClasses}
                onChange={(e) => setMainClasses(e.target.value)}
                placeholder="0"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialClasses">Special Classes</Label>
              <Input
                id="specialClasses"
                type="number"
                min="0"
                value={specialClasses}
                onChange={(e) => setSpecialClasses(e.target.value)}
                placeholder="0"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestClasses">Guest Classes</Label>
              <Input
                id="guestClasses"
                type="number"
                min="0"
                value={guestClasses}
                onChange={(e) => setGuestClasses(e.target.value)}
                placeholder="0"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <div className="text-sm font-medium">Total Classes: {totalClasses}</div>
            <div className="text-xs text-muted-foreground">
              Main: {parseInt(mainClasses) || 0} | 
              Special: {parseInt(specialClasses) || 0} | 
              Guest: {parseInt(guestClasses) || 0}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || totalClasses === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? 'Update Routine' : 'Create Routine'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}