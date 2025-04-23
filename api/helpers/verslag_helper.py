from typing import Dict, List, Optional
from ..config import supabase

class VerslagHelper:
    @staticmethod
    def get_all_verslagen() -> List[Dict]:
        """Get all reports"""
        # Select should now include VluchtCyclusId by default if using '*'
        response = supabase.table("Verslag").select("*").execute()
        return response.data

    @staticmethod
    def get_verslag_by_id(verslag_id: int) -> Dict:
        """Get a specific report by ID"""
        response = supabase.table("Verslag").select("*").eq("Id", verslag_id).execute()
        return response.data[0] if response.data else None

    @staticmethod
    def get_verslagen_by_status(is_verzonden: bool = None, is_geaccepteerd: bool = None) -> List[Dict]:
        """Get reports filtered by status"""
        query = supabase.table("Verslag").select("*")
        if is_verzonden is not None:
            query = query.eq("isverzonden", is_verzonden)
        if is_geaccepteerd is not None:
            query = query.eq("isgeaccepteerd", is_geaccepteerd)
        response = query.execute()
        return response.data

    @staticmethod
    def create_verslag(onderwerp: str, inhoud: str, is_verzonden: bool = False,
                      is_geaccepteerd: bool = False, vlucht_cyclus_id: Optional[int] = None) -> Dict: # Added vlucht_cyclus_id
        """Create a new report"""
        verslag_data = {
            "onderwerp": onderwerp,
            "inhoud": inhoud,
            "isverzonden": is_verzonden,
            "isgeaccepteerd": is_geaccepteerd
        }
        # Add VluchtCyclusId only if it's provided
        if vlucht_cyclus_id is not None:
             verslag_data["VluchtCyclusId"] = vlucht_cyclus_id

        response = supabase.table("Verslag").insert(verslag_data).execute()
        # Check for API errors during insert
        if response.data:
            return response.data[0]
        elif hasattr(response, 'error') and response.error:
             print(f"Supabase insert error: {response.error.message}")
             # You might want to raise an exception here or return None based on your error handling strategy
             return None
        else:
             # Handle unexpected response structure
             print("Unexpected response from Supabase during insert")
             return None


    @staticmethod
    def update_verslag(verslag_id: int, **kwargs) -> Dict:
        """Update an existing report"""
        # Ensure 'VluchtCyclusId' key is correctly handled if passed in kwargs
        # No special handling needed if kwargs contains 'VluchtCyclusId': int or None
        response = supabase.table("Verslag").update(kwargs).eq("Id", verslag_id).execute()
        # Check for API errors during update
        if response.data:
            return response.data[0]
        elif hasattr(response, 'error') and response.error:
             print(f"Supabase update error: {response.error.message}")
             return None # Or raise
        else:
             print("Unexpected response from Supabase during update")
             return None

    @staticmethod
    def delete_verslag(verslag_id: int) -> bool:
        """Delete a report"""
        response = supabase.table("Verslag").delete().eq("Id", verslag_id).execute()
        # Deletion success is often indicated by count or lack of error,
        # response.data might be empty on success for delete. Check API docs.
        # Assuming success if no error and potentially data is list of deleted items
        if hasattr(response, 'error') and response.error:
             print(f"Supabase delete error: {response.error.message}")
             return False
        # Check if data indicates success (e.g., non-empty list of deleted items)
        # This might vary based on Supabase client version/settings
        return isinstance(response.data, list) # Basic check, adjust as needed