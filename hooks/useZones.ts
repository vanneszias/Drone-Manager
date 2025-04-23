"use client";

import { useState, useEffect } from 'react';
import { Zone } from '@/app/types';

// Dit is een client-side helper die functies biedt voor het werken met zones
const useZones = {
  // Hulpfuncties voor UI
  getTypeBadgeVariant: (type: Zone['type']) => {
    const variants = {
      'RESTRICTED': 'bg-amber-100 text-amber-800 hover:bg-amber-200/80',
      'NO_FLY': 'bg-red-100 text-red-800 hover:bg-red-200/80',
      'LANDING': 'bg-blue-100 text-blue-800 hover:bg-blue-200/80',
      'OPERATIONAL': 'bg-green-100 text-green-800 hover:bg-green-200/80',
    };
    return variants[type] || 'bg-gray-100 text-gray-800 hover:bg-gray-200/80';
  },
  
  getStatusBadgeVariant: (status: Zone['status']) => {
    const variants = {
      'ACTIVE': 'bg-green-100 text-green-800 hover:bg-green-200/80',
      'INACTIVE': 'bg-gray-100 text-gray-800 hover:bg-gray-200/80',
      'MAINTENANCE': 'bg-amber-100 text-amber-800 hover:bg-amber-200/80',
    };
    return variants[status] || 'bg-gray-100 text-gray-800 hover:bg-gray-200/80';
  },

  // Actions
  handleAddZone: async (
    zoneData: Zone, 
    setIsLoading: (loading: boolean) => void,
    setError: (error: string | null) => void,
    setIsOpen: (open: boolean) => void,
    setFormData: (data: Partial<Zone>) => void
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(zoneData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add zone');
      }
      
      // Reset & close form
      setFormData({
        name: '',
        type: 'RESTRICTED',
        status: 'ACTIVE',
      });
      setIsOpen(false);
      
      // Optionally refresh the data
      // You might want to use SWR or React Query for better data fetching
      window.location.reload();
    } catch (error) {
      console.error("Error adding zone:", error);
      setError(error instanceof Error ? error.message : "Failed to add zone");
    } finally {
      setIsLoading(false);
    }
  },

  handleDelete: async (id: string) => {
    if (confirm('Are you sure you want to delete this zone?')) {
      try {
        const response = await fetch(`/api/zones/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete zone');
        }

        
        // Refresh the page to show updated list
        window.location.reload();
      } catch (error) {
        console.error("Error deleting zone:", error);
      }
    }
  },
};

export default useZones;