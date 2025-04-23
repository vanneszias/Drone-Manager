from typing import Dict, List, Optional
from ..config import supabase
import logging

logger = logging.getLogger(__name__)

class VerslagHelper:
    TABLE_NAME = "Verslag"

    @staticmethod
    def get_all_verslagen() -> List[Dict]:
        """Get all reports"""
        try:
            response = supabase.table(VerslagHelper.TABLE_NAME).select("*").execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching all verslagen: {e}")
            raise

    @staticmethod
    def get_verslag_by_id(verslag_id: int) -> Optional[Dict]:
        """Get a specific report by ID"""
        try:
            response = supabase.table(VerslagHelper.TABLE_NAME).select("*").eq("Id", verslag_id).limit(1).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error fetching verslag {verslag_id}: {e}")
            raise

    @staticmethod
    def get_verslagen_by_status(is_verzonden: Optional[bool] = None, is_geaccepteerd: Optional[bool] = None) -> List[Dict]:
        """Get reports filtered by status"""
        try:
            query = supabase.table(VerslagHelper.TABLE_NAME).select("*")
            if is_verzonden is not None:
                query = query.eq("isverzonden", is_verzonden)
            if is_geaccepteerd is not None:
                query = query.eq("isgeaccepteerd", is_geaccepteerd)
            response = query.execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching verslagen by status (verzonden={is_verzonden}, geaccepteerd={is_geaccepteerd}): {e}")
            raise

    @staticmethod
    def create_verslag(onderwerp: str, inhoud: str, is_verzonden: bool = False,
                      is_geaccepteerd: bool = False, vlucht_cyclus_id: Optional[int] = None) -> Optional[Dict]:
        """Create a new report"""
        if not onderwerp or not onderwerp.strip(): raise ValueError("Onderwerp cannot be empty")
        if not inhoud or not inhoud.strip(): raise ValueError("Inhoud cannot be empty")

        verslag_data = {
            "onderwerp": onderwerp.strip(),
            "inhoud": inhoud.strip(),
            "isverzonden": is_verzonden,
            "isgeaccepteerd": is_geaccepteerd,
            # Add VluchtCyclusId only if it's provided (handles None correctly)
            "VluchtCyclusId": vlucht_cyclus_id
        }

        try:
            response = supabase.table(VerslagHelper.TABLE_NAME).insert(verslag_data).execute()
            if response.data:
                return response.data[0]
            else:
                if hasattr(response, 'error') and response.error:
                    logger.error(f"Supabase create verslag error: {response.error.message}")
                    if "foreign key constraint" in response.error.message and "Verslag_VluchtCyclusId_fkey" in response.error.message:
                         raise ValueError(f"Invalid VluchtCyclusId: {vlucht_cyclus_id} does not exist.")
                else:
                    logger.error("Supabase create verslag failed, no data returned.")
                return None
        except Exception as e:
            if "violates foreign key constraint" in str(e) and "Verslag_VluchtCyclusId_fkey" in str(e):
                 logger.warning(f"Attempted to create verslag with non-existent VluchtCyclusId {vlucht_cyclus_id}")
                 raise ValueError(f"Invalid VluchtCyclusId: {vlucht_cyclus_id} does not exist.")
            logger.error(f"Error creating verslag with data {verslag_data}: {e}")
            raise


    @staticmethod
    def update_verslag(verslag_id: int, **kwargs) -> Optional[Dict]:
        """Update an existing report. Expects kwargs with DB column names."""
        if not kwargs: return None

        if 'onderwerp' in kwargs and (not kwargs['onderwerp'] or not str(kwargs['onderwerp']).strip()):
            raise ValueError("Onderwerp cannot be empty")
        if 'inhoud' in kwargs and (not kwargs['inhoud'] or not str(kwargs['inhoud']).strip()):
            raise ValueError("Inhoud cannot be empty")
        # Type checks for booleans are done in app.py

        # Ensure VluchtCyclusId=None is handled correctly if passed
        if "VluchtCyclusId" in kwargs and kwargs["VluchtCyclusId"] is None:
            # Supabase client should handle setting NULL correctly
            pass

        try:
            response = supabase.table(VerslagHelper.TABLE_NAME).update(kwargs).eq("Id", verslag_id).execute()
            if response.data:
                return response.data[0]
            else:
                existing = VerslagHelper.get_verslag_by_id(verslag_id)
                if not existing: return None # Not found
                if hasattr(response, 'error') and response.error:
                    logger.error(f"Supabase update verslag {verslag_id} error: {response.error.message}")
                    if "foreign key constraint" in response.error.message and "Verslag_VluchtCyclusId_fkey" in response.error.message:
                         raise ValueError(f"Invalid VluchtCyclusId provided in update.")
                else:
                    logger.error(f"Supabase update verslag {verslag_id} failed.")
                return None
        except Exception as e:
            if "violates foreign key constraint" in str(e) and "Verslag_VluchtCyclusId_fkey" in str(e):
                 logger.warning(f"Update verslag {verslag_id} failed due to invalid VluchtCyclusId in data {kwargs}")
                 raise ValueError(f"Invalid VluchtCyclusId provided in update.")
            logger.error(f"Error updating verslag {verslag_id} with data {kwargs}: {e}")
            raise

    @staticmethod
    def delete_verslag(verslag_id: int) -> bool:
        """Delete a report"""
        try:
            existing = VerslagHelper.get_verslag_by_id(verslag_id)
            if not existing: return False

            response = supabase.table(VerslagHelper.TABLE_NAME).delete().eq("Id", verslag_id).execute()
            if hasattr(response, 'error') and response.error:
                logger.error(f"Supabase delete verslag {verslag_id} error: {response.error.message}")
                raise Exception(f"Supabase delete verslag error: {response.error.message}")
            # Note: VluchtCyclus referencing this Verslag should NOT block deletion
            # because VluchtCyclus.VerslagId FK has no ON DELETE specified (defaults to NO ACTION/RESTRICT)
            # Oh wait, the VluchtCyclus->Verslag FK *doesn't* have ON DELETE specified.
            # But Verslag->VluchtCyclus *does* (ON DELETE SET NULL). This helper deletes a Verslag.
            # Deleting a Verslag should SET NULL in the referencing VluchtCyclus row(s).
            # If VluchtCyclus referenced Verslag (it doesn't), then deleting Verslag would be restricted.
            return True
        except Exception as e:
            # If deletion is blocked unexpectedly
            if "violates foreign key constraint" in str(e):
                 logger.error(f"Cannot delete Verslag {verslag_id} due to unexpected FK constraint.")
                 raise ValueError(f"Cannot delete Verslag {verslag_id} due to related records.") # 409?
            logger.error(f"Error deleting verslag {verslag_id}: {e}")
            raise
