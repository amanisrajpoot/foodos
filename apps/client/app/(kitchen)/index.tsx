import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSocket } from '../../hooks/useSocket';
import { useAuthStore } from '../../stores/auth.store';
import { api } from '../../services/api';
import { ErrorState } from '../../components/ui/ErrorState';
import { ToastOverlay, useToastStore } from '../../components/ui/ToastOverlay';

export default function KitchenDisplayScreen() {
  const router = useRouter();
  const { branchId, logout } = useAuthStore();
  const { socket } = useSocket(branchId || '');
  const showToast = useToastStore((s: any) => s.showToast);

  const [tickets, setTickets] = useState<any[]>([]);
  const [activeStation, setActiveStation] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [branchId]);

  useEffect(() => {
    if (socket) {
      socket.on('kitchen.ticket.created.v1', (ticket: any) => {
        setTickets((prev) => {
          if (prev.find((t) => t.id === ticket.id)) return prev;
          return [...prev, { ...ticket, items: ticket.items || [], order: ticket.order || {} }];
        });
      });
      socket.on('kitchen.ticket.preparing.v1', updateLocalTicket);
      socket.on('kitchen.ticket.ready.v1', updateLocalTicket);
      socket.on('kitchen.ticket.served.v1', removeLocalTicket);
    }
    return () => {
      socket?.off('kitchen.ticket.created.v1');
      socket?.off('kitchen.ticket.preparing.v1');
      socket?.off('kitchen.ticket.ready.v1');
      socket?.off('kitchen.ticket.served.v1');
    };
  }, [socket]);

  const updateLocalTicket = (updated: any) => {
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)));
  };

  const removeLocalTicket = (updated: any) => {
    setTickets((prev) => prev.filter((t) => t.id !== updated.id));
  };

  async function fetchTickets() {
    if (!branchId) return;
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(`/v1/kitchen/tickets?branchId=${branchId}`);
      setTickets(res.data || []);
    } catch (err) {
      console.error('Failed to fetch kitchen tickets', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const advanceTicket = async (id: string, currentStatus: string) => {
    const next = currentStatus === 'QUEUED' ? 'PREPARING' : 'READY';
    
    // Optimistic update
    setTickets(tickets.map((t) => (t.id === id ? { ...t, status: next } : t)));

    try {
      await api.patch(`/v1/kitchen/tickets/${id}/status`, { status: next });
    } catch (err) {
      console.error('Failed to update ticket status', err);
      showToast('error', 'Failed to update ticket status');
      // Revert optimistic update
      fetchTickets();
    }
  };

  const getTimeColor = (createdAt: string) => {
    const elapsedMinutes = (new Date().getTime() - new Date(createdAt).getTime()) / 60000;
    if (elapsedMinutes > 20) return 'text-rose-400 font-black';
    if (elapsedMinutes > 10) return 'text-amber-400 font-black';
    return 'text-emerald-400 font-bold';
  };

  const getTimeElapsed = (createdAt: string) => {
    const elapsedMinutes = Math.floor((new Date().getTime() - new Date(createdAt).getTime()) / 60000);
    return `${elapsedMinutes}m`;
  };

  const filteredTickets = tickets.filter(
    (t) => activeStation === 'ALL' || t.station === activeStation
  );

  const renderQueue = (title: string, status: string, accentColor: string) => {
    const queueItems = filteredTickets.filter((t) => t.status === status);
    return (
      <View className="flex-1 min-w-[320px] bg-slate-900/50 border border-slate-800 rounded-[1.5rem] p-5 mr-4 shadow-xl">
        {/* Queue Header */}
        <View className="flex-row items-center justify-between mb-5 pb-4 border-b border-slate-800/80">
          <View className="flex-row items-center space-x-3">
            <View className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: accentColor, shadowColor: accentColor }} />
            <Text className="text-xl font-black text-white tracking-tight">{title}</Text>
          </View>
          <View className="bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
            <Text className="text-xs font-black text-slate-300">{queueItems.length}</Text>
          </View>
        </View>

        {/* Ticket List */}
        <ScrollView className="flex-1 showsVerticalScrollIndicator={false}">
          {queueItems.length === 0 ? (
            <View className="py-16 items-center justify-center opacity-50">
              <Ionicons name="checkmark-circle-outline" size={48} color="#475569" />
              <Text className="text-slate-400 text-sm mt-3 font-bold uppercase tracking-wider">Queue Empty</Text>
            </View>
          ) : (
            queueItems.map((ticket) => (
              <TouchableOpacity
                key={ticket.id}
                onPress={() => advanceTicket(ticket.id, ticket.status)}
                className="bg-slate-900 border border-slate-700 rounded-2xl p-5 mb-5 shadow-2xl hover:border-amber-500/50 hover:bg-slate-800/80 transition-all"
              >
                {/* Header */}
                <View className="flex-row justify-between items-center mb-3">
                  <View>
                    <Text className="text-white font-black text-2xl tracking-tighter">
                      {ticket.order?.orderNumber || ticket.ticketNumber}
                    </Text>
                    <Text className="text-amber-400 font-bold text-xs uppercase tracking-wider mt-1">
                      {ticket.order?.table?.label ? `Table ${ticket.order.table.label}` : (ticket.order?.channel || 'TAKEAWAY').replace('_', ' ')}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className={`text-lg font-mono ${getTimeColor(ticket.createdAt)}`}>
                      ⏱️ {getTimeElapsed(ticket.createdAt)}
                    </Text>
                    <View className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-md mt-2 shadow-inner">
                      <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {ticket.station}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Items */}
                <View className="mt-4 pt-4 border-t border-slate-800/80">
                  {ticket.items?.map((item: any) => (
                    <View key={item.id} className="mb-3">
                      <View className="flex-row items-start">
                        <Text className="text-amber-400 font-black text-lg mr-3 w-8 text-right">
                          {item.quantity}x
                        </Text>
                        <Text className="text-slate-200 font-bold text-lg flex-1 leading-6">
                          {item.nameSnapshot}
                        </Text>
                      </View>
                      {item.specialInstructions ? (
                        <Text className="text-rose-400 text-xs mt-1 pl-11 font-bold italic tracking-wide">
                          ⚠️ {item.specialInstructions}
                        </Text>
                      ) : null}
                    </View>
                  ))}
                </View>

                {/* Action Footer */}
                <View className="mt-4 pt-4 border-t border-slate-800/50 flex-row justify-between items-center">
                  <Text className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                    {ticket.ticketNumber}
                  </Text>
                  <View className={`px-4 py-2 rounded-xl shadow-lg transition-all ${
                    ticket.status === 'QUEUED' ? 'bg-indigo-500/20 border border-indigo-500/50 hover:bg-indigo-500/30' :
                    ticket.status === 'PREPARING' ? 'bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500/30' :
                    'bg-emerald-500/20 border border-emerald-500/50 hover:bg-emerald-500/30'
                  }`}>
                    <Text className={`text-xs font-black uppercase tracking-wider ${
                      ticket.status === 'QUEUED' ? 'text-indigo-400' :
                      ticket.status === 'PREPARING' ? 'text-amber-400' :
                      'text-emerald-400'
                    }`}>
                      {ticket.status === 'QUEUED'
                        ? 'Start Prep →'
                        : ticket.status === 'PREPARING'
                        ? 'Mark Ready ✓'
                        : 'Complete Order ✓'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="text-sm font-bold text-slate-400 mt-4 uppercase tracking-wider">Connecting to KDS...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-950 p-6 sm:p-8">
        <ErrorState onRetry={fetchTickets} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-950 p-6">
      <ToastOverlay />
      
      {/* Header Bar */}
      <View className="flex-row justify-between items-center mb-8 flex-wrap gap-4 bg-slate-900 p-4 rounded-[1.5rem] border border-slate-800 shadow-xl z-10">
        <View className="flex-row items-center space-x-4">
          <View className="w-14 h-14 bg-amber-500/10 rounded-2xl items-center justify-center border border-amber-500/20 shadow-lg shadow-amber-500/10">
            <Ionicons name="flame" size={30} color="#f59e0b" />
          </View>
          <View>
            <Text className="text-3xl font-black text-white tracking-tight">
              Kitchen Display
            </Text>
            <Text className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
              Live Feed • Branch {branchId?.substring(0, 8)}
            </Text>
          </View>
        </View>

        {/* Station Filter Tabs */}
        <View className="flex-row items-center space-x-4">
          <View className="flex-row bg-slate-950 p-1.5 rounded-xl border border-slate-800 shadow-inner">
            {['ALL', 'MAIN', 'GRILL', 'DRINKS'].map((st) => (
              <TouchableOpacity
                key={st}
                onPress={() => setActiveStation(st)}
                className={`px-5 py-2.5 rounded-lg transition-all ${
                  activeStation === st ? 'bg-amber-500 shadow-md shadow-amber-500/20' : 'bg-transparent hover:bg-slate-800'
                }`}
              >
                <Text
                  className={`text-xs font-black tracking-wider uppercase ${
                    activeStation === st ? 'text-slate-950' : 'text-slate-500'
                  }`}
                >
                  {st}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => {
              logout();
              router.replace('/(auth)/login');
            }}
            className="bg-rose-500/10 hover:bg-rose-500/20 px-5 py-3 rounded-xl border border-rose-500/20 transition-all shadow-sm"
          >
            <Text className="text-rose-400 font-black uppercase tracking-wider text-xs">End Shift</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3 Column Queue Columns */}
      <View className="flex-1 flex-row">
        {renderQueue('New Tickets', 'QUEUED', '#6366f1')}
        {renderQueue('Preparing', 'PREPARING', '#f59e0b')}
        {renderQueue('Ready For Service', 'READY', '#10b981')}
      </View>
    </View>
  );
}
