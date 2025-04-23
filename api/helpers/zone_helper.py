from typing import Dict, List
from ..config import supabase

class ZoneHelper:
    @staticmethod
    def get_all_zones() -> List[Dict]:
        """Get all zones"""
        response = supabase.table("Zone").select("*").execute()
        return response.data
    
    @staticmethod
    def get_zones_by_event(event_id: int) -> List[Dict]:
        """Get all zones for a specific event"""
        response = supabase.table("Zone").select("*").eq("EvenementId", event_id).execute()
        return response.data
    
    @staticmethod
    def get_zone_by_id(zone_id: int) -> Dict:
        """Get a specific zone by ID"""
        response = supabase.table("Zone").select("*").eq("Id", zone_id).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def create_zone(breedte: float, lengte: float, naam: str, evenement_id: int) -> Dict:
        """Create a new zone"""
        zone_data = {
            "breedte": breedte,
            "lengte": lengte,
            "naam": naam,
            "EvenementId": evenement_id
        }
        response = supabase.table("Zone").insert(zone_data).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def update_zone(zone_id: int, **kwargs) -> Dict:
        """Update an existing zone"""
        response = supabase.table("Zone").update(kwargs).eq("Id", zone_id).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def delete_zone(zone_id: int) -> bool:
        """Delete a zone"""
        response = supabase.table("Zone").delete().eq("Id", zone_id).execute()
        return len(response.data) > 0