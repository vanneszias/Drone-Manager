from typing import Dict, List, Optional
from ..config import supabase
import logging

logger = logging.getLogger(__name__)

class VluchtCyclusHelper:
    TABLE_NAME = "VluchtCyclus"

    @staticmethod
    def get_all_vlucht_cycli() -> List[Dict]:
        """Get all flight cycles"""
        try:
            response = supabase.table(VluchtCyclusHelper.TABLE_NAME).select("*").execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching all vlucht cycli: {e}")
            raise

    @staticmethod
    def get_vlucht_cyclus_by_id(vlucht_cyclus_id: int) -> Optional[Dict]:
        """Get a specific flight cycle by ID"""
        try:
            response = supabase.table(VluchtCyclusHelper.TABLE_NAME).select("*").eq("Id", vlucht_cyclus_id).limit(1).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error fetching vlucht cyclus {vlucht_cyclus_id}: {e}")
            raise

    @staticmethod
    def get_vlucht_cycli_by_drone(drone_id: int) -> List[Dict]:
        """Get all flight cycles for a specific drone"""
        try:
            response = supabase.table(VluchtCyclusHelper.TABLE_NAME).select("*").eq("DroneId", drone_id).execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching vlucht cycli for drone {drone_id}: {e}")
            raise

    @staticmethod
    def get_vlucht_cycli_by_zone(zone_id: int) -> List[Dict]:
        """Get all flight cycles for a specific zone"""
        try:
            response = supabase.table(VluchtCyclusHelper.TABLE_NAME).select("*").eq("ZoneId", zone_id).execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching vlucht cycli for zone {zone_id}: {e}")
            raise

    # Add helpers for other FKs if needed (PlaatsId, VerslagId)

    @staticmethod
    def create_vlucht_cyclus(verslag_id: Optional[int] = None, plaats_id: Optional[int] = None,
                          drone_id: Optional[int] = None, zone_id: Optional[int] = None) -> Optional[Dict]:
        """Create a new flight cycle. All FKs are optional."""
        vlucht_cyclus_data = {
            # Map to DB column names, handle None correctly
            "VerslagId": verslag_id,
            "PlaatsId": plaats_id,
            "DroneId": drone_id,
            "ZoneId": zone_id
        }
        # Remove keys with None values if Supabase client requires it,
        # although usually it handles None for nullable columns.
        vlucht_cyclus_data = {k: v for k, v in vlucht_cyclus_data.items() if v is not None}

        if not vlucht_cyclus_data:
            # Or maybe allow creating an empty record? Depends on business logic.
             raise ValueError("Cannot create VluchtCyclus with no associated IDs.")

        try:
            response = supabase.table(VluchtCyclusHelper.TABLE_NAME).insert(vlucht_cyclus_data).execute()
            if response.data:
                return response.data[0]
            else:
                if hasattr(response, 'error') and response.error:
                    logger.error(f"Supabase create vlucht cyclus error: {response.error.message}")
                    # Check for FK violations
                    if "foreign key constraint" in response.error.message:
                         # Identify which FK failed if possible from the error message
                         raise ValueError(f"Invalid reference ID provided (e.g., DroneId, ZoneId does not exist).")
                else:
                    logger.error("Supabase create vlucht cyclus failed, no data returned.")
                return None
        except Exception as e:
            if "violates foreign key constraint" in str(e):
                 logger.warning(f"Create VluchtCyclus failed due to invalid FK in data {vlucht_cyclus_data}")
                 raise ValueError(f"Invalid reference ID provided (e.g., DroneId, ZoneId does not exist).")
            logger.error(f"Error creating vlucht cyclus with data {vlucht_cyclus_data}: {e}")
            raise

    @staticmethod
    def update_vlucht_cyclus(vlucht_cyclus_id: int, **kwargs) -> Optional[Dict]:
        """Update an existing flight cycle. Expects kwargs with DB column names."""
        if not kwargs: return None

        # Handle None values correctly for nullable FKs
        update_data = {}
        for key in ["VerslagId", "PlaatsId", "DroneId", "ZoneId"]:
             if key in kwargs:
                 update_data[key] = kwargs[key] # Already correct type (int or None) from app.py

        if not update_data:
            raise ValueError("No valid fields provided for VluchtCyclus update.")

        try:
            response = supabase.table(VluchtCyclusHelper.TABLE_NAME).update(update_data).eq("Id", vlucht_cyclus_id).execute()
            if response.data:
                return response.data[0]
            else:
                existing = VluchtCyclusHelper.get_vlucht_cyclus_by_id(vlucht_cyclus_id)
                if not existing: return None # Not found
                if hasattr(response, 'error') and response.error:
                    logger.error(f"Supabase update vlucht cyclus {vlucht_cyclus_id} error: {response.error.message}")
                    if "foreign key constraint" in response.error.message:
                         raise ValueError(f"Invalid reference ID provided in update.")
                else:
                    logger.error(f"Supabase update vlucht cyclus {vlucht_cyclus_id} failed.")
                return None
        except Exception as e:
            if "violates foreign key constraint" in str(e):
                 logger.warning(f"Update VluchtCyclus {vlucht_cyclus_id} failed due to invalid FK in data {update_data}")
                 raise ValueError(f"Invalid reference ID provided in update.")
            logger.error(f"Error updating vlucht cyclus {vlucht_cyclus_id} with data {update_data}: {e}")
            raise

    @staticmethod
    def delete_vlucht_cyclus(vlucht_cyclus_id: int) -> bool:
        """Delete a flight cycle"""
        try:
            existing = VluchtCyclusHelper.get_vlucht_cyclus_by_id(vlucht_cyclus_id)
            if not existing: return False

            # Check constraints BEFORE deleting
            # 1. Verslag.VluchtCyclusId has ON DELETE SET NULL - OK
            # 2. Cyclus.VluchtCyclusId has no ON DELETE - This will likely BLOCK deletion if referenced. Check first.
            ref_cyclus_response = supabase.table("Cyclus").select("Id").eq("VluchtCyclusId", vlucht_cyclus_id).limit(1).execute()
            if ref_cyclus_response.data:
                 logger.warning(f"Attempted to delete VluchtCyclus {vlucht_cyclus_id} which is referenced by Cyclus {ref_cyclus_response.data[0]['Id']}")
                 raise ValueError(f"Cannot delete VluchtCyclus {vlucht_cyclus_id} as it is referenced by Cyclus.") # For 409 Conflict

            response = supabase.table(VluchtCyclusHelper.TABLE_NAME).delete().eq("Id", vlucht_cyclus_id).execute()
            if hasattr(response, 'error') and response.error:
                logger.error(f"Supabase delete vlucht cyclus {vlucht_cyclus_id} error: {response.error.message}")
                raise Exception(f"Supabase delete vlucht cyclus error: {response.error.message}")
            return True
        except ValueError: # Re-raise specific error for 409
            raise
        except Exception as e:
            # Catch unexpected FK violations
            logger.error(f"Error deleting vlucht cyclus {vlucht_cyclus_id}: {e}")
            raise
