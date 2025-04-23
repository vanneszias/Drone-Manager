from typing import Dict, List, Optional
from ..config import supabase
import logging

logger = logging.getLogger(__name__)

class DroneHelper:
    TABLE_NAME = "Drone"
    VALID_STATUSES = ['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'OFFLINE']

    @staticmethod
    def get_all_drones() -> List[Dict]:
        """Get all drones"""
        try:
            response = supabase.table(DroneHelper.TABLE_NAME).select("*").execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching all drones: {e}")
            raise

    @staticmethod
    def get_drone_by_id(drone_id: int) -> Optional[Dict]:
        """Get a specific drone by ID"""
        try:
            response = supabase.table(DroneHelper.TABLE_NAME).select("*").eq("Id", drone_id).limit(1).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error fetching drone {drone_id}: {e}")
            raise

    @staticmethod
    def get_available_drones() -> List[Dict]:
        """Get all available drones"""
        try:
            response = supabase.table(DroneHelper.TABLE_NAME).select("*").eq("status", "AVAILABLE").execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching available drones: {e}")
            raise

    @staticmethod
    def get_flight_ready_drones() -> List[Dict]:
        """Get all drones that are ready to fly"""
        try:
            response = supabase.table(DroneHelper.TABLE_NAME).select("*").eq("status", "AVAILABLE").eq("magOpstijgen", True).execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching flight ready drones: {e}")
            raise

    @staticmethod
    def create_drone(status: str, batterij: int, mag_opstijgen: bool = False) -> Optional[Dict]:
        """Create a new drone"""
        if status not in DroneHelper.VALID_STATUSES:
             raise ValueError(f"Invalid status '{status}'. Must be one of: {', '.join(DroneHelper.VALID_STATUSES)}")
        if not (0 <= batterij <= 100):
            raise ValueError("Battery level (batterij) must be between 0 and 100")

        drone_data = {
            "status": status,
            "batterij": batterij,
            "magOpstijgen": mag_opstijgen
        }
        try:
            response = supabase.table(DroneHelper.TABLE_NAME).insert(drone_data).execute()
            if response.data:
                return response.data[0]
            else:
                if hasattr(response, 'error') and response.error:
                    logger.error(f"Supabase create drone error: {response.error.message}")
                else:
                    logger.error("Supabase create drone failed, no data returned.")
                return None
        except Exception as e:
            logger.error(f"Error creating drone with data {drone_data}: {e}")
            raise

    @staticmethod
    def update_drone(drone_id: int, **kwargs) -> Optional[Dict]:
        """Update an existing drone. Expects kwargs with DB column names."""
        if not kwargs: return None

        if 'status' in kwargs and kwargs['status'] not in DroneHelper.VALID_STATUSES:
            raise ValueError(f"Invalid status '{kwargs['status']}'. Must be one of: {', '.join(DroneHelper.VALID_STATUSES)}")
        if 'batterij' in kwargs and not (0 <= int(kwargs['batterij']) <= 100):
            raise ValueError("Battery level (batterij) must be between 0 and 100")
        if 'magOpstijgen' in kwargs and not isinstance(kwargs['magOpstijgen'], bool):
             raise ValueError("magOpstijgen must be a boolean")

        try:
            response = supabase.table(DroneHelper.TABLE_NAME).update(kwargs).eq("Id", drone_id).execute()
            if response.data:
                return response.data[0]
            else:
                existing = DroneHelper.get_drone_by_id(drone_id)
                if not existing: return None # Not found
                if hasattr(response, 'error') and response.error:
                    logger.error(f"Supabase update drone {drone_id} error: {response.error.message}")
                else:
                    logger.error(f"Supabase update drone {drone_id} failed.")
                return None
        except Exception as e:
            logger.error(f"Error updating drone {drone_id} with data {kwargs}: {e}")
            raise

    @staticmethod
    def delete_drone(drone_id: int) -> bool:
        """Delete a drone"""
        try:
            existing = DroneHelper.get_drone_by_id(drone_id)
            if not existing: return False

            response = supabase.table(DroneHelper.TABLE_NAME).delete().eq("Id", drone_id).execute()
            if hasattr(response, 'error') and response.error:
                logger.error(f"Supabase delete drone {drone_id} error: {response.error.message}")
                raise Exception(f"Supabase delete drone error: {response.error.message}")
            # Check VluchtCyclus/DockingCyclus FKs
            return True
        except Exception as e:
            if "violates foreign key constraint" in str(e): # Add specific FK names if needed
                 logger.error(f"Cannot delete Drone {drone_id} as it's referenced by VluchtCyclus or DockingCyclus.")
                 # Determine which FK is causing the issue if possible
                 fkey_map = {
                     '"fk_dockingcyclus_drone"': 'DockingCyclus',
                     '"fk_vluchtcyclus_drone"': 'VluchtCyclus' # Guessing constraint names
                 }
                 ref_table = "related records"
                 for fk, table in fkey_map.items():
                     if fk in str(e):
                         ref_table = table
                         break
                 raise ValueError(f"Cannot delete Drone {drone_id} as it is currently referenced in {ref_table}.") # For 409 Conflict
            logger.error(f"Error deleting drone {drone_id}: {e}")
            raise
