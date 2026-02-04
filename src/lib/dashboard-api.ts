/* eslint-disable @typescript-eslint/no-explicit-any */

const DASHBOARD_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";


// Get all courses (not just active ones)
export async function getDashboardCourses() {
  try {
    const response = await fetch(`${DASHBOARD_API_URL}/courses`, {
      credentials: "include",
    });

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return result.data.map((course: any) => ({
        id: course._id,
        name: course.name,
        price: course.price,
        discount: course.discount || 0,
        paymentCharge: course.paymentCharge || 0,
        description: course.description || "",
        isActive: course.isActive || true,
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching dashboard courses:", error);
    return [];
  }
}

// Get all batches (including inactive ones)
export async function getDashboardBatches() {
  try {
    const response = await fetch(`${DASHBOARD_API_URL}/course-batches`, {
      credentials: "include",
    });

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return result.data.map((batch: any) => ({
        id: batch._id,
        name: batch.name,
        description: batch.description || "",
        registrationEnd: batch.registrationEnd,
        isActive: batch.isActive,
        code: batch.code,
        registrationStart: batch.registrationStart,
        facebookSecretGroup: batch.facebookSecretGroup,
        messengerSecretGroup: batch.messengerSecretGroup,
        whatsappSecretGroup: batch.whatsappSecretGroup,
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching dashboard batches:", error);
    return [];
  }
}

// Get all admissions (for students list)
export async function getDashboardAdmissions() {
  try {
    const response = await fetch(`${DASHBOARD_API_URL}/admissions`, {
      credentials: "include",
    });

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return result.data.map((admission: any) => ({
        _id: admission._id,
        name: admission.name,
        email: admission.email,
        phone: admission.phone,
        whatsapp: admission.whatsapp,
        facebook: admission.facebook,
        occupation: admission.occupation,
        address: admission.address,
        courseId: admission.courseId,
        batchId: admission.batchId,
        paymentMethod: admission.paymentMethod,
        senderNumber: admission.senderNumber,
        couponCode: admission.couponCode,
        amount: admission.amount,
        discountAmount: admission.discountAmount || 0,
        status: admission.status,
        paymentStatus: admission.paymentStatus,
        result: admission.result,
        notes: admission.notes,
        registeredAt: admission.registeredAt,
        createdAt: admission.createdAt,
        updatedAt: admission.updatedAt,
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching dashboard admissions:", error);
    return [];
  }
}

// Create admission (admin direct creation)
export async function createDashboardAdmission(data: any) {
  try {
    const response = await fetch(`${DASHBOARD_API_URL}/admissions/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to create admission");
    }

    return result;
  } catch (error) {
    console.error("Error creating admission:", error);
    throw error;
  }
}

// Update admission
export async function updateDashboardAdmission(id: string, data: any) {
  try {
    const response = await fetch(`${DASHBOARD_API_URL}/admissions/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to update admission");
    }

    return result;
  } catch (error) {
    console.error("Error updating admission:", error);
    throw error;
  }
}

// Delete admission
export async function deleteDashboardAdmission(id: string) {
  try {
    const response = await fetch(`${DASHBOARD_API_URL}/admissions/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to delete admission");
    }

    return result;
  } catch (error) {
    console.error("Error deleting admission:", error);
    throw error;
  }
}

// Get admissions by batch ID
export async function getAdmissionsByBatchId(batchId: string) {
  try {
    const response = await fetch(
      `${DASHBOARD_API_URL}/admissions/batch/${batchId}`,
      {
        credentials: "include",
      }
    );

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return result.data.map((admission: any) => ({
        _id: admission._id,
        name: admission.name,
        email: admission.email,
        phone: admission.phone,
        whatsapp: admission.whatsapp,
        facebook: admission.facebook,
        occupation: admission.occupation,
        address: admission.address,
        courseId: admission.courseId?._id || admission.courseId,
        batchId: admission.batchId?._id || admission.batchId,
        paymentMethod: admission.paymentMethod,
        senderNumber: admission.senderNumber,
        couponCode: admission.couponCode,
        amount: admission.amount,
        discountAmount: admission.discountAmount || 0,
        status: admission.status,
        paymentStatus: admission.paymentStatus,
        result: admission.result,
        notes: admission.notes,
        registeredAt: admission.registeredAt,
        courseName: admission.courseId?.name || "N/A",
        batchName: admission.batchId?.name || "N/A",
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching admissions by batch:", error);
    return [];
  }
}

// Get batch by ID
export async function getBatchById(id: string) {
  try {
    const response = await fetch(`${DASHBOARD_API_URL}/course-batches/${id}`, {
      credentials: "include",
    });

    const result = await response.json();

    if (result.success && result.data) {
      return {
        _id: result.data._id,
        id: result.data._id,
        name: result.data.name,
        description: result.data.description || "",
        registrationEnd: result.data.registrationEnd,
        isActive: result.data.isActive,
        code: result.data.code,
        registrationStart: result.data.registrationStart,
        facebookSecretGroup: result.data.facebookSecretGroup,
        messengerSecretGroup: result.data.messengerSecretGroup,
        whatsappSecretGroup: result.data.whatsappSecretGroup,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching batch:", error);
    return null;
  }
}

// Create admission directly (bypass queue for admin)
export async function createAdmissionDirect(data: any) {
  try {
    const response = await fetch(`${DASHBOARD_API_URL}/admissions/admin/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || "Failed to create admission");
    }

    return result;
  } catch (error) {
    console.error("Error creating admission:", error);
    throw error;
  }
}

export const dashboardApi = {
  getCourses: getDashboardCourses,
  getBatches: getDashboardBatches,
  getAdmissions: getDashboardAdmissions,
  createAdmission: createDashboardAdmission,
  updateAdmission: updateDashboardAdmission,
  deleteAdmission: deleteDashboardAdmission,
  getAdmissionsByBatchId,
  getBatchById,
  createAdmissionDirect,
};