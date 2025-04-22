from typing import Dict, List
from config import supabase

class DroneHelper:
    @staticmethod
    def get_all_drones() -> List[Dict]:
        """Get all drones"""
        response = supabase.table("Drone").select("*").execute()
        return response.data
    
    @staticmethod
    def get_drone_by_id(drone_id: int) -> Dict:
        """Get a specific drone by ID"""
        response = supabase.table("Drone").select("*").eq("Id", drone_id).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def get_available_drones() -> List[Dict]:
        """Get all available drones"""
        response = supabase.table("Drone").select("*").eq("status", "AVAILABLE").execute()
        return response.data
    
    @staticmethod
    def get_flight_ready_drones() -> List[Dict]:
        """Get all drones that are ready to fly"""
        response = supabase.table("Drone").select("*").eq("status", "AVAILABLE").eq("magOpstijgen", True).execute()
        return response.data
    
    @staticmethod
    def create_drone(status: str, batterij: int, mag_opstijgen: bool = False) -> Dict:
        """Create a new drone"""
        drone_data = {
            "status": status,
            "batterij": batterij,
            "magOpstijgen": mag_opstijgen
        }
        response = supabase.table("Drone").insert(drone_data).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def update_drone(drone_id: int, **kwargs) -> Dict:
        """Update an existing drone"""
        response = supabase.table("Drone").update(kwargs).eq("Id", drone_id).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def delete_drone(drone_id: int) -> bool:
        """Delete a drone"""
        response = supabase.table("Drone").delete().eq("Id", drone_id).execute()
        return len(response.data) > 0