from typing import Dict, List, Optional
from datetime import datetime
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
    def create_vlucht_cyclus(drone_id: int, plaats_id: int, zone_id: Optional[int] = None) -> Optional[Dict]:
        """Create a new flight cycle with required drone and location."""
        if not drone_id or not plaats_id:
            raise ValueError("Both DroneId and PlaatsId are required.")

        vlucht_cyclus_data = {
            "DroneId": drone_id,
            "PlaatsId": plaats_id,
            "ZoneId": zone_id,
            "status": "PENDING",
            "startTijd": None,
            "eindTijd": None
        }

        try:
            # Validate drone availability
            drone_response = supabase.table("Drone").select("*").eq("Id", drone_id).execute()
            if not drone_response.data:
                raise ValueError(f"Drone with ID {drone_id} does not exist.")
            drone = drone_response.data[0]
            if drone["status"] != "AVAILABLE":
                raise ValueError(f"Drone {drone_id} is not available (current status: {drone['status']}).")
            if not drone["magOpstijgen"]:
                raise ValueError(f"Drone {drone_id} is not allowed to take off.")

            # Validate start location availability
            plaats_response = supabase.table("Startplaats").select("*").eq("Id", plaats_id).execute()
            if not plaats_response.data:
                raise ValueError(f"Startplaats with ID {plaats_id} does not exist.")
            plaats = plaats_response.data[0]
            if not plaats["isbeschikbaar"]:
                raise ValueError(f"Startplaats {plaats_id} is not available.")

            # Validate zone if provided
            if zone_id is not None:
                zone_response = supabase.table("Zone").select("*").eq("Id", zone_id).execute()
                if not zone_response.data:
                    raise ValueError(f"Zone with ID {zone_id} does not exist.")

            # Create flight cycle
            response = supabase.table(VluchtCyclusHelper.TABLE_NAME).insert(vlucht_cyclus_data).execute()
            if not response.data:
                error_msg = "Failed to create VluchtCyclus"
                if hasattr(response, 'error') and response.error:
                    error_msg = f"Database error: {response.error.message}"
                logger.error(f"Create VluchtCyclus failed: {error_msg}")
                raise ValueError(error_msg)

            # Update drone status
            supabase.table("Drone").update({"status": "IN_USE"}).eq("Id", drone_id).execute()
            
            # Update starting location availability
            supabase.table("Startplaats").update({"isbeschikbaar": False}).eq("Id", plaats_id).execute()
            
            return response.data[0]
        except Exception as e:
            logger.error(f"Error creating vlucht cyclus: {e}")
            raise

    @staticmethod
    def update_status(vlucht_cyclus_id: int, new_status: str) -> Optional[Dict]:
        """Update flight cycle status and handle related state changes."""
        valid_statuses = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]
        if new_status not in valid_statuses:
            raise ValueError(f"Invalid status. Must be one of: {', '.join(valid_statuses)}")

        try:
            existing = VluchtCyclusHelper.get_vlucht_cyclus_by_id(vlucht_cyclus_id)
            if not existing:
                raise ValueError(f"VluchtCyclus {vlucht_cyclus_id} not found.")

            update_data = {"status": new_status}
            now = datetime.utcnow().isoformat()

            if new_status == "IN_PROGRESS":
                update_data["startTijd"] = now
            elif new_status in ["COMPLETED", "CANCELLED"]:
                update_data["eindTijd"] = now
                # Free up resources
                if existing["DroneId"]:
                    supabase.table("Drone").update({"status": "AVAILABLE"}).eq("Id", existing["DroneId"]).execute()
                if existing["PlaatsId"]:
                    supabase.table("Startplaats").update({"isbeschikbaar": True}).eq("Id", existing["PlaatsId"]).execute()

            response = supabase.table(VluchtCyclusHelper.TABLE_NAME).update(update_data).eq("Id", vlucht_cyclus_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error updating vlucht cyclus status: {e}")
            raise

    @staticmethod
    def attach_verslag(vlucht_cyclus_id: int, verslag_id: int) -> Optional[Dict]:
        """Attach a report to a completed flight cycle."""
        try:
            existing = VluchtCyclusHelper.get_vlucht_cyclus_by_id(vlucht_cyclus_id)
            if not existing:
                raise ValueError(f"VluchtCyclus {vlucht_cyclus_id} not found.")
            
            if existing["status"] != "COMPLETED":
                raise ValueError("Can only attach reports to completed flight cycles.")

            verslag_response = supabase.table("Verslag").select("*").eq("Id", verslag_id).execute()
            if not verslag_response.data:
                raise ValueError(f"Verslag with ID {verslag_id} does not exist.")

            response = supabase.table(VluchtCyclusHelper.TABLE_NAME).update({
                "VerslagId": verslag_id
            }).eq("Id", vlucht_cyclus_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error attaching verslag: {e}")
            raise

    @staticmethod
    def delete_vlucht_cyclus(vlucht_cyclus_id: int) -> bool:
        """Delete a flight cycle if it's not in progress and has no references."""
        try:
            existing = VluchtCyclusHelper.get_vlucht_cyclus_by_id(vlucht_cyclus_id)
            if not existing:
                return False

            if existing["status"] == "IN_PROGRESS":
                raise ValueError("Cannot delete a flight cycle that is in progress.")

            # Check for Cyclus references
            ref_cyclus_response = supabase.table("Cyclus").select("Id").eq("VluchtCyclusId", vlucht_cyclus_id).limit(1).execute()
            if ref_cyclus_response.data:
                raise ValueError(f"Cannot delete VluchtCyclus {vlucht_cyclus_id} as it is referenced by Cyclus.")

            response = supabase.table(VluchtCyclusHelper.TABLE_NAME).delete().eq("Id", vlucht_cyclus_id).execute()
            return True
        except ValueError:
            raise
        except Exception as e:
            logger.error(f"Error deleting vlucht cyclus {vlucht_cyclus_id}: {e}")
            raise
