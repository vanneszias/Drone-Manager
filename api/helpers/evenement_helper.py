from typing import Dict, List, Optional
from datetime import date, time
from ..config import supabase
import logging # Add logging

logger = logging.getLogger(__name__)

class EvenementHelper:
    TABLE_NAME = "Evenement"

    @staticmethod
    def get_all_events() -> List[Dict]:
        """Get all events from the database"""
        try:
            response = supabase.table(EvenementHelper.TABLE_NAME).select("*").execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching all events: {e}")
            raise # Re-raise the exception to be caught by the route handler

    @staticmethod
    def get_event_by_id(event_id: int) -> Optional[Dict]:
        """Get a specific event by ID"""
        try:
            response = supabase.table(EvenementHelper.TABLE_NAME).select("*").eq("Id", event_id).limit(1).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error fetching event {event_id}: {e}")
            raise

    @staticmethod
    def create_event(start_datum: date, eind_datum: date, start_tijd: time,
                   tijdsduur: time, naam: str) -> Optional[Dict]:
        """Create a new event"""
        if not naam or not naam.strip():
             raise ValueError("Event name (Naam) cannot be empty")
        event_data = {
            "StartDatum": start_datum.isoformat(),
            "EindDatum": eind_datum.isoformat(),
            "StartTijd": start_tijd.isoformat(),
            "Tijdsduur": tijdsduur.isoformat(), # Ensure this TIME type makes sense for duration
            "Naam": naam.strip()
        }
        try:
            response = supabase.table(EvenementHelper.TABLE_NAME).insert(event_data).execute()
            # Check if insertion was successful and data is returned
            if response.data:
                return response.data[0]
            else:
                # Log Supabase error if available
                if hasattr(response, 'error') and response.error:
                    logger.error(f"Supabase create event error: {response.error.message}")
                else:
                    logger.error("Supabase create event failed, no data returned and no error object.")
                return None
        except Exception as e:
            logger.error(f"Error creating event with data {event_data}: {e}")
            raise # Re-raise for route handler

    @staticmethod
    def update_event(event_id: int, **kwargs) -> Optional[Dict]:
        """Update an existing event. Expects kwargs with DB column names (PascalCase)."""
        if not kwargs:
            logger.warning(f"Update event {event_id} called with no data.")
            return None # Or raise ValueError?

        # The app.py route already converts date/time to isoformat strings
        # and uses PascalCase keys, so direct passthrough should be fine.
        # Example validation within helper if needed:
        if 'Naam' in kwargs and (not kwargs['Naam'] or not str(kwargs['Naam']).strip()):
             raise ValueError("Event name (Naam) cannot be empty")

        try:
            response = supabase.table(EvenementHelper.TABLE_NAME).update(kwargs).eq("Id", event_id).execute()
            # Check if update was successful and data is returned
            if response.data:
                return response.data[0]
            else:
                 # Check if the record exists first? Supabase update might return empty data if no match
                 existing = EvenementHelper.get_event_by_id(event_id)
                 if not existing:
                     logger.warning(f"Attempted to update non-existent event {event_id}")
                     return None # Indicate not found
                 # If it exists but update returned no data, log potential error
                 if hasattr(response, 'error') and response.error:
                     logger.error(f"Supabase update event {event_id} error: {response.error.message}")
                 else:
                     logger.error(f"Supabase update event {event_id} failed, no data returned and no error object.")
                 return None # Indicate failure
        except Exception as e:
            logger.error(f"Error updating event {event_id} with data {kwargs}: {e}")
            raise

    @staticmethod
    def delete_event(event_id: int) -> bool:
        """Delete an event. Returns True if deletion successful, False otherwise."""
        try:
            # Check existence first to return accurate 404s from the API
            existing = EvenementHelper.get_event_by_id(event_id)
            if not existing:
                return False

            response = supabase.table(EvenementHelper.TABLE_NAME).delete().eq("Id", event_id).execute()
            # Deletion success might mean response.data is the deleted record(s) or just empty without error
            if hasattr(response, 'error') and response.error:
                logger.error(f"Supabase delete event {event_id} error: {response.error.message}")
                # Let the exception handler in app.py deal with potential FK issues if ON DELETE CASCADE fails
                raise Exception(f"Supabase delete event error: {response.error.message}")
            # Assume success if no error is explicitly reported by Supabase client and record existed
            # Supabase python client V1 might return the deleted record in data, V2 might not.
            # A simple check for no error is often sufficient.
            return True # Or check len(response.data) > 0 if V1 behaviour is confirmed
        except Exception as e:
            # Catch potential DB errors like FK violations if ON DELETE CASCADE has issues
            logger.error(f"Error deleting event {event_id}: {e}")
            raise