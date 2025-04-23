from typing import Dict, List, Optional
from ..config import supabase
import logging

logger = logging.getLogger(__name__)

class DockingHelper:
    TABLE_NAME = "Docking"

    @staticmethod
    def get_all_dockings() -> List[Dict]:
        """Get all docking stations"""
        try:
            response = supabase.table(DockingHelper.TABLE_NAME).select("*").execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching all dockings: {e}")
            raise

    @staticmethod
    def get_available_dockings() -> List[Dict]:
        """Get all available docking stations"""
        try:
            response = supabase.table(DockingHelper.TABLE_NAME).select("*").eq("isbeschikbaar", True).execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching available dockings: {e}")
            raise

    @staticmethod
    def get_docking_by_id(docking_id: int) -> Optional[Dict]:
        """Get a specific docking station by ID"""
        try:
            response = supabase.table(DockingHelper.TABLE_NAME).select("*").eq("Id", docking_id).limit(1).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error fetching docking {docking_id}: {e}")
            raise

    @staticmethod
    def create_docking(locatie: str, is_beschikbaar: bool = True) -> Optional[Dict]:
        """Create a new docking station"""
        if not locatie or not locatie.strip():
             raise ValueError("Docking location (locatie) cannot be empty")

        docking_data = {
            "locatie": locatie.strip(),
            "isbeschikbaar": is_beschikbaar
        }
        try:
            response = supabase.table(DockingHelper.TABLE_NAME).insert(docking_data).execute()
            if response.data:
                return response.data[0]
            else:
                if hasattr(response, 'error') and response.error:
                    logger.error(f"Supabase create docking error: {response.error.message}")
                else:
                    logger.error("Supabase create docking failed, no data returned.")
                return None
        except Exception as e:
            logger.error(f"Error creating docking with data {docking_data}: {e}")
            raise

    @staticmethod
    def update_docking(docking_id: int, **kwargs) -> Optional[Dict]:
        """Update an existing docking station. Expects kwargs with DB column names."""
        if not kwargs: return None

        if 'locatie' in kwargs and (not kwargs['locatie'] or not str(kwargs['locatie']).strip()):
             raise ValueError("Docking location (locatie) cannot be empty")
        if 'isbeschikbaar' in kwargs and not isinstance(kwargs['isbeschikbaar'], bool):
             raise ValueError("isbeschikbaar must be a boolean")

        try:
            response = supabase.table(DockingHelper.TABLE_NAME).update(kwargs).eq("Id", docking_id).execute()
            if response.data:
                return response.data[0]
            else:
                existing = DockingHelper.get_docking_by_id(docking_id)
                if not existing: return None # Not found
                if hasattr(response, 'error') and response.error:
                    logger.error(f"Supabase update docking {docking_id} error: {response.error.message}")
                else:
                    logger.error(f"Supabase update docking {docking_id} failed.")
                return None
        except Exception as e:
            logger.error(f"Error updating docking {docking_id} with data {kwargs}: {e}")
            raise

    @staticmethod
    def delete_docking(docking_id: int) -> bool:
        """Delete a docking station"""
        try:
            existing = DockingHelper.get_docking_by_id(docking_id)
            if not existing: return False

            response = supabase.table(DockingHelper.TABLE_NAME).delete().eq("Id", docking_id).execute()
            if hasattr(response, 'error') and response.error:
                logger.error(f"Supabase delete docking {docking_id} error: {response.error.message}")
                raise Exception(f"Supabase delete docking error: {response.error.message}")
            # Check DockingCyclus FKs
            return True
        except Exception as e:
            if "violates foreign key constraint" in str(e): # Add specific FK name if needed
                 logger.error(f"Cannot delete Docking {docking_id} as it's referenced by DockingCyclus.")
                 raise ValueError(f"Cannot delete Docking {docking_id} as it is currently in use.") # For 409 Conflict
            logger.error(f"Error deleting docking {docking_id}: {e}")
            raise
