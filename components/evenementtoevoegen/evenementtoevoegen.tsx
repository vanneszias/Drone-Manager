"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

interface FormData {
  naam: string;
  startDatum: string;
  eindDatum: string;
  startTijd: string;
  tijdsduur: string;
}

const EvenementToevoegen = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    naam: '',
    startDatum: '',
    eindDatum: '',
    startTijd: '',
    tijdsduur: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          naam: formData.naam,
          start_datum: formData.startDatum,
          eind_datum: formData.eindDatum,
          start_tijd: formData.startTijd,
          tijdsduur: formData.tijdsduur
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add event');
      }

      router.push('/home');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="w-full min-h-screen py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6 mx-auto max-w-2xl">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Nieuw Evenement Toevoegen
          </h1>
          
          {error && (
            <div className="w-full p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4 mt-8">
            <div className="space-y-2">
              <label htmlFor="naam" className="text-sm font-medium leading-none">
                Naam Evenement
              </label>
              <input
                type="text"
                id="naam"
                name="naam"
                value={formData.naam}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="startDatum" className="text-sm font-medium leading-none">
                  Start Datum
                </label>
                <input
                  type="date"
                  id="startDatum"
                  name="startDatum"
                  value={formData.startDatum}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="startTijd" className="text-sm font-medium leading-none">
                  Start Tijd
                </label>
                <input
                  type="time"
                  id="startTijd"
                  name="startTijd"
                  value={formData.startTijd}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="eindDatum" className="text-sm font-medium leading-none">
                  Eind Datum
                </label>
                <input
                  type="date"
                  id="eindDatum"
                  name="eindDatum"
                  value={formData.eindDatum}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="tijdsduur" className="text-sm font-medium leading-none">
                  Tijdsduur
                </label>
                <input
                  type="time"
                  id="tijdsduur"
                  name="tijdsduur"
                  value={formData.tijdsduur}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex gap-4 justify-end mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/home')}
                disabled={isSubmitting}
              >
                Annuleren
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Toevoegen...' : 'Toevoegen'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EvenementToevoegen;