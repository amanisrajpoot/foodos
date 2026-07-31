import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSocket } from '../../hooks/useSocket';

const MOCK_TICKETS = [
  {
    id: 'tkt-1',
    orderNumber: 'ORD-8821',
    ticketNumber: 'TKT-001',
    type: 'DINE_IN',
    tableLabel: 'Table 04',
    station: 'GRILL',
    status: 'QUEUED',
    timeElapsed: 4,
    items: [
      { id: 'i1', name: 'Paneer Tikka Platter', qty: 2, notes: 'Extra mint chutney on side' },
      { id: 'i2', name: 'Butter Naan', qty: 4, notes: '' },
    ],
  },
  {
    id: 'tkt-2',
    orderNumber: 'ORD-8824',
    ticketNumber: 'TKT-002',
    type: 'DELIVERY',
    tableLabel: 'UberEats #49',
    station: 'MAIN',
    status: 'PREPARING',
    timeElapsed: 14,
    items: [
      { id: 'i3', name: 'Butter Chicken Large', qty: 1, notes: 'Medium spice level' },
      { id: 'i4', name: 'Jeera Rice', qty: 2, notes: '' },
    ],
  },
  {
    id: 'tkt-3',
    orderNumber: 'ORD-8826',
    ticketNumber: 'TKT-003',
    type: 'TAKEAWAY',
    tableLabel: 'Pickup Customer',
    station: 'DRINKS',
    status: 'READY',
    timeElapsed: 22,
    items: [{ id: 'i5', name: 'Mango Lassi Large', qty: 3, notes: 'No Ice' }],
  },
];

export default function KitchenDisplayScreen() {
  const router = useRouter();
  const { socket } = useSocket('branch_1');
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [activeStation, setActiveStation] = useState('ALL');

  useEffect(() => {
    if (socket) {
      socket.on('kitchen.ticket.created.v1', (ticket) => {
        setTickets((prev) => [...prev, { ...ticket, items: [] }]);
      });
    }
    return () => {
      socket?.off('kitchen.ticket.created.v1');
    };
  }, [socket]);

  const getTimeColor = (timeElapsed: number) => {
    if (timeElapsed > 20) return 'text-rose-400 font-bold';
    if (timeElapsed > 10) return 'text-amber-400 font-bold';
    return 'text-emerald-400 font-bold';
  };

  const advanceTicket = (id: string, currentStatus: string) => {
    if (currentStatus === 'READY') {
      setTickets(tickets.filter((t) => t.id !== id));
      return;
    }
    const next = currentStatus === 'QUEUED' ? 'PREPARING' : 'READY';
    setTickets(tickets.map((t) => (t.id === id ? { ...t, status: next } : t)));
  };

  const filteredTickets = tickets.filter(
    (t) => activeStation === 'ALL' || t.station === activeStation
  );

  const renderQueue = (title: string, status: string, accentColor: string) => {
    const queueItems = filteredTickets.filter((t) => t.status === status);
    return (
      <View className="flex-1 min-w-[320px] bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mr-4 shadow-xl">
        {/* Queue Header */}
        <View className="flex-row items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <View className="flex-row items-center space-x-2">
            <View className="w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }} />
            <Text className="text-lg font-bold text-white tracking-wide">{title}</Text>
          </View>
          <View className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            <Text className="text-xs font-bold text-slate-300">{queueItems.length}</Text>
          </View>
        </View>

        {/* Ticket List */}
        <ScrollView className="flex-1">
          {queueItems.length === 0 ? (
            <View className="py-12 items-center justify-center">
              <Ionicons name="checkmark-circle-outline" size={36} color="#334155" />
              <Text className="text-slate-600 text-xs mt-2 font-medium">Queue Empty</Text>
            </View>
          ) : (
            queueItems.map((ticket) => (
              <TouchableOpacity
                key={ticket.id}
                onPress={() => advanceTicket(ticket.id, ticket.status)}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-4 shadow-md hover:border-amber-500/40"
              >
                {/* Header */}
                <View className="flex-row justify-between items-center mb-2">
                  <View>
                    <Text className="text-white font-extrabold text-xl tracking-tight">
                      {ticket.orderNumber}
                    </Text>
                    <Text className="text-slate-400 text-xs mt-0.5">{ticket.tableLabel}</Text>
                  </View>
                  <View className="items-end">
                    <Text className={`text-base font-mono ${getTimeColor(ticket.timeElapsed)}`}>
                      ⏱️ {ticket.timeElapsed}m
                    </Text>
                    <View className="bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded mt-1">
                      <Text className="text-[10px] font-bold text-amber-400 uppercase">
                        {ticket.station}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Items */}
                <View className="mt-3 pt-3 border-t border-slate-800/80">
                  {ticket.items.map((item, idx) => (
                    <View key={idx} className="mb-2">
                      <View className="flex-row items-center">
                        <Text className="text-amber-400 font-extrabold text-base mr-2">
                          {item.qty}x
                        </Text>
                        <Text className="text-slate-100 font-bold text-base flex-1">
                          {item.name}
                        </Text>
                      </View>
                      {item.notes ? (
                        <Text className="text-rose-400 text-xs mt-0.5 pl-6 italic">
                          ⚠️ {item.notes}
                        </Text>
                      ) : null}
                    </View>
                  ))}
                </View>

                {/* Action Footer */}
                <View className="mt-3 pt-2 border-t border-slate-800/50 flex-row justify-between items-center">
                  <Text className="text-[10px] text-slate-500 uppercase font-mono">
                    Channel: {ticket.type}
                  </Text>
                  <View className="bg-slate-800 px-3 py-1 rounded-lg">
                    <Text className="text-xs font-bold text-amber-400">
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

  return (
    <View className="flex-1 bg-slate-950 p-4 sm:p-6">
      {/* Header Bar */}
      <View className="flex-row justify-between items-center mb-6 flex-wrap gap-4">
        <View className="flex-row items-center space-x-4">
          <View className="w-12 h-12 bg-purple-500/10 rounded-2xl items-center justify-center border border-purple-500/20">
            <Ionicons name="flame" size={26} color="#a855f7" />
          </View>
          <View>
            <Text className="text-3xl font-extrabold text-white tracking-tight">
              Kitchen Display System (KDS)
            </Text>
            <Text className="text-slate-400 text-xs mt-0.5">
              Live WebSocket queue • Branch 01 (Downtown Kitchen)
            </Text>
          </View>
        </View>

        {/* Station Filter Tabs */}
        <View className="flex-row items-center space-x-3">
          <View className="flex-row bg-slate-900 p-1 rounded-xl border border-slate-800">
            {['ALL', 'MAIN', 'GRILL', 'DRINKS'].map((st) => (
              <TouchableOpacity
                key={st}
                onPress={() => setActiveStation(st)}
                className={`px-4 py-2 rounded-lg ${
                  activeStation === st ? 'bg-amber-500' : 'bg-transparent'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    activeStation === st ? 'text-slate-950' : 'text-slate-400'
                  }`}
                >
                  {st}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => router.push('/')}
            className="bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl border border-slate-700"
          >
            <Text className="text-white font-bold text-xs">Exit KDS</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3 Column Queue Columns */}
      <View className="flex-1 flex-row">
        {renderQueue('1. New Incoming Tickets', 'QUEUED', '#6366f1')}
        {renderQueue('2. In Cooking Prep', 'PREPARING', '#f59e0b')}
        {renderQueue('3. Ready for Service / Dispatch', 'READY', '#10b981')}
      </View>
    </View>
  );
}
