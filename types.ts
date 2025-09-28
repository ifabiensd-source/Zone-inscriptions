export interface Registration {
  id: number;
  firstName: string;
  lastName: string;
  youthAge: string;
  department: string;
  comment?: string;
}

export interface Service {
  name: string;
  code: string;
}

export type LoggedInUser = { type: 'admin' } | { type: 'service'; service: Service };

export interface Activity {
  id: number;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime:string;
  spots: number; // total spots, will be a sum of allocations if they exist
  ageRestriction?: string; // e.g., "Plus de 12 ans", "10-14 ans"
  registrations: Registration[];
  serviceAllocations: { serviceName: string; spots: number }[];
}

export type ActivityFormData = Omit<Activity, 'id' | 'registrations'>;


export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  youthAge: string;
  department: string;
  comment: string;
}

export interface GeneratedIdea {
  title: string;
  description: string;
  materials: string[];
  steps: string[];
}

export interface Theme {
  id: string;
  name: string;
  styles: {
    '--font-primary': string;
    '--font-url': string;
    '--color-bg': string;
    '--color-text': string;
    '--color-text-muted': string;
    '--color-card': string;
    '--color-primary': string;
    '--color-primary-accent': string;
    '--color-secondary': string;
    '--color-secondary-accent': string;
    '--color-tertiary': string;
    '--color-tertiary-accent': string;
    '--color-success': string;
    '--color-danger': string;
    '--color-danger-accent': string;
    '--color-border': string;
    '--color-input-bg': string;
    '--shadow-primary': string;
    '--gradient-start': string;
    '--gradient-mid': string;
    '--gradient-end': string;
  };
}

export interface AppData {
  activities: Activity[];
  services: Service[];
  adminPassword: string;
  currentTheme: Theme;
}