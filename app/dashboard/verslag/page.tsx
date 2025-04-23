"use client";

import { useEffect, useState } from "react";
import { Verslag } from "@/app/types";
import { VerslagList } from "@/components/dashboard/verslag/verslag-list";
import { Button } from "@/components/ui/button";
import { AddVerslagDialog } from "@/components/dashboard/verslag/add-verslag-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


async function getVerslagen(): Promise<Verslag[]> {
  console.log('Fetching verslagen...');
  
  try {
    const response = await fetch('https://drone.ziasvannes.tech/api/verslagen', {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch verslagen: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      throw new Error(`Expected JSON but received ${contentType}`);
    }

    const data = await response.json();
    console.log('Fetched verslagen:', data);
    return data as Verslag[];
    
  } catch (error) {
    console.error('Error fetching verslagen:', error);
    throw error;
  }
}

export default function VerslagPage() {
  const [verslagen, setVerslagen] = useState<Verslag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVerslagen = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getVerslagen();
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }
        
        setVerslagen(data);
      } catch (err) {
        console.error('Error in loadVerslagen:', err);
        setError(err instanceof Error ? err.message : 'Failed to load verslagen');
      } finally {
        setLoading(false);
      }
    };

    loadVerslagen();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading verslagen...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 font-semibold">Error loading verslagen</p>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Verslagen</CardTitle>
              <CardDescription>
                Overzicht van alle verslagen ({verslagen.length})
              </CardDescription>
            </div>
            <AddVerslagDialog />
          </div>
        </CardHeader>
        <CardContent>
          <VerslagList verslagen={verslagen} />
        </CardContent>
      </Card>
    </div>
  );
}