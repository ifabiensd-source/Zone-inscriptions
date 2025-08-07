
import { kv } from '@vercel/kv';
import { Activity, AppData, Service, Theme } from '../types';
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
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST') {
      const { type, payload } = await req.json();
      const data = await getAppData();

      switch (type) {
        case 'SET_ACTIVITIES':
          data.activities = payload as Activity[];
          break;
        case 'SET_SERVICES':
          data.services = payload as Service[];
          break;
        case 'SET_THEME':
          data.currentTheme = payload as Theme;
          break;
        case 'SET_ADMIN_PASSWORD':
          data.adminPassword = payload as string;
          break;
        case 'SET_FULL_DATA': // For complex operations that affect multiple slices
          data.activities = (payload as { activities: Activity[] }).activities;
          data.services = (payload as { services: Service[] }).services;
          break;
        default:
          return new Response(JSON.stringify({ message: 'Invalid action type' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
      }

      await kv.set(DATA_KEY, data);
      
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred';
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
