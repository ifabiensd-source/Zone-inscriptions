

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import Header from './components/Header';
import ActivityCard from './components/ActivityCard';
import RegistrationModal from './components/RegistrationModal';
import AdminLoginModal from './components/AdminLoginModal';
import AddActivityForm from './components/AddActivityForm';
import AdminServicesManager from './components/AdminServicesManager';
import AdminThemeManager from './components/AdminThemeManager';
import ServiceLogin from './components/ServiceLogin';
import ConfirmationModal from './components/ConfirmationModal';
import DynamicThemeStyles from './components/DynamicThemeStyles';
import { Activity, Registration, RegistrationFormData, ActivityFormData, Theme, Service, LoggedInUser, AppData } from './types';
import { THEMES } from './themes';
import AdminReportGenerator from './components/AdminReportGenerator';
import EditActivityModal from './components/EditActivityModal';
import { playSuccessSound } from './utils/audio';
import AdminPasswordManager from './components/AdminPasswordManager';
import AdminScheduleGenerator from './components/AdminScheduleGenerator';
import Spinner from './components/Spinner';

interface ConfirmationOptions {
    message: string;
    onConfirm: () => void;
    title?: string;
    confirmText?: string;
    confirmButtonClass?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const App: React.FC = () => {
  const { data, error, mutate } = useSWR<AppData>('/api/data', fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 5000, // Re-fetch data every 5 seconds
  });

  const activities = data?.activities;
  const services = data?.services;
  const currentTheme = data?.currentTheme;
  const adminPassword = data?.adminPassword;

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(() => {
    if (typeof window === 'undefined') return null;
    
    // Admin session is persistent and takes priority
    const storedAdmin = localStorage.getItem('loggedInUser');
    if (storedAdmin) {
        try {
            const adminUser = JSON.parse(storedAdmin);
            if (adminUser.type === 'admin') {
                return adminUser;
            }
        } catch (e) {
            localStorage.removeItem('loggedInUser');
        }
    }
    
    return null;
  });
  const [previousServiceUser, setPreviousServiceUser] = useState<LoggedInUser | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [serviceLoginError, setServiceLoginError] = useState<string | null>(null);

  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    message: string;
    title: string;
    confirmText: string;
    confirmButtonClass: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    message: '',
    title: 'Confirmation requise',
    confirmText: 'Confirmer',
    confirmButtonClass: 'bg-[var(--color-danger)] hover:bg-[var(--color-danger-accent)]',
    onConfirm: () => {},
  });
  
  const requestConfirmation = useCallback((options: ConfirmationOptions) => {
    setConfirmationState({
      isOpen: true,
      message: options.message,
      title: options.title || 'Confirmation requise',
      confirmText: options.confirmText || 'Confirmer',
      confirmButtonClass: options.confirmButtonClass || 'bg-[var(--color-danger)] hover:bg-[var(--color-danger-accent)]',
      onConfirm: () => {
        options.onConfirm();
        closeConfirmation();
      },
    });
  }, []);

  const closeConfirmation = () => {
    setConfirmationState(prev => ({ ...prev, isOpen: false }));
  };
  
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (loggedInUser?.type === 'admin') {
        // Persist admin session
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    } else if (loggedInUser?.type === 'service') {
        // Clean up local storage in case we switched from admin to service
        localStorage.removeItem('loggedInUser');
    } else {
        // User logged out, clear local storage
        localStorage.removeItem('loggedInUser');
    }
  }, [loggedInUser]);

  const updateServerState = async (type: string, payload: any) => {
    return fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload }),
    }).then((res) => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    });
  };

  const handleServiceLogin = (serviceName: string, code: string) => {
    const service = services?.find(s => s.name === serviceName);
    if (service && service.code === code.trim()) {
      const user: LoggedInUser = { type: 'service', service };
      setLoggedInUser(user);
      setServiceLoginError(null);
    } else {
      setServiceLoginError("Nom de service ou code d'accès incorrect.");
    }
  };

  const handleOpenModal = useCallback((activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  }, []);

  const handleRegister = useCallback(async (registrationData: RegistrationFormData) => {
    if (!selectedActivity || !data) return;

    // Validation
    const isPublic = !selectedActivity.serviceAllocations || selectedActivity.serviceAllocations.length === 0;
    if (isPublic) {
        if (selectedActivity.registrations.length >= selectedActivity.spots) {
            alert("Désolé, cette activité est complète.");
            return;
        }
    } else {
        const serviceName = registrationData.department;
        const allocation = selectedActivity.serviceAllocations.find(a => a.serviceName === serviceName);
        if (!allocation) {
            alert(`Le service "${serviceName}" n'a pas d'accès réservé pour cette activité.`);
            return;
        }
        const registrationsForService = selectedActivity.registrations.filter(r => r.department === serviceName).length;
        if (registrationsForService >= allocation.spots) {
            alert(`Désolé, il n'y a plus de places disponibles pour le service "${serviceName}".`);
            return;
        }
    }

    const newRegistration: Registration = { ...registrationData, id: Date.now() };
    const optimisticActivities = data.activities.map(act =>
        act.id === selectedActivity.id
            ? { ...act, registrations: [...act.registrations, newRegistration] }
            : act
    );
    const optimisticData = { ...data, activities: optimisticActivities };
    
    await mutate(updateServerState('REGISTER_YOUTH', { activityId: selectedActivity.id, registrationData }), {
        optimisticData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
    });

    playSuccessSound();
    handleCloseModal();
  }, [selectedActivity, handleCloseModal, data, mutate]);
  
  const handleAdminAccess = () => {
    if (loggedInUser?.type === 'admin') {
      // Restore previous service user if it exists, otherwise log out completely
      setLoggedInUser(previousServiceUser);
      setPreviousServiceUser(null); // Reset for next time
    } else {
      // Store current service user if one is logged in before opening admin login
      if (loggedInUser?.type === 'service') {
        setPreviousServiceUser(loggedInUser);
      }
      setAdminLoginError(null);
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLogin = (password: string) => {
    if (password.trim() === adminPassword) {
      setLoggedInUser({ type: 'admin' });
      setIsAdminLoginOpen(false);
      setAdminLoginError(null);
    } else {
      setAdminLoginError("Mot de passe incorrect.");
    }
  };

  const handleAdminPasswordChange = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!data) {
        throw new Error("Les données ne sont pas chargées.");
    }
    if (currentPassword !== data.adminPassword) {
        throw new Error("Le mot de passe actuel est incorrect.");
    }
    
    const optimisticData = { ...data, adminPassword: newPassword };
    await mutate(updateServerState('SET_ADMIN_PASSWORD', newPassword), {
        optimisticData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false
    });

    playSuccessSound();
  }, [data, mutate]);

  const handleAddActivity = useCallback(async (formData: ActivityFormData) => {
    if (!data) return;
    const newActivity: Activity = { ...formData, id: Date.now(), registrations: [] };
    const optimisticActivities = [...data.activities, newActivity].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const optimisticData = { ...data, activities: optimisticActivities };
    await mutate(updateServerState('ADD_ACTIVITY', formData), {
        optimisticData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false
    });
    playSuccessSound();
  }, [data, mutate]);

  const handleOpenEditModal = useCallback((activity: Activity) => {
    setEditingActivity(activity);
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingActivity(null);
  }, []);

  const handleUpdateActivity = useCallback(async (updatedActivityData: ActivityFormData) => {
    if (!editingActivity || !data) return;
    
    const optimisticActivities = data.activities.map(act =>
        act.id === editingActivity.id
          ? { ...act, ...updatedActivityData }
          : act
      ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const optimisticData = { ...data, activities: optimisticActivities };
    await mutate(updateServerState('UPDATE_ACTIVITY', { id: editingActivity.id, data: updatedActivityData }), {
        optimisticData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false
    });

    playSuccessSound();
    handleCloseEditModal();
  }, [editingActivity, data, mutate, handleCloseEditModal]);

  const handleDeleteActivity = useCallback((activityId: number, activityTitle: string) => {
    requestConfirmation({
        message: `Êtes-vous sûr de vouloir supprimer l'activité "${activityTitle}" ?`,
        confirmText: 'Supprimer',
        onConfirm: async () => {
            if (!data) return;
            const optimisticActivities = data.activities.filter(act => act.id !== activityId);
            const optimisticData = { ...data, activities: optimisticActivities };
            await mutate(updateServerState('DELETE_ACTIVITY', { id: activityId }), {
                optimisticData,
                rollbackOnError: true,
                populateCache: false,
                revalidate: true
            });
            playSuccessSound();
        }
    });
  }, [requestConfirmation, data, mutate]);

  const handleUnregister = useCallback((activityId: number, registrationId: number, youthName: string) => {
    requestConfirmation({
        message: `Êtes-vous sûr de vouloir désinscrire ${youthName} ?`,
        confirmText: 'Désinscrire',
        onConfirm: async () => {
            if (!data) return;
            const optimisticActivities = data.activities.map(act => {
                if (act.id === activityId) {
                    return { ...act, registrations: act.registrations.filter(reg => reg.id !== registrationId) };
                }
                return act;
            });

            setSelectedActivity(prev => {
                if (!prev || prev.id !== activityId) return prev;
                return optimisticActivities.find(act => act.id === activityId) || null;
            });
            
            const optimisticData = { ...data, activities: optimisticActivities };
            await mutate(updateServerState('UNREGISTER_YOUTH', { activityId, registrationId }), {
                optimisticData,
                rollbackOnError: true,
                populateCache: true,
                revalidate: false
            });
            playSuccessSound();
        }
    });
  }, [requestConfirmation, data, mutate]);

  const handleAddService = useCallback(async (service: Service) => {
    if (!data) return;
    if (service.name && service.code && !data.services.some(s => s.name.toLowerCase() === service.name.toLowerCase())) {
      const optimisticServices = [...data.services, service].sort((a, b) => a.name.localeCompare(b.name));
      const optimisticData = { ...data, services: optimisticServices };
      await mutate(updateServerState('ADD_SERVICE', service), {
        optimisticData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false
      });
      playSuccessSound();
    } else {
      alert("Ce service existe déjà ou les informations sont invalides.");
    }
  }, [data, mutate]);

  const handleDeleteService = useCallback((serviceName: string) => {
    requestConfirmation({
        message: `Êtes-vous sûr de vouloir supprimer le service "${serviceName}" ? Les places qui lui sont réservées dans les activités seront supprimées.`,
        confirmText: 'Supprimer',
        onConfirm: async () => {
            if (!data) return;
            const optimisticServices = data.services.filter(s => s.name !== serviceName);
            const optimisticActivities = data.activities.map(act => {
              if (!act.serviceAllocations || act.serviceAllocations.length === 0) {
                return act;
              }
              const newAllocations = act.serviceAllocations.filter(alloc => alloc.serviceName !== serviceName);
              if (newAllocations.length === act.serviceAllocations.length) {
                return act;
              }
              const newTotalSpots = newAllocations.reduce((sum, alloc) => sum + alloc.spots, 0);
              return { ...act, serviceAllocations: newAllocations, spots: newTotalSpots };
            });

            const optimisticData = { ...data, activities: optimisticActivities, services: optimisticServices };
            await mutate(updateServerState('DELETE_SERVICE', { name: serviceName }), {
                optimisticData,
                rollbackOnError: true,
                populateCache: false,
                revalidate: true,
            });
            playSuccessSound();
        }
    });
  }, [requestConfirmation, data, mutate]);

  const handleUpdateService = useCallback(async (serviceName: string, newCode: string) => {
    if (!data) return;
    const optimisticServices = data.services.map(s => s.name === serviceName ? { ...s, code: newCode } : s);
    const optimisticData = { ...data, services: optimisticServices };
    await mutate(updateServerState('UPDATE_SERVICE', { name: serviceName, newCode }), {
      optimisticData,
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    });
    playSuccessSound();
  }, [data, mutate]);

  const handleThemeChange = useCallback(async (theme: Theme) => {
    if (!data) return;
    const optimisticData = { ...data, currentTheme: theme };
    await mutate(updateServerState('SET_THEME', theme), {
        optimisticData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
    });
    // no sound for theme change
  }, [data, mutate]);
  
  const filteredActivities = useMemo(() => {
    if (!activities) return [];
    
    const sortedActivities = [...activities].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (!loggedInUser) return [];

    if (loggedInUser.type === 'admin') {
      return sortedActivities;
    }
    
    if (loggedInUser.type === 'service') {
      const serviceName = loggedInUser.service.name;
      return sortedActivities.filter(act =>
        (act.serviceAllocations || []).length === 0 || 
        (act.serviceAllocations || []).some(alloc => alloc.serviceName === serviceName)
      );
    }
    
    return [];
  }, [activities, loggedInUser]);

  const isAdmin = loggedInUser?.type === 'admin';
  
  const departmentsForModal = useMemo(() => {
    if (!services) return [];
    if (isAdmin) {
      return services.map(s => s.name);
    }
    if (loggedInUser?.type === 'service') {
      return [loggedInUser.service.name];
    }
    return [];
  }, [isAdmin, services, loggedInUser]);

  if (error) return <div className="fixed inset-0 bg-bg text-text flex justify-center items-center"><p>Impossible de charger les données. Veuillez rafraîchir la page.</p></div>;
  if (!data) return (
      <div className="fixed inset-0 bg-bg flex justify-center items-center">
          <DynamicThemeStyles theme={THEMES[0]} />
          <Spinner />
      </div>
  );

  return (
    <div className="min-h-screen">
      <DynamicThemeStyles theme={currentTheme} />
      
      {!loggedInUser ? (
        <ServiceLogin 
          onLogin={handleServiceLogin} 
          error={serviceLoginError} 
          services={services}
          onAdminClick={handleAdminAccess}
        />
      ) : (
        <div className="p-4 sm:p-6 lg:p-8">
          <Header isAdmin={isAdmin} onAdminAccess={handleAdminAccess} />
          <main className="container mx-auto">
            {isAdmin && (
                <div className="mb-12 animate-fade-in space-y-8">
                    <AddActivityForm onAddActivity={handleAddActivity} services={services} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <AdminServicesManager 
                          services={services}
                          onAddService={handleAddService}
                          onDeleteService={handleDeleteService}
                          onUpdateService={handleUpdateService}
                        />
                        <AdminThemeManager
                          currentTheme={currentTheme}
                          onThemeChange={handleThemeChange}
                        />
                        <AdminReportGenerator activities={activities} />
                        <AdminScheduleGenerator 
                          activities={activities}
                          services={services}
                          theme={currentTheme}
                        />
                        <AdminPasswordManager onPasswordChange={handleAdminPasswordChange} />
                    </div>
                </div>
            )}

            <h2 className="text-3xl font-bold mb-8 text-text">Activités à venir</h2>
            {filteredActivities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredActivities.map(activity => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onRegister={handleOpenModal}
                    isAdmin={!!isAdmin}
                    onDelete={handleDeleteActivity}
                    onEdit={handleOpenEditModal}
                    loggedInUser={loggedInUser}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-2xl">
                <p className="text-text-muted">Aucune activité à venir pour votre service.</p>
                {isAdmin && <p className="text-text-muted mt-2">Vous pouvez en ajouter une depuis le panneau d'administration.</p>}
              </div>
            )}
          </main>
        </div>
      )}
      
      <RegistrationModal
        isOpen={isModalOpen}
        activity={selectedActivity}
        onClose={handleCloseModal}
        onRegister={handleRegister}
        departments={departmentsForModal}
        isAdmin={!!isAdmin}
        onUnregister={handleUnregister}
      />

      <EditActivityModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        activity={editingActivity}
        onSave={handleUpdateActivity}
        services={services}
      />

      <AdminLoginModal 
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSubmit={handleAdminLogin}
        error={adminLoginError}
      />

      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        message={confirmationState.message}
        onConfirm={confirmationState.onConfirm}
        onCancel={closeConfirmation}
        title={confirmationState.title}
        confirmText={confirmationState.confirmText}
        confirmButtonClass={confirmationState.confirmButtonClass}
      />
    </div>
  );
};

export default App;