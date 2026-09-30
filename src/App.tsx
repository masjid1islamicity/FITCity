/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardExecutive } from './components/DashboardExecutive';
import { PublicServicesTransport } from './components/PublicServicesTransport';
import { IoTCustomCarbon } from './components/IoTCustomCarbon';
import { BudgetTransparency } from './components/BudgetTransparency';
import { ComplaintSystemAI } from './components/ComplaintSystemAI';
import { InteractiveMapDisasterAid } from './components/InteractiveMapDisasterAid';
import { FamilyFitnessTracker } from './components/FamilyFitnessTracker';
import { WorshipDisciplineTracker } from './components/WorshipDisciplineTracker';
import { BeautyHealthBekamCenter } from './components/BeautyHealthBekamCenter';
import { Footer } from './components/Footer';
import { AppTab, PushNotificationItem, CitizenComplaint } from './types';
import { INITIAL_NOTIFICATIONS } from './data/mockData';
import { sound } from './services/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('executive');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<PushNotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('07:15 WIB');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize theme from system or localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('fitcity-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(shouldDark);
    document.documentElement.classList.toggle('dark', shouldDark);
  }, []);

  const toggleDark = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('fitcity-theme', next ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const triggerManualSync = () => {
    setIsSyncing(true);
    sound.playAlertTone();
    setTimeout(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
      setLastSyncedTime(timeStr);
      setIsSyncing(false);
      showToast('Sinkronisasi cloud antarperangkat berhasil!');
    }, 1000);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleTriggerGeoAlert = (district: string, message: string) => {
    sound.playAlertTone();
    const newNotif: PushNotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Peringatan Dini: ${district}`,
      message,
      category: 'bencana',
      timestamp: 'Baru saja',
      isRead: false,
      districtAffected: district,
      actionUrlTab: 'map-aid-disaster'
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Peringatan Wilayah Disiarkan ke warga ${district}`);
  };

  const handleNewComplaintCreated = (complaint: CitizenComplaint) => {
    const newNotif: PushNotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Tiket AI Baru: ${complaint.id}`,
      message: `Laporan warga "${complaint.title}" telah diverifikasi oleh AI dan didisposisikan ke ${complaint.assignedDepartment}.`,
      category: 'perbaikan',
      timestamp: 'Baru saja',
      isRead: false,
      districtAffected: complaint.district,
      actionUrlTab: 'complaint-ai'
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Laporan ${complaint.id} berhasil ditriage sistem AI!`);
  };

  const handleNewAppointmentNotification = (notif: PushNotificationItem) => {
    setNotifications((prev) => [notif, ...prev]);
    showToast(`Pengingat Janji Temu Bekam Berhasil Disinkronkan!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Toast banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-emerald-600 animate-in fade-in slide-in-from-right-4">
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header & Ecosystem Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleDark={toggleDark}
        notifications={notifications}
        markNotificationAsRead={markNotificationAsRead}
        isSyncing={isSyncing}
        triggerManualSync={triggerManualSync}
        lastSyncedTime={lastSyncedTime}
      />

      {/* Primary Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'executive' && (
          <DashboardExecutive
            setActiveTab={setActiveTab}
            isSyncing={isSyncing}
            triggerManualSync={triggerManualSync}
            triggerGeoAlert={handleTriggerGeoAlert}
          />
        )}

        {activeTab === 'services-transport' && (
          <PublicServicesTransport />
        )}

        {activeTab === 'iot-carbon' && (
          <IoTCustomCarbon />
        )}

        {activeTab === 'budget-transparency' && (
          <BudgetTransparency />
        )}

        {activeTab === 'complaint-ai' && (
          <ComplaintSystemAI
            onNewComplaintCreated={handleNewComplaintCreated}
          />
        )}

        {activeTab === 'map-aid-disaster' && (
          <InteractiveMapDisasterAid
            onTriggerGeoAlert={handleTriggerGeoAlert}
          />
        )}

        {activeTab === 'family-fitness' && (
          <FamilyFitnessTracker />
        )}

        {activeTab === 'worship-journal' && (
          <WorshipDisciplineTracker />
        )}

        {activeTab === 'beauty-health-bekam' && (
          <BeautyHealthBekamCenter
            onScheduleNotification={handleNewAppointmentNotification}
          />
        )}
      </main>

      {/* Global Footer with Motto and Ecosystem Links */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
