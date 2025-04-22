from typing import Dict, List, Optional
from datetime import date, time
from config import supabase

class EvenementHelper:
    @staticmethod
    def get_all_events() -> List[Dict]:
        """Get all events from the database"""
        response = supabase.table("Evenement").select("*").execute()
        return response.data
    
    @staticmethod
    def get_event_by_id(event_id: int) -> Dict:
        """Get a specific event by ID"""
        response = supabase.table("Evenement").select("*").eq("Id", event_id).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def create_event(start_datum: date, eind_datum: date, start_tijd: time, 
                   tijdsduur: time, naam: str) -> Dict:
        """Create a new event"""
        event_data = {
            "StartDatum": start_datum.isoformat(),
            "EindDatum": eind_datum.isoformat(),
            "StartTijd": start_tijd.isoformat(),
            "Tijdsduur": tijdsduur.isoformat(),
            "Naam": naam
        }
        response = supabase.table("Evenement").insert(event_data).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def update_event(event_id: int, **kwargs) -> Dict:
        """Update an existing event"""
        # Convert date and time objects to ISO format strings
        for key, value in kwargs.items():
            if isinstance(value, (date, time)):
                kwargs[key] = value.isoformat()
                
        response = supabase.table("Evenement").update(kwargs).eq("Id", event_id).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def delete_event(event_id: int) -> bool:
        """Delete an event"""
        response = supabase.table("Evenement").delete().eq("Id", event_id).execute()
        return len(response.data) > 0