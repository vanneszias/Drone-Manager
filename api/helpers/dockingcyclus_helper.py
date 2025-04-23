from typing import Dict, List, Optional
from ..config import supabase
import logging

logger = logging.getLogger(__name__)

class DockingCyclusHelper:
    TABLE_NAME = "DockingCyclus"

    @staticmethod
    def get_all_docking_cycli() -> List[Dict]:
        """Get all docking cycles"""
        try:
            response = supabase.table(DockingCyclusHelper.TABLE_NAME).select("*").execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching all docking cycli: {e}")
            raise

    @staticmethod
    def get_docking_cyclus_by_id(docking_cyclus_id: int) -> Optional[Dict]:
        """Get a specific docking cycle by ID"""
        try:
            response = supabase.table(DockingCyclusHelper.TABLE_NAME).select("*").eq("Id", docking_cyclus_id).limit(1).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error fetching docking cyclus {docking_cyclus_id}: {e}")
            raise

    @staticmethod
    def get_docking_cycli_by_drone(drone_id: int) -> List[Dict]:
        """Get all docking cycles for a specific drone"""
        try:
            response = supabase.table(DockingCyclusHelper.TABLE_NAME).select("*").eq("DroneId", drone_id).execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching docking cycli for drone {drone_id}: {e}")
            raise

    @staticmethod
    def get_docking_cycli_by_docking(docking_id: int) -> List[Dict]:
        """Get all docking cycles for a specific docking station"""
        try:
            response = supabase.table(DockingCyclusHelper.TABLE_NAME).select("*").eq("DockingId", docking_id).execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching docking cycli for docking {docking_id}: {e}")
            raise

    @staticmethod
    def get_docking_cycli_by_cyclus(cyclus_id: int) -> List[Dict]:
        """Get all docking cycles for a specific cyclus"""
        try:
            response = supabase.table(DockingCyclusHelper.TABLE_NAME).select("*").eq("CyclusId", cyclus_id).execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching docking cycli for cyclus {cyclus_id}: {e}")
            raise

    @staticmethod
    def create_docking_cyclus(drone_id: int, docking_id: int, cyclus_id: int) -> Optional[Dict]:
        """Create a new docking cycle"""
        # FKs are required (assuming based on schema not having DEFAULT/NULL)
        docking_cyclus_data = {
            "DroneId": drone_id,
            "DockingId": docking_id,
            "CyclusId": cyclus_id
        }
        try:
            response = supabase.table(DockingCyclusHelper.TABLE_NAME).insert(docking_cyclus_data).execute()
            if response.data:
                return response.data[0]
            else:
                if hasattr(response, 'error') and response.error:
                    logger.error(f"Supabase create docking cyclus error: {response.error.message}")
                    if "foreign key constraint" in response.error.message:
                         # Identify which FK failed
                         fk_error_map = {
                             '"fk_dockingcyclus_drone"': f"DroneId {drone_id}",
                             '"fk_dockingcyclus_docking"': f"DockingId {docking_id}",
                             '"fk_dockingcyclus_cyclus"': f"CyclusId {cyclus_id}"
                         }
                         offending_fk = "an unknown reference ID"
                         for fk_name, fk_val in fk_error_map.items():
                              if fk_name in response.error.message:
                                  offending_fk = f"invalid reference {fk_val}"
                                  break
                         raise ValueError(f"Cannot create DockingCyclus: {offending_fk} does not exist.")
                else:
                    logger.error("Supabase create docking cyclus failed, no data returned.")
                return None
        except Exception as e:
            if "violates foreign key constraint" in str(e):
                 # Duplicate FK check logic here for safety
                 fk_error_map = { ... } # As above
                 offending_fk = "an unknown reference ID"
                 # ... logic to find offending fk ...
                 logger.warning(f"Create DockingCyclus failed due to {offending_fk} in data {docking_cyclus_data}")
                 raise ValueError(f"Cannot create DockingCyclus: {offending_fk} does not exist.")
            logger.error(f"Error creating docking cyclus with data {docking_cyclus_data}: {e}")
            raise

    @staticmethod
    def update_docking_cyclus(docking_cyclus_id: int, **kwargs) -> Optional[Dict]:
        """Update an existing docking cycle. Expects kwargs with DB column names."""
        if not kwargs: return None

        # Assuming FKs might be updated
        update_data = {}
        for key in ["DroneId", "DockingId", "CyclusId"]:
            if key in kwargs:
                # Ensure values are integers (app.py should handle None if allowed, but these FKs look non-nullable)
                if kwargs[key] is None:
                     raise ValueError(f"{key} cannot be null for DockingCyclus.") # Assuming non-nullable FKs
                update_data[key] = int(kwargs[key])

        if not update_data:
            raise ValueError("No valid fields provided for DockingCyclus update.")

        try:
            response = supabase.table(DockingCyclusHelper.TABLE_NAME).update(update_data).eq("Id", docking_cyclus_id).execute()
            if response.data:
                return response.data[0]
            else:
                existing = DockingCyclusHelper.get_docking_cyclus_by_id(docking_cyclus_id)
                if not existing: return None # Not found
                if hasattr(response, 'error') and response.error:
                    logger.error(f"Supabase update docking cyclus {docking_cyclus_id} error: {response.error.message}")
                    if "foreign key constraint" in response.error.message:
                         # FK check logic as in create
                         raise ValueError(f"Invalid reference ID provided in update.")
                else:
                    logger.error(f"Supabase update docking cyclus {docking_cyclus_id} failed.")
                return None
        except Exception as e:
            if "violates foreign key constraint" in str(e):
                 # FK check logic as in create
                 logger.warning(f"Update DockingCyclus {docking_cyclus_id} failed due to invalid FK in data {update_data}")
                 raise ValueError(f"Invalid reference ID provided in update.")
            logger.error(f"Error updating docking cyclus {docking_cyclus_id} with data {update_data}: {e}")
            raise

    @staticmethod
    def delete_docking_cyclus(docking_cyclus_id: int) -> bool:
        """Delete a docking cycle"""
        try:
            existing = DockingCyclusHelper.get_docking_cyclus_by_id(docking_cyclus_id)
            if not existing: return False

            response = supabase.table(DockingCyclusHelper.TABLE_NAME).delete().eq("Id", docking_cyclus_id).execute()
            if hasattr(response, 'error') and response.error:
                logger.error(f"Supabase delete docking cyclus {docking_cyclus_id} error: {response.error.message}")
                raise Exception(f"Supabase delete docking cyclus error: {response.error.message}")
            # This table is not referenced by others, so deletion should be straightforward
            return True
        except Exception as e:
            logger.error(f"Error deleting docking cyclus {docking_cyclus_id}: {e}")
            raise
