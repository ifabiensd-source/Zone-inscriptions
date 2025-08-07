


import { kv } from '@vercel/kv';
import { Activity, AppData, Service, Theme, ActivityFormData, RegistrationFormData, Registration } from '../types';
import { INITIAL_ACTIVITIES, INITIAL_SERVICES } from '../constants';
import { THEMES } from '../themes';

export const config = {
  runtime: 'edge',
};

const DATA_KEY = 'zone-inscriptions-data';

async function getAppData(): Promise<AppData> {
    let data = await kv.get<AppData>(DATA_KEY);
    // A more robust check to ensure all parts of the data exist
    if (!data || !data.activities || !data.services || !data.adminPassword || !data.currentTheme) {
        data = {
            activities: INITIAL_ACTIVITIES,
            services: INITIAL_SERVICES,
            adminPassword: 'admin2024',
            currentTheme: THEMES[0],
        };
        await kv.set(DATA_KEY, data);
    }
    return data;
}

export default async function handler(req: Request) {
  try {
    if (req.method === 'GET') {
      const data = await getAppData();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, max-age=0'
        },
      });
    }

    if (req.method === 'POST') {
      const data = await getAppData();
      const { type, payload } = await req.json();

      switch (type) {
        case 'REGISTER_YOUTH': {
            const { activityId, registrationData } = payload as { activityId: number; registrationData: RegistrationFormData };
            const activity = data.activities.find(a => a.id === activityId);
            if (activity) {
                const newRegistration: Registration = { ...registrationData, id: Date.now() };
                activity.registrations.push(newRegistration);
            }
            break;
        }
        case 'UNREGISTER_YOUTH': {
            const { activityId, registrationId } = payload as { activityId: number; registrationId: number };
            const activity = data.activities.find(a => a.id === activityId);
            if (activity) {
                activity.registrations = activity.registrations.filter(r => r.id !== registrationId);
            }
            break;
        }
        case 'ADD_ACTIVITY': {
            const newActivity: Activity = { ...(payload as ActivityFormData), id: Date.now(), registrations: [] };
            data.activities.push(newActivity);
            data.activities.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            break;
        }
        case 'UPDATE_ACTIVITY': {
            const { id, data: updatedData } = payload as { id: number; data: ActivityFormData };
            const activityIndex = data.activities.findIndex(a => a.id === id);
            if (activityIndex !== -1) {
                data.activities[activityIndex] = { ...data.activities[activityIndex], ...updatedData };
                data.activities.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            }
            break;
        }
        case 'DELETE_ACTIVITY': {
            const { id } = payload as { id: number };
            data.activities = data.activities.filter(a => a.id !== id);
            break;
        }
        case 'ADD_SERVICE': {
            const newService = payload as Service;
            if (!data.services.some(s => s.name.toLowerCase() === newService.name.toLowerCase())) {
                data.services.push(newService);
                data.services.sort((a, b) => a.name.localeCompare(b.name));
            }
            break;
        }
        case 'UPDATE_SERVICE': {
            const { name, newCode } = payload as { name: string, newCode: string };
            const service = data.services.find(s => s.name === name);
            if (service) {
                service.code = newCode;
            }
            break;
        }
        case 'DELETE_SERVICE': {
            const { name } = payload as { name: string };
            data.services = data.services.filter(s => s.name !== name);
            data.activities.forEach(act => {
                if (act.serviceAllocations && act.serviceAllocations.length > 0) {
                    const newAllocations = act.serviceAllocations.filter(alloc => alloc.serviceName !== name);
                    if (newAllocations.length < act.serviceAllocations.length) {
                        act.serviceAllocations = newAllocations;
                        act.spots = newAllocations.reduce((sum, alloc) => sum + alloc.spots, 0);
                    }
                }
            });
            break;
        }
        case 'SET_THEME':
          data.currentTheme = payload as Theme;
          break;
        case 'SET_ADMIN_PASSWORD':
          data.adminPassword = payload as string;
          break;
        default:
          return new Response(JSON.stringify({ message: 'Invalid action type' }), {
            status: 400,
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
            },
          });
      }

      await kv.set(DATA_KEY, data);
      
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, max-age=0'
        },
      });
    }

    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0'
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred';
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
      headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0'
      },
    });
  }
}
