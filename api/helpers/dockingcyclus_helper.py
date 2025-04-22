from typing import Dict, List
from config import supabase

class DockingCyclusHelper:
    @staticmethod
    def get_all_docking_cycli() -> List[Dict]:
        """Get all docking cycles"""
        response = supabase.table("DockingCyclus").select("*").execute()
        return response.data
    
    @staticmethod
    def get_docking_cyclus_by_id(docking_cyclus_id: int) -> Dict:
        """Get a specific docking cycle by ID"""
        response = supabase.table("DockingCyclus").select("*").eq("Id", docking_cyclus_id).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def get_docking_cycli_by_drone(drone_id: int) -> List[Dict]:
        """Get all docking cycles for a specific drone"""
        response = supabase.table("DockingCyclus").select("*").eq("DroneId", drone_id).execute()
        return response.data
    
    @staticmethod
    def get_docking_cycli_by_docking(docking_id: int) -> List[Dict]:
        """Get all docking cycles for a specific docking station"""
        response = supabase.table("DockingCyclus").select("*").eq("DockingId", docking_id).execute()
        return response.data
    
    @staticmethod
    def create_docking_cyclus(drone_id: int, docking_id: int, cyclus_id: int) -> Dict:
        """Create a new docking cycle"""
        docking_cyclus_data = {
            "DroneId": drone_id,
            "DockingId": docking_id,
            "CyclusId": cyclus_id
        }
        response = supabase.table("DockingCyclus").insert(docking_cyclus_data).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def update_docking_cyclus(docking_cyclus_id: int, **kwargs) -> Dict:
        """Update an existing docking cycle"""
        response = supabase.table("DockingCyclus").update(kwargs).eq("Id", docking_cyclus_id).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def delete_docking_cyclus(docking_cyclus_id: int) -> bool:
        """Delete a docking cycle"""
        response = supabase.table("DockingCyclus").delete().eq("Id", docking_cyclus_id).execute()
        return len(response.data) > 0