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

    @staticmethod
    def create_vlucht_cyclus(verslag_id: Optional[int] = None, plaats_id: Optional[int] = None,
                          drone_id: Optional[int] = None, zone_id: Optional[int] = None) -> Optional[Dict]:
        """Create a new flight cycle. At least one FK must be provided."""
        vlucht_cyclus_data = {}
        
        # Only include non-None values
        if verslag_id is not None:
            vlucht_cyclus_data["VerslagId"] = verslag_id
        if plaats_id is not None:
            vlucht_cyclus_data["PlaatsId"] = plaats_id
        if drone_id is not None:
            vlucht_cyclus_data["DroneId"] = drone_id
        if zone_id is not None:
            vlucht_cyclus_data["ZoneId"] = zone_id

        if not vlucht_cyclus_data:
            raise ValueError("Cannot create VluchtCyclus with no associated IDs.")

        try:
            response = supabase.table(VluchtCyclusHelper.TABLE_NAME).insert(vlucht_cyclus_data).execute()
            if response.data:
                return response.data[0]
            else:
                if hasattr(response, 'error') and response.error:
                    logger.error(f"Supabase create vlucht cyclus error: {response.error.message}")
                    if "foreign key constraint" in response.error.message:
                        raise ValueError("One or more reference IDs do not exist.")
                else:
                    logger.error("Supabase create vlucht cyclus failed, no data returned.")
                return None
        except Exception as e:
            if "violates foreign key constraint" in str(e):
                logger.warning(f"Create VluchtCyclus failed due to invalid FK in data {vlucht_cyclus_data}")
                raise ValueError("One or more reference IDs do not exist.")
            logger.error(f"Error creating vlucht cyclus with data {vlucht_cyclus_data}: {e}")
            raise

    @staticmethod
    def update_vlucht_cyclus(vlucht_cyclus_id: int, **kwargs) -> Optional[Dict]:
        """Update an existing flight cycle."""
        if not kwargs:
            raise ValueError("No fields provided for update.")

        update_data = {}
        valid_fields = ["VerslagId", "PlaatsId", "DroneId", "ZoneId"]
        
        # Only include fields that are in kwargs
        for field in valid_fields:
            if field in kwargs:
                update_data[field] = kwargs[field]

        if not update_data:
            raise ValueError("No valid fields provided for update.")

        try:
            # First get existing record
            existing = VluchtCyclusHelper.get_vlucht_cyclus_by_id(vlucht_cyclus_id)
            if not existing:
                return None

            # Merge existing data with updates to ensure we don't remove all FKs
            merged_data = {
                "VerslagId": existing.get("VerslagId"),
                "PlaatsId": existing.get("PlaatsId"),
                "DroneId": existing.get("DroneId"),
                "ZoneId": existing.get("ZoneId")
            }
            merged_data.update(update_data)

            # Verify at least one FK will remain non-null
            if not any(val is not None for val in merged_data.values()):
                raise ValueError("Cannot update: at least one ID must remain set")

            response = supabase.table(VluchtCyclusHelper.TABLE_NAME).update(merged_data).eq("Id", vlucht_cyclus_id).execute()
            if response.data:
                return response.data[0]
            else:
                if hasattr(response, 'error') and response.error:
                    logger.error(f"Supabase update vlucht cyclus error: {response.error.message}")
                    if "foreign key constraint" in response.error.message:
                        raise ValueError("One or more reference IDs do not exist.")
                else:
                    logger.error(f"Supabase update vlucht cyclus {vlucht_cyclus_id} failed.")
                return None
        except ValueError:
            raise
        except Exception as e:
            if "violates foreign key constraint" in str(e):
                logger.warning(f"Update VluchtCyclus {vlucht_cyclus_id} failed due to invalid FK in data {update_data}")
                raise ValueError("One or more reference IDs do not exist.")
            logger.error(f"Error updating vlucht cyclus {vlucht_cyclus_id} with data {update_data}: {e}")
            raise

    @staticmethod
    def delete_vlucht_cyclus(vlucht_cyclus_id: int) -> bool:
        """Delete a flight cycle"""
        try:
            existing = VluchtCyclusHelper.get_vlucht_cyclus_by_id(vlucht_cyclus_id)
            if not existing:
                return False

            # Check for Cyclus references
            ref_cyclus_response = supabase.table("Cyclus").select("Id").eq("VluchtCyclusId", vlucht_cyclus_id).limit(1).execute()
            if ref_cyclus_response.data:
                raise ValueError(f"Cannot delete VluchtCyclus {vlucht_cyclus_id} as it is referenced by Cyclus.")

            response = supabase.table(VluchtCyclusHelper.TABLE_NAME).delete().eq("Id", vlucht_cyclus_id).execute()
            if hasattr(response, 'error') and response.error:
                logger.error(f"Supabase delete vlucht cyclus {vlucht_cyclus_id} error: {response.error.message}")
                raise Exception(f"Supabase delete vlucht cyclus error: {response.error.message}")
            return True
        except ValueError:
            raise
        except Exception as e:
            logger.error(f"Error deleting vlucht cyclus {vlucht_cyclus_id}: {e}")
            raise
