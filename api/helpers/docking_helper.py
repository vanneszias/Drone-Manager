from typing import Dict, List
from config import supabase

class DockingHelper:
    @staticmethod
    def get_all_dockings() -> List[Dict]:
        """Get all docking stations"""
        response = supabase.table("Docking").select("*").execute()
        return response.data
    
    @staticmethod
    def get_available_dockings() -> List[Dict]:
        """Get all available docking stations"""
        response = supabase.table("Docking").select("*").eq("isbeschikbaar", True).execute()
        return response.data
    
    @staticmethod
    def get_docking_by_id(docking_id: int) -> Dict:
        """Get a specific docking station by ID"""
        response = supabase.table("Docking").select("*").eq("Id", docking_id).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def create_docking(locatie: str, is_beschikbaar: bool = True) -> Dict:
        """Create a new docking station"""
        docking_data = {
            "locatie": locatie,
            "isbeschikbaar": is_beschikbaar
        }
        response = supabase.table("Docking").insert(docking_data).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def update_docking(docking_id: int, **kwargs) -> Dict:
        """Update an existing docking station"""
        response = supabase.table("Docking").update(kwargs).eq("Id", docking_id).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def delete_docking(docking_id: int) -> bool:
        """Delete a docking station"""
        response = supabase.table("Docking").delete().eq("Id", docking_id).execute()
        return len(response.data) > 0