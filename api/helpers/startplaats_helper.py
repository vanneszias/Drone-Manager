from typing import Dict, List
from ..config import supabase

class StartplaatsHelper:
    @staticmethod
    def get_all_startplaatsen() -> List[Dict]:
        """Get all starting places"""
        response = supabase.table("Startplaats").select("*").execute()
        return response.data
    
    @staticmethod
    def get_available_startplaatsen() -> List[Dict]:
        """Get all available starting places"""
        response = supabase.table("Startplaats").select("*").eq("isbeschikbaar", True).execute()
        return response.data
    
    @staticmethod
    def get_startplaats_by_id(startplaats_id: int) -> Dict:
        """Get a specific starting place by ID"""
        response = supabase.table("Startplaats").select("*").eq("Id", startplaats_id).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def create_startplaats(locatie: str, is_beschikbaar: bool = True) -> Dict:
        """Create a new starting place"""
        startplaats_data = {
            "locatie": locatie,
            "isbeschikbaar": is_beschikbaar
        }
        response = supabase.table("Startplaats").insert(startplaats_data).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def update_startplaats(startplaats_id: int, **kwargs) -> Dict:
        """Update an existing starting place"""
        response = supabase.table("Startplaats").update(kwargs).eq("Id", startplaats_id).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def delete_startplaats(startplaats_id: int) -> bool:
        """Delete a starting place"""
        response = supabase.table("Startplaats").delete().eq("Id", startplaats_id).execute()
        return len(response.data) > 0