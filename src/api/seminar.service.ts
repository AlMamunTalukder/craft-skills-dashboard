// // src/api/seminar.service.ts
// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// console.log('Frontend API URL:', API_BASE_URL);

// const api = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     withCredentials: true, // Send cookies for session auth
// });

// // Debug interceptors
// api.interceptors.request.use((config) => {
//     console.log('📤 Request:', {
//         method: config.method?.toUpperCase(),
//         url: config.url,
//         data: config.data,
//     });
//     return config;
// });

// api.interceptors.response.use(
//     (response) => {
//         console.log('✅ Response:', {
//             status: response.status,
//             url: response.config.url,
//             data: response.data,
//         });
//         return response;
//     },
//     (error) => {
//         console.error('❌ API Error:', {
//             status: error.response?.status,
//             message: error.response?.data?.message || error.message,
//             url: error.config?.url,
//         });
//         return Promise.reject(error);
//     }
// );

// // Types
// export interface Seminar {
//     _id?: string;
//     id?: string;
//     sl?: string;
//     title: string;
//     description?: string;
//     date: string;
//     registrationDeadline: string;
//     isActive?: boolean;
//     link?: string;
//     facebookSecretGroup?: string;
//     whatsappSecretGroup?: string;
//     messengerSecretGroup?: string;
//     facebookPublicGroup?: string;
//     whatsappPublicGroup?: string;
//     telegramGroup?: string;
//     createdAt?: string;
//     updatedAt?: string;
// }

// export interface CreateSeminarDto {
//     sl?: string;
//     title: string;
//     description?: string;
//     date: string;
//     registrationDeadline: string;
//     isActive?: boolean;
//     link?: string;
//     facebookSecretGroup?: string;
//     whatsappSecretGroup?: string;
//     messengerSecretGroup?: string;
//     facebookPublicGroup?: string;
//     whatsappPublicGroup?: string;
//     telegramGroup?: string;
// }

// // API Functions
// export const seminarAPI = {
//     // Create seminar
//     createSeminar: async (data: CreateSeminarDto): Promise<Seminar> => {
//         const response = await api.post('/seminars', data);
//         return response.data.data;
//     },

//     // Get all seminars
//     getAllSeminars: async (): Promise<Seminar[]> => {
//         const response = await api.get('/seminars');
//         return response.data.data;
//     },

//     // Get single seminar
//     getSeminarById: async (id: string): Promise<Seminar> => {
//         const response = await api.get(`/seminars/${id}`);
//         return response.data.data;
//     },

//     // Update seminar
//     updateSeminar: async ({ id, data }: { id: string; data: Partial<CreateSeminarDto> }): Promise<Seminar> => {
//         const response = await api.put(`/seminars/${id}`, data);
//         return response.data.data;
//     },

//     // Delete seminar
//     deleteSeminar: async (id: string): Promise<void> => {
//         await api.delete(`/seminars/${id}`);
//     },

//     // Change status
//     changeStatus: async (id: string, isActive: boolean): Promise<Seminar> => {
//         const response = await api.put(`/seminars/${id}/status`, { isActive });
//         return response.data.data;
//     },
// };

// export default seminarAPI;