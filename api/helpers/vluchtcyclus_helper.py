from typing import Dict, List, Optional
from ..config import supabase

class VluchtCyclusHelper:
    @staticmethod
    def get_all_vlucht_cycli() -> List[Dict]:
        """Get all flight cycles"""
        response = supabase.table("VluchtCyclus").select("*").execute()
        return response.data
    
    @staticmethod
    def get_vlucht_cyclus_by_id(vlucht_cyclus_id: int) -> Dict:
        """Get a specific flight cycle by ID"""
        response = supabase.table("VluchtCyclus").select("*").eq("Id", vlucht_cyclus_id).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def get_vlucht_cycli_by_drone(drone_id: int) -> List[Dict]:
        """Get all flight cycles for a specific drone"""
        response = supabase.table("VluchtCyclus").select("*").eq("DroneId", drone_id).execute()
        return response.data
    
    @staticmethod
    def get_vlucht_cycli_by_zone(zone_id: int) -> List[Dict]:
        """Get all flight cycles for a specific zone"""
        response = supabase.table("VluchtCyclus").select("*").eq("ZoneId", zone_id).execute()
        return response.data
    
    @staticmethod
    def create_vlucht_cyclus(verslag_id: Optional[int] = None, plaats_id: Optional[int] = None, 
                          drone_id: Optional[int] = None, zone_id: Optional[int] = None) -> Dict:
        """Create a new flight cycle"""
        vlucht_cyclus_data = {}
        
        if verslag_id:
            vlucht_cyclus_data["VerslagId"] = verslag_id
        if plaats_id:
            vlucht_cyclus_data["PlaatsId"] = plaats_id
        if drone_id:
            vlucht_cyclus_data["DroneId"] = drone_id
        if zone_id:
            vlucht_cyclus_data["ZoneId"] = zone_id
            
        response = supabase.table("VluchtCyclus").insert(vlucht_cyclus_data).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def update_vlucht_cyclus(vlucht_cyclus_id: int, **kwargs) -> Dict:
        """Update an existing flight cycle"""
        response = supabase.table("VluchtCyclus").update(kwargs).eq("Id", vlucht_cyclus_id).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def delete_vlucht_cyclus(vlucht_cyclus_id: int) -> bool:
        """Delete a flight cycle"""
        response = supabase.table("VluchtCyclus").delete().eq("Id", vlucht_cyclus_id).execute()
        return len(response.data) > 0