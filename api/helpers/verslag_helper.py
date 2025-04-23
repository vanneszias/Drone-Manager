from typing import Dict, List, Optional
from ..config import supabase

class VerslagHelper:
    @staticmethod
    def get_all_verslagen() -> List[Dict]:
        """Get all reports"""
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
                      is_geaccepteerd: bool = False) -> Dict:
        """Create a new report"""
        verslag_data = {
            "onderwerp": onderwerp,
            "inhoud": inhoud,
            "isverzonden": is_verzonden,
            "isgeaccepteerd": is_geaccepteerd
        }
        response = supabase.table("Verslag").insert(verslag_data).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def update_verslag(verslag_id: int, **kwargs) -> Dict:
        """Update an existing report"""
        response = supabase.table("Verslag").update(kwargs).eq("Id", verslag_id).execute()
        return response.data[0] if response.data else None
    
    @staticmethod
    def delete_verslag(verslag_id: int) -> bool:
        """Delete a report"""
        response = supabase.table("Verslag").delete().eq("Id", verslag_id).execute()
        return len(response.data) > 0