from typing import Dict, List, Optional
from datetime import time
from ..config import supabase
import logging

logger = logging.getLogger(__name__)

class CyclusHelper:
    TABLE_NAME = "Cyclus"

    @staticmethod
    def get_all_cycli() -> List[Dict]:
        """Get all cycles"""
        try:
            response = supabase.table(CyclusHelper.TABLE_NAME).select("*").execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching all cycli: {e}")
            raise

    @staticmethod
    def get_cyclus_by_id(cyclus_id: int) -> Optional[Dict]:
        """Get a specific cycle by ID"""
        try:
            response = supabase.table(CyclusHelper.TABLE_NAME).select("*").eq("Id", cyclus_id).limit(1).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error fetching cyclus {cyclus_id}: {e}")
            raise

    @staticmethod
    def get_cycli_by_vlucht_cyclus(vlucht_cyclus_id: int) -> List[Dict]:
        """Get cycles associated with a specific VluchtCyclus"""
        try:
            response = supabase.table(CyclusHelper.TABLE_NAME).select("*").eq("VluchtCyclusId", vlucht_cyclus_id).execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching cycli for VluchtCyclus {vlucht_cyclus_id}: {e}")
            raise

    @staticmethod
    def create_cyclus(startuur: time, tijdstip: time, vlucht_cyclus_id: Optional[int] = None) -> Optional[Dict]:
        """Create a new cycle"""
        cyclus_data = {
            "startuur": startuur.isoformat(),
            "tijdstip": tijdstip.isoformat(),
            "VluchtCyclusId": vlucht_cyclus_id # Handles None correctly
        }

        try:
            response = supabase.table(CyclusHelper.TABLE_NAME).insert(cyclus_data).execute()
            if response.data:
                return response.data[0]
            else:
                if hasattr(response, 'error') and response.error:
                    logger.error(f"Supabase create cyclus error: {response.error.message}")
                    if "foreign key constraint" in response.error.message and '"fk_cyclus_vluchtcyclus"' in response.error.message:
                         raise ValueError(f"Invalid VluchtCyclusId: {vlucht_cyclus_id} does not exist.")
                else:
                    logger.error("Supabase create cyclus failed, no data returned.")
                return None
        except Exception as e:
            if "violates foreign key constraint" in str(e) and '"fk_cyclus_vluchtcyclus"' in str(e):
                 logger.warning(f"Attempted to create cyclus with non-existent VluchtCyclusId {vlucht_cyclus_id}")
                 raise ValueError(f"Invalid VluchtCyclusId: {vlucht_cyclus_id} does not exist.")
            logger.error(f"Error creating cyclus with data {cyclus_data}: {e}")
            raise

    @staticmethod
    def update_cyclus(cyclus_id: int, **kwargs) -> Optional[Dict]:
        """Update an existing cycle. Expects kwargs with DB column names."""
        if not kwargs: return None

        # Convert time objects to ISO format strings if they are passed as time objects
        update_data = {}
        for key, value in kwargs.items():
            if isinstance(value, time):
                update_data[key] = value.isoformat()
            else:
                 update_data[key] = value # Assume other values (like VluchtCyclusId) are already correct type

        # Handle VluchtCyclusId = None correctly
        if "VluchtCyclusId" in update_data and update_data["VluchtCyclusId"] is None:
            pass # Client should handle setting NULL

        try:
            response = supabase.table(CyclusHelper.TABLE_NAME).update(update_data).eq("Id", cyclus_id).execute()
            if response.data:
                return response.data[0]
            else:
                existing = CyclusHelper.get_cyclus_by_id(cyclus_id)
                if not existing: return None # Not found
                if hasattr(response, 'error') and response.error:
                    logger.error(f"Supabase update cyclus {cyclus_id} error: {response.error.message}")
                    if "foreign key constraint" in response.error.message and '"fk_cyclus_vluchtcyclus"' in response.error.message:
                         raise ValueError(f"Invalid VluchtCyclusId provided in update.")
                else:
                    logger.error(f"Supabase update cyclus {cyclus_id} failed.")
                return None
        except Exception as e:
            if "violates foreign key constraint" in str(e) and '"fk_cyclus_vluchtcyclus"' in str(e):
                 logger.warning(f"Update cyclus {cyclus_id} failed due to invalid VluchtCyclusId in data {update_data}")
                 raise ValueError(f"Invalid VluchtCyclusId provided in update.")
            logger.error(f"Error updating cyclus {cyclus_id} with data {update_data}: {e}")
            raise

    @staticmethod
    def delete_cyclus(cyclus_id: int) -> bool:
        """Delete a cycle. Returns True if successful, False otherwise."""
        try:
            existing = CyclusHelper.get_cyclus_by_id(cyclus_id)
            if not existing: return False

            # Check if this Cyclus is referenced by DockingCyclus BEFORE deleting
            # Note: This assumes DockingCyclus doesn't have ON DELETE SET NULL/CASCADE for CyclusId
            ref_response = supabase.table("DockingCyclus").select("Id").eq("CyclusId", cyclus_id).limit(1).execute()
            if ref_response.data:
                 logger.warning(f"Attempted to delete Cyclus {cyclus_id} which is referenced by DockingCyclus {ref_response.data[0]['Id']}")
                 raise ValueError(f"Cannot delete Cyclus {cyclus_id} as it is referenced by DockingCyclus.") # For 409 Conflict

            response = supabase.table(CyclusHelper.TABLE_NAME).delete().eq("Id", cyclus_id).execute()
            if hasattr(response, 'error') and response.error:
                logger.error(f"Supabase delete cyclus {cyclus_id} error: {response.error.message}")
                raise Exception(f"Supabase delete cyclus error: {response.error.message}")
            return True
        except ValueError: # Re-raise specific error for 409
             raise
        except Exception as e:
            # Catch other potential DB errors
            logger.error(f"Error deleting cyclus {cyclus_id}: {e}")
            raise
