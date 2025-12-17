// src/types/seminar.types.ts
export interface Seminar {
  _id?: string;
  id?: string;
  sl?: string;
  title: string;
  description?: string;
  date: string;
  registrationDeadline: string;
  isActive?: boolean;
  link?: string;
  facebookSecretGroup?: string;
  whatsappSecretGroup?: string;
  messengerSecretGroup?: string;
  facebookPublicGroup?: string;
  whatsappPublicGroup?: string;
  telegramGroup?: string;
  createdAt?: string;
  updatedAt?: string;
  participants?: any[];
}

export type CreateSeminarDto = Omit<Seminar, '_id' | 'id' | 'createdAt' | 'updatedAt'>;

// Type conversion methods
export const seminarToFormData = (seminar: Seminar | null): any => {
  if (!seminar) return undefined;
  
  // Format dates for datetime-local input (YYYY-MM-DDTHH:mm)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    // Convert to local timezone for input
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    
    return localDate.toISOString().slice(0, 16);
  };

  return {
    sl: seminar.sl || "",
    title: seminar.title || "",
    description: seminar.description || "",
    date: formatDateForInput(seminar.date),
    registrationDeadline: formatDateForInput(seminar.registrationDeadline),
    link: seminar.link || "",
    facebookSecretGroup: seminar.facebookSecretGroup || "",
    whatsappSecretGroup: seminar.whatsappSecretGroup || "",
    messengerSecretGroup: seminar.messengerSecretGroup || "",
    facebookPublicGroup: seminar.facebookPublicGroup || "",
    whatsappPublicGroup: seminar.whatsappPublicGroup || "",
    telegramGroup: seminar.telegramGroup || "",
  };
};

export const formDataToCreateDto = (formData: any): CreateSeminarDto => {
  return {
    sl: formData.sl || undefined,
    title: formData.title,
    description: formData.description || undefined,
    date: formData.date,
    registrationDeadline: formData.registrationDeadline,
    isActive: formData.isActive || true,
    link: formData.link || undefined,
    facebookSecretGroup: formData.facebookSecretGroup || undefined,
    whatsappSecretGroup: formData.whatsappSecretGroup || undefined,
    messengerSecretGroup: formData.messengerSecretGroup || undefined,
    facebookPublicGroup: formData.facebookPublicGroup || undefined,
    whatsappPublicGroup: formData.whatsappPublicGroup || undefined,
    telegramGroup: formData.telegramGroup || undefined,
  };
};

// Simple version without timezone handling
export const seminarToSimpleFormData = (seminar: Seminar | null): any => {
  if (!seminar) return undefined;
  
  return {
    sl: seminar.sl || "",
    title: seminar.title || "",
    description: seminar.description || "",
    date: seminar.date ? seminar.date.slice(0, 16) : "",
    registrationDeadline: seminar.registrationDeadline ? seminar.registrationDeadline.slice(0, 16) : "",
    link: seminar.link || "",
    facebookSecretGroup: seminar.facebookSecretGroup || "",
    whatsappSecretGroup: seminar.whatsappSecretGroup || "",
    messengerSecretGroup: seminar.messengerSecretGroup || "",
    facebookPublicGroup: seminar.facebookPublicGroup || "",
    whatsappPublicGroup: seminar.whatsappPublicGroup || "",
    telegramGroup: seminar.telegramGroup || "",
  };
};