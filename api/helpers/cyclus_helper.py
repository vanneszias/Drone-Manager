from typing import Dict, List, Optional
from datetime import time
from ..config import supabase

class CyclusHelper:
    @staticmethod
    def get_all_cycli() -> List[Dict]:
        """Get all cycles"""
        response = supabase.table("Cyclus").select("*").execute()
        return response.data
    
    @staticmethod
    def get_cyclus_by_id(cyclus_id: int) -> Dict:
        """Get a specific cycle by ID"""
        response = supabase.table("Cyclus").select("*").eq("Id", cyclus_id).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def create_cyclus(startuur: time, tijdstip: time, vlucht_cyclus_id: Optional[int] = None) -> Dict:
        """Create a new cycle"""
        cyclus_data = {
            "startuur": startuur.isoformat(),
            "tijdstip": tijdstip.isoformat()
        }
        
        if vlucht_cyclus_id:
            cyclus_data["VluchtCyclusId"] = vlucht_cyclus_id
            
        response = supabase.table("Cyclus").insert(cyclus_data).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def update_cyclus(cyclus_id: int, **kwargs) -> Dict:
        """Update an existing cycle"""
        # Convert time objects to ISO format strings
        for key, value in kwargs.items():
            if isinstance(value, time):
                kwargs[key] = value.isoformat()
                
        response = supabase.table("Cyclus").update(kwargs).eq("Id", cyclus_id).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def delete_cyclus(cyclus_id: int) -> bool:
        """Delete a cycle"""
        response = supabase.table("Cyclus").delete().eq("Id", cyclus_id).execute()
        return len(response.data) > 0