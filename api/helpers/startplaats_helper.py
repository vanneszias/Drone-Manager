from typing import Dict, List, Optional
from ..config import supabase
import logging

logger = logging.getLogger(__name__)

class StartplaatsHelper:
    TABLE_NAME = "Startplaats"

    @staticmethod
    def get_all_startplaatsen() -> List[Dict]:
        """Get all starting places"""
        try:
            response = supabase.table(StartplaatsHelper.TABLE_NAME).select("*").execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching all startplaatsen: {e}")
            raise

    @staticmethod
    def get_available_startplaatsen() -> List[Dict]:
        """Get all available starting places"""
        try:
            response = supabase.table(StartplaatsHelper.TABLE_NAME).select("*").eq("isbeschikbaar", True).execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching available startplaatsen: {e}")
            raise

    @staticmethod
    def get_startplaats_by_id(startplaats_id: int) -> Optional[Dict]:
        """Get a specific starting place by ID"""
        try:
            response = supabase.table(StartplaatsHelper.TABLE_NAME).select("*").eq("Id", startplaats_id).limit(1).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error fetching startplaats {startplaats_id}: {e}")
            raise

    @staticmethod
    def create_startplaats(locatie: str, is_beschikbaar: bool = True) -> Optional[Dict]:
        """Create a new starting place"""
        if not locatie or not locatie.strip():
            raise ValueError("Startplaats location (locatie) cannot be empty")

        startplaats_data = {
            "locatie": locatie.strip(),
            "isbeschikbaar": is_beschikbaar
        }
        try:
            response = supabase.table(StartplaatsHelper.TABLE_NAME).insert(startplaats_data).execute()
            if response.data:
                return response.data[0]
            else:
                if hasattr(response, 'error') and response.error:
                    logger.error(f"Supabase create startplaats error: {response.error.message}")
                else:
                    logger.error("Supabase create startplaats failed, no data returned.")
                return None
        except Exception as e:
            logger.error(f"Error creating startplaats with data {startplaats_data}: {e}")
            raise

    @staticmethod
    def update_startplaats(startplaats_id: int, **kwargs) -> Optional[Dict]:
        """Update an existing starting place. Expects kwargs with DB column names."""
        if not kwargs:
            return None

        if 'locatie' in kwargs and (not kwargs['locatie'] or not str(kwargs['locatie']).strip()):
             raise ValueError("Startplaats location (locatie) cannot be empty")
        if 'isbeschikbaar' in kwargs and not isinstance(kwargs['isbeschikbaar'], bool):
             raise ValueError("isbeschikbaar must be a boolean")

        try:
            response = supabase.table(StartplaatsHelper.TABLE_NAME).update(kwargs).eq("Id", startplaats_id).execute()
            if response.data:
                return response.data[0]
            else:
                existing = StartplaatsHelper.get_startplaats_by_id(startplaats_id)
                if not existing: return None # Not found
                if hasattr(response, 'error') and response.error:
                    logger.error(f"Supabase update startplaats {startplaats_id} error: {response.error.message}")
                else:
                    logger.error(f"Supabase update startplaats {startplaats_id} failed.")
                return None
        except Exception as e:
            logger.error(f"Error updating startplaats {startplaats_id} with data {kwargs}: {e}")
            raise

    @staticmethod
    def delete_startplaats(startplaats_id: int) -> bool:
        """Delete a starting place"""
        try:
            existing = StartplaatsHelper.get_startplaats_by_id(startplaats_id)
            if not existing: return False

            response = supabase.table(StartplaatsHelper.TABLE_NAME).delete().eq("Id", startplaats_id).execute()
            if hasattr(response, 'error') and response.error:
                logger.error(f"Supabase delete startplaats {startplaats_id} error: {response.error.message}")
                raise Exception(f"Supabase delete startplaats error: {response.error.message}")
             # Check VluchtCyclus FK constraint behavior if needed (schema doesn't specify ON DELETE)
            return True
        except Exception as e:
            if "violates foreign key constraint" in str(e): # Add specific FK name if needed
                 logger.error(f"Cannot delete Startplaats {startplaats_id} as it's referenced by VluchtCyclus.")
                 raise ValueError(f"Cannot delete Startplaats {startplaats_id} as it is currently in use.") # For 409 Conflict
            logger.error(f"Error deleting startplaats {startplaats_id}: {e}")
            raise
