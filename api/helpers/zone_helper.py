from typing import Dict, List, Optional
from ..config import supabase
import logging

logger = logging.getLogger(__name__)

class ZoneHelper:
    TABLE_NAME = "Zone"

    @staticmethod
    def get_all_zones() -> List[Dict]:
        """Get all zones"""
        try:
            response = supabase.table(ZoneHelper.TABLE_NAME).select("*").execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching all zones: {e}")
            raise

    @staticmethod
    def get_zones_by_event(event_id: int) -> List[Dict]:
        """Get all zones for a specific event"""
        try:
            response = supabase.table(ZoneHelper.TABLE_NAME).select("*").eq("EvenementId", event_id).execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching zones for event {event_id}: {e}")
            raise

    @staticmethod
    def get_zone_by_id(zone_id: int) -> Optional[Dict]:
        """Get a specific zone by ID"""
        try:
            response = supabase.table(ZoneHelper.TABLE_NAME).select("*").eq("Id", zone_id).limit(1).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error fetching zone {zone_id}: {e}")
            raise

    @staticmethod
    def create_zone(breedte: float, lengte: float, naam: str, evenement_id: int) -> Optional[Dict]:
        """Create a new zone"""
        if not naam or not naam.strip():
            raise ValueError("Zone name (naam) cannot be empty")
        if breedte <= 0 or lengte <= 0:
             raise ValueError("Zone width (breedte) and length (lengte) must be positive")

        zone_data = {
            "breedte": breedte,
            "lengte": lengte,
            "naam": naam.strip(),
            "EvenementId": evenement_id # Uses DB column name
        }
        try:
            # Note: Supabase might throw an error automatically if EvenementId doesn't exist due to FK constraint
            response = supabase.table(ZoneHelper.TABLE_NAME).insert(zone_data).execute()
            if response.data:
                return response.data[0]
            else:
                if hasattr(response, 'error') and response.error:
                    logger.error(f"Supabase create zone error: {response.error.message}")
                    # Re-raise specific error type if possible (e.g., FK violation)
                    if "foreign key constraint" in response.error.message:
                         raise ValueError(f"Invalid EvenementId: {evenement_id} does not exist.")
                else:
                    logger.error("Supabase create zone failed, no data returned.")
                return None
        except Exception as e:
            # Catch DB errors here too
            if "violates foreign key constraint" in str(e) and '"Zone_EvenementId_fkey"' in str(e):
                 logger.warning(f"Attempted to create zone with non-existent EvenementId {evenement_id}")
                 raise ValueError(f"Invalid EvenementId: {evenement_id} does not exist.") # Raise specific error for 400
            logger.error(f"Error creating zone with data {zone_data}: {e}")
            raise

    @staticmethod
    def update_zone(zone_id: int, **kwargs) -> Optional[Dict]:
        """Update an existing zone. Expects kwargs with DB column names (PascalCase)."""
        if not kwargs:
            return None

        # Add validation for incoming data
        if 'naam' in kwargs and (not kwargs['naam'] or not str(kwargs['naam']).strip()):
            raise ValueError("Zone name (naam) cannot be empty")
        if 'breedte' in kwargs and float(kwargs['breedte']) <= 0:
             raise ValueError("Zone width (breedte) must be positive")
        if 'lengte' in kwargs and float(kwargs['lengte']) <= 0:
             raise ValueError("Zone length (lengte) must be positive")
        # EvenementId update validation might involve checking if the new ID exists
        # This could be done here or rely on DB constraint error

        try:
            response = supabase.table(ZoneHelper.TABLE_NAME).update(kwargs).eq("Id", zone_id).execute()
            if response.data:
                return response.data[0]
            else:
                existing = ZoneHelper.get_zone_by_id(zone_id)
                if not existing: return None # Not found
                if hasattr(response, 'error') and response.error:
                    logger.error(f"Supabase update zone {zone_id} error: {response.error.message}")
                    if "foreign key constraint" in response.error.message:
                         raise ValueError(f"Invalid EvenementId provided in update.")
                else:
                    logger.error(f"Supabase update zone {zone_id} failed.")
                return None
        except Exception as e:
            if "violates foreign key constraint" in str(e) and '"Zone_EvenementId_fkey"' in str(e):
                 logger.warning(f"Update zone {zone_id} failed due to invalid EvenementId in data {kwargs}")
                 raise ValueError(f"Invalid EvenementId provided in update.") # Raise specific error for 400
            logger.error(f"Error updating zone {zone_id} with data {kwargs}: {e}")
            raise

    @staticmethod
    def delete_zone(zone_id: int) -> bool:
        """Delete a zone"""
        try:
            existing = ZoneHelper.get_zone_by_id(zone_id)
            if not existing: return False

            response = supabase.table(ZoneHelper.TABLE_NAME).delete().eq("Id", zone_id).execute()
            if hasattr(response, 'error') and response.error:
                logger.error(f"Supabase delete zone {zone_id} error: {response.error.message}")
                raise Exception(f"Supabase delete zone error: {response.error.message}")
            # Assuming deletion cascade takes care of VluchtCyclus references if any exist
            # Or VluchtCyclus.ZoneId would need to be SET NULL or prevented if VluchtCyclus has ZoneId as NOT NULL
            return True
        except Exception as e:
            # Catch FK errors if Zone deletion is restricted by VluchtCyclus? (Schema doesn't specify ON DELETE for VluchtCyclus -> Zone)
            if "violates foreign key constraint" in str(e): # Add specific FK name if needed
                 logger.error(f"Cannot delete Zone {zone_id} as it's referenced by VluchtCyclus.")
                 raise ValueError(f"Cannot delete Zone {zone_id} as it is currently in use.") # For 409 Conflict
            logger.error(f"Error deleting zone {zone_id}: {e}")
            raise
