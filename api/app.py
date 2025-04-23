from flask import Flask, request, jsonify
from datetime import date, time
import os
import traceback
import logging
from dotenv import load_dotenv

from .config import supabase

# Import all helper classes
from .helpers import (
    EvenementHelper,
    ZoneHelper,
    StartplaatsHelper,
    VerslagHelper,
    DroneHelper,
    DockingHelper,
    CyclusHelper,
    VluchtCyclusHelper,
    DockingCyclusHelper
)
# Import Supabase client directly ONLY IF needed for complex queries not in helpers
# from .config import supabase

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(name)s: %(message)s')
# Use Flask's logger instance
app.logger.setLevel(logging.INFO)
if os.environ.get('FLASK_DEBUG', 'False').lower() == 'true':
    app.logger.setLevel(logging.DEBUG)


# --- Helper Function for Parsing Boolean Query Params ---
def str_to_bool(s):
    if s is None:
        return None
    return s.lower() in ['true', '1', 't', 'y', 'yes']

# --- Helper for Handling Exceptions ---
def handle_error(e, message, status_code=500):
    """Logs error and returns JSON response."""
    # Log the full traceback for debugging server-side
    app.logger.error(f"{message}: {e}\n{traceback.format_exc()}")
    # Return a user-friendly error message
    user_error_message = message
    # Customize user message for specific errors if needed
    if isinstance(e, ValueError):
         user_error_message = str(e) # Use the specific message from ValueError
         status_code = 400 # Bad Request for validation errors
    elif "violates foreign key constraint" in str(e):
        # More specific handling for FK errors could be added here if not caught earlier
        user_error_message = "Invalid reference ID provided."
        status_code = 400 # Bad Request
    elif "unique constraint" in str(e):
        user_error_message = "A record with the same unique identifier already exists."
        status_code = 409 # Conflict

    return jsonify({"error": user_error_message}), status_code

# --- Evenement Routes ---
@app.route('/api/events', methods=['GET'])
def get_events():
    try:
        events = EvenementHelper.get_all_events()
        return jsonify(events)
    except Exception as e:
        return handle_error(e, "Failed to retrieve events")

@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    try:
        event = EvenementHelper.get_event_by_id(event_id)
        if event:
            return jsonify(event)
        return jsonify({"error": "Event not found"}), 404
    except Exception as e:
         return handle_error(e, f"Failed to retrieve event {event_id}")

@app.route('/api/events', methods=['POST'])
def create_event():
    data = request.get_json()
    app.logger.info(f"POST /api/events data: {data}")

    if not data:
        return jsonify({"error": "No input data provided"}), 400

    # Expect snake_case keys from JSON
    required_keys = ['start_datum', 'eind_datum', 'start_tijd', 'tijdsduur', 'naam']
    missing_keys = [key for key in required_keys if key not in data or data[key] is None]
    if missing_keys:
        return jsonify({"error": f"Missing required fields: {', '.join(missing_keys)}"}), 400

    try:
        # Validate and convert data types
        start_datum_obj = date.fromisoformat(data['start_datum'])
        eind_datum_obj = date.fromisoformat(data['eind_datum'])
        start_tijd_obj = time.fromisoformat(data['start_tijd'])
        tijdsduur_obj = time.fromisoformat(data['tijdsduur']) # Ensure TIME is correct for duration
        naam_str = str(data['naam']).strip()

        if not naam_str:
            raise ValueError("Event name cannot be empty")
        if eind_datum_obj < start_datum_obj:
             raise ValueError("End date cannot be before start date")

        # Call helper with correct Python types/validated data
        event = EvenementHelper.create_event(
            start_datum=start_datum_obj,
            eind_datum=eind_datum_obj,
            start_tijd=start_tijd_obj,
            tijdsduur=tijdsduur_obj,
            naam=naam_str
        )
        if event:
            app.logger.info(f"Event created successfully: {event.get('Id')}")
            return jsonify(event), 201
        else:
             # Helper should raise error or return None if creation fails; handle potential None case
             app.logger.error("EvenementHelper.create_event returned None unexpectedly.")
             return jsonify({"error": "Failed to create event in database"}), 500
    except (ValueError, TypeError) as ve:
        return handle_error(ve, "Invalid data provided", 400)
    except KeyError as ke:
        return handle_error(ke, f"Missing field: {ke}", 400)
    except Exception as e:
        return handle_error(e, "Error creating event")

@app.route('/api/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    data = request.get_json()
    app.logger.info(f"PUT /api/events/{event_id} data: {data}")
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    update_data = {} # Use PascalCase keys for direct use in helper's kwargs
    try:
        if 'start_datum' in data:
            update_data['StartDatum'] = date.fromisoformat(data['start_datum']).isoformat()
        if 'eind_datum' in data:
            update_data['EindDatum'] = date.fromisoformat(data['eind_datum']).isoformat()
        if 'start_tijd' in data:
            update_data['StartTijd'] = time.fromisoformat(data['start_tijd']).isoformat()
        if 'tijdsduur' in data:
            update_data['Tijdsduur'] = time.fromisoformat(data['tijdsduur']).isoformat()
        if 'naam' in data:
            naam_str = str(data['naam']).strip()
            if not naam_str: raise ValueError("Event name cannot be empty")
            update_data['Naam'] = naam_str

        # Add cross-field validation if necessary (e.g., check dates after conversion)
        if 'StartDatum' in update_data and 'EindDatum' in update_data:
             if date.fromisoformat(update_data['EindDatum']) < date.fromisoformat(update_data['StartDatum']):
                 raise ValueError("End date cannot be before start date")
        # Check against existing data if only one date is provided? (More complex logic)

        if not update_data:
             return jsonify({"error": "No valid fields provided for update"}), 400

        event = EvenementHelper.update_event(event_id=event_id, **update_data)

        if event:
            app.logger.info(f"Event {event_id} updated successfully.")
            return jsonify(event)
        else:
            # Helper returns None if event not found or update failed without raising error
            # Check if event exists to differentiate 404 from other errors
            existing = EvenementHelper.get_event_by_id(event_id)
            if existing:
                app.logger.error(f"Update failed for existing event {event_id}, helper returned None.")
                return jsonify({"error": "Event update failed"}), 500 # Or 400 if validation failed in helper
            else:
                 return jsonify({"error": "Event not found"}), 404
    except (ValueError, TypeError) as ve:
        return handle_error(ve, "Invalid data provided for update", 400)
    except Exception as e:
        return handle_error(e, f"Error updating event {event_id}")

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    app.logger.info(f"DELETE /api/events/{event_id}")
    try:
        success = EvenementHelper.delete_event(event_id)
        if success:
            app.logger.info(f"Event {event_id} deleted successfully")
            return '', 204 # No Content
        else:
            # Helper returns False if event didn't exist
            return jsonify({"error": "Event not found"}), 404
    except Exception as e:
        # ON DELETE CASCADE should handle Zone deletion. If other FKs block it, handle error.
         return handle_error(e, f"Error deleting event {event_id}")

# --- Zone Routes ---
@app.route('/api/zones', methods=['GET'])
def get_zones():
    try:
        event_id_str = request.args.get('event_id')
        if event_id_str:
            try:
                event_id = int(event_id_str)
                zones = ZoneHelper.get_zones_by_event(event_id)
            except ValueError:
                 return jsonify({"error": "Invalid event_id parameter"}), 400
        else:
            zones = ZoneHelper.get_all_zones()
        return jsonify(zones)
    except Exception as e:
        return handle_error(e, "Failed to retrieve zones")

@app.route('/api/zones/<int:zone_id>', methods=['GET'])
def get_zone(zone_id):
    try:
        zone = ZoneHelper.get_zone_by_id(zone_id)
        if zone:
            return jsonify(zone)
        return jsonify({"error": "Zone not found"}), 404
    except Exception as e:
        return handle_error(e, f"Failed to retrieve zone {zone_id}")

@app.route('/api/zones', methods=['POST'])
def create_zone():
    data = request.get_json()
    app.logger.info(f"POST /api/zones data: {data}")
    if not data: return jsonify({"error": "No input data provided"}), 400

    required_keys = ['naam', 'breedte', 'lengte', 'evenement_id']
    missing_keys = [key for key in required_keys if key not in data or data[key] is None]
    if missing_keys:
        return jsonify({"error": f"Missing required fields: {', '.join(missing_keys)}"}), 400

    try:
        naam_str = str(data['naam']).strip()
        breedte_val = float(data['breedte'])
        lengte_val = float(data['lengte'])
        evenement_id_val = int(data['evenement_id'])

        # Validation moved to helper, but can double-check here
        if not naam_str: raise ValueError("Zone name cannot be empty")
        if breedte_val <= 0 or lengte_val <= 0: raise ValueError("Width and Length must be positive")

        # Call helper with validated data
        zone = ZoneHelper.create_zone(
            breedte=breedte_val,
            lengte=lengte_val,
            naam=naam_str,
            evenement_id=evenement_id_val # Helper maps this to 'EvenementId'
        )

        if zone:
            app.logger.info(f"Zone created successfully: {zone.get('Id')}")
            return jsonify(zone), 201
        else:
             # Helper might return None if FK violation or other DB issue not raising Exception
             app.logger.error("ZoneHelper.create_zone returned None unexpectedly.")
             return jsonify({"error": "Failed to create zone (check EvenementId existence?)"}), 500

    except (ValueError, TypeError) as ve:
        return handle_error(ve, "Invalid data provided for zone", 400)
    except KeyError as ke:
        return handle_error(ke, f"Missing field: {ke}", 400)
    except Exception as e:
        return handle_error(e, "Error creating zone")

@app.route('/api/zones/<int:zone_id>', methods=['PUT'])
def update_zone(zone_id):
    data = request.get_json()
    app.logger.info(f"PUT /api/zones/{zone_id} data: {data}")
    if not data: return jsonify({"error": "No input data provided"}), 400

    update_data = {} # Use PascalCase keys for helper
    try:
        if 'naam' in data:
            naam_str = str(data['naam']).strip()
            if not naam_str: raise ValueError("Zone name cannot be empty")
            update_data['naam'] = naam_str
        if 'breedte' in data:
            breedte_val = float(data['breedte'])
            if breedte_val <= 0: raise ValueError("Width (breedte) must be positive")
            update_data['breedte'] = breedte_val
        if 'lengte' in data:
            lengte_val = float(data['lengte'])
            if lengte_val <= 0: raise ValueError("Length (lengte) must be positive")
            update_data['lengte'] = lengte_val
        if 'evenement_id' in data:
            # Ensure EvenementId is passed with PascalCase if helper expects it directly in kwargs
            update_data['EvenementId'] = int(data['evenement_id'])

        if not update_data:
             return jsonify({"error": "No valid fields provided for update"}), 400

        zone = ZoneHelper.update_zone(zone_id=zone_id, **update_data)

        if zone:
            app.logger.info(f"Zone {zone_id} updated successfully.")
            return jsonify(zone)
        else:
             # Helper returns None if not found or failed update
             existing = ZoneHelper.get_zone_by_id(zone_id)
             if existing:
                 app.logger.error(f"Update failed for existing zone {zone_id}.")
                 return jsonify({"error": "Zone update failed (check EvenementId?)"}), 500
             else:
                 return jsonify({"error": "Zone not found"}), 404
    except (ValueError, TypeError) as ve:
        return handle_error(ve, "Invalid data provided for zone update", 400)
    except Exception as e:
        return handle_error(e, f"Error updating zone {zone_id}")

@app.route('/api/zones/<int:zone_id>', methods=['DELETE'])
def delete_zone(zone_id):
    app.logger.info(f"DELETE /api/zones/{zone_id}")
    try:
        success = ZoneHelper.delete_zone(zone_id)
        if success:
            app.logger.info(f"Zone {zone_id} deleted successfully")
            return '', 204
        else:
            return jsonify({"error": "Zone not found"}), 404
    except ValueError as ve: # Catch specific error from helper for FK violation
        return handle_error(ve, str(ve), 409) # Conflict
    except Exception as e:
        # Check if VluchtCyclus.ZoneId blocks deletion (depends on DB settings)
        return handle_error(e, f"Error deleting zone {zone_id}")


# --- Startplaats Routes ---
@app.route('/api/startplaatsen', methods=['GET'])
def get_startplaatsen():
    try:
        is_beschikbaar_str = request.args.get('isbeschikbaar')
        is_beschikbaar = str_to_bool(is_beschikbaar_str) # Handles None

        if is_beschikbaar is True:
             startplaatsen = StartplaatsHelper.get_available_startplaatsen()
        elif is_beschikbaar is False:
             # Add helper or filter directly
             # Assuming helper exists:
             # startplaatsen = StartplaatsHelper.get_unavailable_startplaatsen()
             # Direct filter example:
             try:
                  response = supabase.table("Startplaats").select("*").eq("isbeschikbaar", False).execute()
                  startplaatsen = response.data
             except Exception as db_e:
                  raise Exception(f"Database error filtering startplaatsen: {db_e}") from db_e
        else:
             # No filter or invalid value for isbeschikbaar, get all
             startplaatsen = StartplaatsHelper.get_all_startplaatsen()
        return jsonify(startplaatsen)
    except Exception as e:
        return handle_error(e, "Failed to retrieve startplaatsen")

@app.route('/api/startplaatsen/<int:startplaats_id>', methods=['GET'])
def get_startplaats(startplaats_id):
    try:
        startplaats = StartplaatsHelper.get_startplaats_by_id(startplaats_id)
        if startplaats:
            return jsonify(startplaats)
        return jsonify({"error": "Startplaats not found"}), 404
    except Exception as e:
        return handle_error(e, f"Failed to retrieve startplaats {startplaats_id}")

@app.route('/api/startplaatsen', methods=['POST'])
def create_startplaats():
    data = request.get_json()
    app.logger.info(f"POST /api/startplaatsen data: {data}")
    if not data: return jsonify({"error": "No input data provided"}), 400

    if 'locatie' not in data or data['locatie'] is None:
        return jsonify({"error": "Missing required field: locatie"}), 400

    try:
        locatie_str = str(data['locatie']).strip()
        if not locatie_str: raise ValueError("Location (locatie) cannot be empty.")

        # Get 'isbeschikbaar', default to True if missing or not boolean
        is_beschikbaar_val = data.get('isbeschikbaar', True)
        if not isinstance(is_beschikbaar_val, bool):
             app.logger.warning(f"Invalid type for 'isbeschikbaar' in POST /api/startplaatsen, defaulting to True.")
             is_beschikbaar_val = True

        startplaats = StartplaatsHelper.create_startplaats(
            locatie=locatie_str,
            is_beschikbaar=is_beschikbaar_val
        )
        if startplaats:
            app.logger.info(f"Startplaats created successfully: {startplaats.get('Id')}")
            return jsonify(startplaats), 201
        else:
            app.logger.error("StartplaatsHelper.create_startplaats returned None.")
            return jsonify({"error": "Failed to create startplaats"}), 500
    except (ValueError, TypeError) as ve:
        return handle_error(ve, "Invalid data for startplaats", 400)
    except KeyError as ke:
         return handle_error(ke, f"Missing field: {ke}", 400)
    except Exception as e:
        return handle_error(e, "Error creating startplaats")

@app.route('/api/startplaatsen/<int:startplaats_id>', methods=['PUT'])
def update_startplaats(startplaats_id):
    data = request.get_json()
    app.logger.info(f"PUT /api/startplaatsen/{startplaats_id} data: {data}")
    if not data: return jsonify({"error": "No input data provided"}), 400

    update_data = {} # Use DB column names (which match snake_case here)
    try:
        if 'locatie' in data:
            locatie_str = str(data['locatie']).strip()
            if not locatie_str: raise ValueError("Location (locatie) cannot be empty.")
            update_data['locatie'] = locatie_str
        if 'isbeschikbaar' in data:
            if not isinstance(data['isbeschikbaar'], bool):
                 raise ValueError("isbeschikbaar must be a boolean (true/false).")
            update_data['isbeschikbaar'] = data['isbeschikbaar']

        if not update_data:
             return jsonify({"error": "No valid fields provided for update"}), 400

        startplaats = StartplaatsHelper.update_startplaats(startplaats_id=startplaats_id, **update_data)
        if startplaats:
             app.logger.info(f"Startplaats {startplaats_id} updated successfully.")
             return jsonify(startplaats)
        else:
             existing = StartplaatsHelper.get_startplaats_by_id(startplaats_id)
             if existing:
                 app.logger.error(f"Update failed for existing startplaats {startplaats_id}.")
                 return jsonify({"error": "Startplaats update failed"}), 500
             else:
                 return jsonify({"error": "Startplaats not found"}), 404
    except ValueError as ve:
        return handle_error(ve, "Invalid data type for update", 400)
    except Exception as e:
        return handle_error(e, f"Error updating startplaats {startplaats_id}")

@app.route('/api/startplaatsen/<int:startplaats_id>', methods=['DELETE'])
def delete_startplaats(startplaats_id):
    app.logger.info(f"DELETE /api/startplaatsen/{startplaats_id}")
    try:
        success = StartplaatsHelper.delete_startplaats(startplaats_id)
        if success:
            app.logger.info(f"Startplaats {startplaats_id} deleted successfully")
            return '', 204
        else:
            return jsonify({"error": "Startplaats not found"}), 404
    except ValueError as ve: # Catch specific error from helper for FK violation
        return handle_error(ve, str(ve), 409) # Conflict
    except Exception as e:
        return handle_error(e, f"Error deleting startplaats {startplaats_id}")


# --- Verslag Routes ---
@app.route('/api/verslagen', methods=['GET'])
def get_verslagen():
    try:
        is_verzonden_str = request.args.get('isverzonden')
        is_geaccepteerd_str = request.args.get('isgeaccepteerd')
        vlucht_cyclus_id_str = request.args.get('vlucht_cyclus_id') # Allow filtering by FK

        is_verzonden = str_to_bool(is_verzonden_str)
        is_geaccepteerd = str_to_bool(is_geaccepteerd_str)
        vlucht_cyclus_id = None
        if vlucht_cyclus_id_str:
             try:
                 vlucht_cyclus_id = int(vlucht_cyclus_id_str)
             except ValueError:
                 return jsonify({"error": "Invalid vlucht_cyclus_id parameter"}), 400

        # Build query dynamically or use specific helper
        # Example direct query:
        try:
            query = supabase.table("Verslag").select("*")
            if is_verzonden is not None:
                 query = query.eq("isverzonden", is_verzonden)
            if is_geaccepteerd is not None:
                 query = query.eq("isgeaccepteerd", is_geaccepteerd)
            if vlucht_cyclus_id is not None:
                 query = query.eq("VluchtCyclusId", vlucht_cyclus_id)
            response = query.execute()
            verslagen = response.data
        except Exception as db_e:
             raise Exception(f"Database error filtering verslagen: {db_e}") from db_e

        # Or use helper if it supports combined filtering:
        # verslagen = VerslagHelper.get_verslagen_filtered(is_verzonden=is_verzonden, ...)

        return jsonify(verslagen)
    except Exception as e:
        return handle_error(e, "Failed to retrieve verslagen")

@app.route('/api/verslagen/<int:verslag_id>', methods=['GET'])
def get_verslag(verslag_id):
    try:
        verslag = VerslagHelper.get_verslag_by_id(verslag_id)
        if verslag:
            return jsonify(verslag)
        return jsonify({"error": "Verslag not found"}), 404
    except Exception as e:
        return handle_error(e, f"Failed to retrieve verslag {verslag_id}")

@app.route('/api/verslagen', methods=['POST'])
def create_verslag():
    data = request.get_json()
    app.logger.info(f"POST /api/verslagen data: {data}")
    if not data: return jsonify({"error": "No input data provided"}), 400

    required_keys = ['onderwerp', 'inhoud']
    missing_keys = [key for key in required_keys if key not in data or data[key] is None]
    if missing_keys:
         return jsonify({"error": f"Missing required fields: {', '.join(missing_keys)}"}), 400

    try:
        onderwerp_str = str(data['onderwerp']).strip()
        inhoud_str = str(data['inhoud']).strip()
        if not onderwerp_str: raise ValueError("Onderwerp cannot be empty.")
        if not inhoud_str: raise ValueError("Inhoud cannot be empty.")

        # Default booleans to False if not provided or invalid
        is_verzonden_val = data.get('isverzonden', False)
        if not isinstance(is_verzonden_val, bool): is_verzonden_val = False
        is_geaccepteerd_val = data.get('isgeaccepteerd', False)
        if not isinstance(is_geaccepteerd_val, bool): is_geaccepteerd_val = False

        # Handle optional nullable FK
        vlucht_cyclus_id_val = data.get('vlucht_cyclus_id') # Expect snake_case
        if vlucht_cyclus_id_val is not None:
            try:
                vlucht_cyclus_id_val = int(vlucht_cyclus_id_val)
            except (ValueError, TypeError):
                 raise ValueError("Invalid format for vlucht_cyclus_id, must be an integer or null")

        verslag = VerslagHelper.create_verslag(
            onderwerp=onderwerp_str,
            inhoud=inhoud_str,
            is_verzonden=is_verzonden_val,
            is_geaccepteerd=is_geaccepteerd_val,
            vlucht_cyclus_id=vlucht_cyclus_id_val # Pass the optional ID
        )
        if verslag:
            app.logger.info(f"Verslag created successfully: {verslag.get('Id')}")
            return jsonify(verslag), 201
        else:
             # Helper should raise ValueError on FK violation, but handle None just in case
             app.logger.error("VerslagHelper.create_verslag returned None.")
             return jsonify({"error": "Failed to create verslag"}), 500

    except (ValueError, TypeError) as ve:
        return handle_error(ve, "Invalid data for verslag", 400)
    except KeyError as ke:
         return handle_error(ke, f"Missing field: {ke}", 400)
    except Exception as e:
         return handle_error(e, "Error creating verslag")


@app.route('/api/verslagen/<int:verslag_id>', methods=['PUT'])
def update_verslag(verslag_id):
    data = request.get_json()
    app.logger.info(f"PUT /api/verslagen/{verslag_id} data: {data}")
    if not data: return jsonify({"error": "No input data provided"}), 400

    update_data = {} # Use PascalCase for helper kwargs
    try:
        if 'onderwerp' in data:
            onderwerp_str = str(data['onderwerp']).strip()
            if not onderwerp_str: raise ValueError("Onderwerp cannot be empty.")
            update_data['onderwerp'] = onderwerp_str
        if 'inhoud' in data:
            inhoud_str = str(data['inhoud']).strip()
            if not inhoud_str: raise ValueError("Inhoud cannot be empty.")
            update_data['inhoud'] = inhoud_str
        if 'isverzonden' in data:
             if not isinstance(data['isverzonden'], bool): raise ValueError("isverzonden must be boolean.")
             update_data['isverzonden'] = data['isverzonden']
        if 'isgeaccepteerd' in data:
             if not isinstance(data['isgeaccepteerd'], bool): raise ValueError("isgeaccepteerd must be boolean.")
             update_data['isgeaccepteerd'] = data['isgeaccepteerd']

        # Handle optional FK update (including setting to NULL)
        if 'vlucht_cyclus_id' in data: # Expect snake_case from JSON
            vc_id = data['vlucht_cyclus_id']
            if vc_id is None:
                 update_data['VluchtCyclusId'] = None # Pass None to helper
            else:
                 try:
                      update_data['VluchtCyclusId'] = int(vc_id) # Pass int to helper
                 except (ValueError, TypeError):
                      raise ValueError("Invalid format for vlucht_cyclus_id, must be an integer or null")

        if not update_data:
             return jsonify({"error": "No valid fields provided for update"}), 400

        verslag = VerslagHelper.update_verslag(verslag_id=verslag_id, **update_data)
        if verslag:
            app.logger.info(f"Verslag {verslag_id} updated successfully.")
            return jsonify(verslag)
        else:
             existing = VerslagHelper.get_verslag_by_id(verslag_id)
             if existing:
                 app.logger.error(f"Update failed for existing verslag {verslag_id}.")
                 return jsonify({"error": "Verslag update failed (check VluchtCyclusId?)"}), 500
             else:
                 return jsonify({"error": "Verslag not found"}), 404

    except (ValueError, TypeError) as ve:
        return handle_error(ve, "Invalid data type for update", 400)
    except Exception as e:
         # Specific FK error check might be needed if helper doesn't raise ValueError
         return handle_error(e, f"Error updating verslag {verslag_id}")

@app.route('/api/verslagen/<int:verslag_id>', methods=['DELETE'])
def delete_verslag(verslag_id):
    app.logger.info(f"DELETE /api/verslagen/{verslag_id}")
    try:
        # Note: Verslag.VluchtCyclusId has ON DELETE SET NULL, so this shouldn't be blocked by VluchtCyclus
        success = VerslagHelper.delete_verslag(verslag_id)
        if success:
            app.logger.info(f"Verslag {verslag_id} deleted successfully")
            return '', 204
        else:
            return jsonify({"error": "Verslag not found"}), 404
    except ValueError as ve: # Catch specific conflict errors if helper raises them
        return handle_error(ve, str(ve), 409)
    except Exception as e:
        return handle_error(e, f"Error deleting verslag {verslag_id}")

# --- Drone Routes (Verified OK - minor validation tweaks) ---
@app.route('/api/drones', methods=['GET'])
def get_drones():
    try:
        # Optional filtering by status
        status_filter = request.args.get('status')
        if status_filter:
            if status_filter not in DroneHelper.VALID_STATUSES:
                 return jsonify({"error": f"Invalid status filter. Must be one of: {', '.join(DroneHelper.VALID_STATUSES)}"}), 400
            # Add a helper DroneHelper.get_drones_by_status(status_filter) or filter directly
            try:
                response = supabase.table("Drone").select("*").eq("status", status_filter).execute()
                drones = response.data
            except Exception as db_e:
                 raise Exception(f"Database error filtering drones: {db_e}") from db_e
        else:
            drones = DroneHelper.get_all_drones()
        return jsonify(drones)
    except Exception as e:
        return handle_error(e, "Failed to fetch drones")


@app.route('/api/drones/<int:drone_id>', methods=['GET'])
def get_drone(drone_id):
    try:
        drone = DroneHelper.get_drone_by_id(drone_id)
        if drone:
            return jsonify(drone)
        else:
            return jsonify({"error": "Drone not found"}), 404
    except Exception as e:
        return handle_error(e, f"Failed to fetch drone {drone_id}")

@app.route('/api/drones', methods=['POST'])
def create_drone():
    data = request.get_json()
    app.logger.info(f"POST /api/drones data: {data}")
    if not data: return jsonify({"error": "No input data provided"}), 400

    required_keys = ['status', 'batterij', 'magOpstijgen'] # Assuming magOpstijgen is required on create
    missing_keys = [key for key in required_keys if key not in data] # Check key existence
    if missing_keys:
        return jsonify({"error": f"Missing required fields: {', '.join(missing_keys)}"}), 400

    try:
        # Validate types and values
        status_val = str(data['status'])
        if status_val not in DroneHelper.VALID_STATUSES:
             raise ValueError(f"Invalid status '{status_val}'. Must be one of: {', '.join(DroneHelper.VALID_STATUSES)}")

        batterij_val = data['batterij']
        if not isinstance(batterij_val, (int, float)): raise ValueError("Battery level must be a number.")
        batterij_int = int(batterij_val)
        if not (0 <= batterij_int <= 100): raise ValueError("Battery level must be between 0 and 100.")

        mag_opstijgen_val = data['magOpstijgen']
        if not isinstance(mag_opstijgen_val, bool): raise ValueError("magOpstijgen must be a boolean (true/false).")

        new_drone = DroneHelper.create_drone(
            status=status_val,
            batterij=batterij_int,
            mag_opstijgen=mag_opstijgen_val # Match DB column name 'magOpstijgen'
        )
        if new_drone:
            app.logger.info(f"Drone created successfully: {new_drone.get('Id')}")
            return jsonify(new_drone), 201
        else:
            app.logger.error("DroneHelper.create_drone returned None")
            return jsonify({"error": "Failed to create drone in database"}), 500
    except (ValueError, TypeError) as ve:
        return handle_error(ve, "Invalid data for drone", 400)
    except KeyError as ke:
        return handle_error(ke, f"Missing field: {ke}", 400)
    except Exception as e:
        return handle_error(e, "Error creating drone")


@app.route('/api/drones/<int:drone_id>', methods=['PUT'])
def update_drone(drone_id):
    data = request.get_json()
    app.logger.info(f"PUT /api/drones/{drone_id} data: {data}")
    if not data: return jsonify({"error": "No input data provided"}), 400

    update_data = {} # Use DB column names for helper kwargs
    try:
        if 'status' in data:
            status_val = str(data['status'])
            if status_val not in DroneHelper.VALID_STATUSES:
                raise ValueError(f"Invalid status '{status_val}'. Must be one of: {', '.join(DroneHelper.VALID_STATUSES)}")
            update_data['status'] = status_val
        if 'batterij' in data:
            batterij_val = data['batterij']
            if not isinstance(batterij_val, (int, float)): raise ValueError("Battery level must be a number.")
            batterij_int = int(batterij_val)
            if not (0 <= batterij_int <= 100): raise ValueError("Battery level must be between 0 and 100")
            update_data['batterij'] = batterij_int
        if 'magOpstijgen' in data:
            mag_opstijgen_val = data['magOpstijgen']
            if not isinstance(mag_opstijgen_val, bool): raise ValueError("magOpstijgen must be boolean.")
            update_data['magOpstijgen'] = mag_opstijgen_val # DB column name

        if not update_data: return jsonify({"error": "No valid fields provided for update"}), 400

        updated_drone = DroneHelper.update_drone(drone_id, **update_data)
        if updated_drone:
            app.logger.info(f"Drone {drone_id} updated successfully.")
            return jsonify(updated_drone)
        else:
             existing = DroneHelper.get_drone_by_id(drone_id)
             if existing:
                 app.logger.error(f"Update failed for existing drone {drone_id}.")
                 return jsonify({"error": "Drone update failed"}), 500
             else:
                 return jsonify({"error": "Drone not found"}), 404
    except (ValueError, TypeError) as ve:
        return handle_error(ve, "Invalid data for drone update", 400)
    except Exception as e:
        return handle_error(e, f"Error updating drone {drone_id}")

@app.route('/api/drones/<int:drone_id>', methods=['DELETE'])
def delete_drone(drone_id):
    app.logger.info(f"DELETE /api/drones/{drone_id}")
    try:
        success = DroneHelper.delete_drone(drone_id)
        if success:
            app.logger.info(f"Successfully deleted drone {drone_id}")
            return '', 204
        else:
            return jsonify({"error": "Drone not found"}), 404
    except ValueError as ve: # Catch specific error from helper for FK violation
        return handle_error(ve, str(ve), 409) # Conflict
    except Exception as e:
        return handle_error(e, f"Error deleting drone {drone_id}")


# --- Cyclus Routes ---
@app.route('/api/cycli', methods=['GET'])
def get_cycli():
    try:
        # Allow filtering by VluchtCyclusId
        vlucht_cyclus_id_str = request.args.get('vlucht_cyclus_id')
        if vlucht_cyclus_id_str:
             try:
                 vlucht_cyclus_id = int(vlucht_cyclus_id_str)
                 cycli = CyclusHelper.get_cycli_by_vlucht_cyclus(vlucht_cyclus_id) # Use helper
             except ValueError:
                 return jsonify({"error": "Invalid vlucht_cyclus_id parameter"}), 400
        else:
             cycli = CyclusHelper.get_all_cycli()
        return jsonify(cycli)
    except Exception as e:
        return handle_error(e, "Failed to retrieve cycli")

@app.route('/api/cycli/<int:cyclus_id>', methods=['GET'])
def get_cyclus(cyclus_id):
    try:
        cyclus = CyclusHelper.get_cyclus_by_id(cyclus_id)
        if cyclus:
            return jsonify(cyclus)
        return jsonify({"error": "Cyclus not found"}), 404
    except Exception as e:
        return handle_error(e, f"Failed to retrieve cyclus {cyclus_id}")

@app.route('/api/cycli', methods=['POST'])
def create_cyclus():
    data = request.get_json()
    app.logger.info(f"POST /api/cycli data: {data}")
    if not data: return jsonify({"error": "No input data provided"}), 400

    required_keys = ['startuur', 'tijdstip'] # VluchtCyclusId is optional
    missing_keys = [key for key in required_keys if key not in data or data[key] is None]
    if missing_keys:
         return jsonify({"error": f"Missing required fields: {', '.join(missing_keys)}"}), 400

    try:
        startuur_obj = time.fromisoformat(data['startuur'])
        tijdstip_obj = time.fromisoformat(data['tijdstip'])

        # Handle optional FK
        vlucht_cyclus_id_val = data.get('vlucht_cyclus_id')
        if vlucht_cyclus_id_val is not None:
            try:
                vlucht_cyclus_id_val = int(vlucht_cyclus_id_val)
            except (ValueError, TypeError):
                 raise ValueError("Invalid format for vlucht_cyclus_id, must be an integer or null")

        cyclus = CyclusHelper.create_cyclus(
            startuur=startuur_obj,
            tijdstip=tijdstip_obj,
            vlucht_cyclus_id=vlucht_cyclus_id_val
        )
        if cyclus:
            app.logger.info(f"Cyclus created successfully: {cyclus.get('Id')}")
            return jsonify(cyclus), 201
        else:
             app.logger.error("CyclusHelper.create_cyclus returned None.")
             return jsonify({"error": "Failed to create cyclus (check VluchtCyclusId?)"}), 500
    except (ValueError, TypeError) as ve:
        return handle_error(ve, "Invalid data for cyclus", 400)
    except KeyError as ke:
        return handle_error(ke, f"Missing field: {ke}", 400)
    except Exception as e:
        return handle_error(e, "Error creating cyclus")

@app.route('/api/cycli/<int:cyclus_id>', methods=['PUT'])
def update_cyclus(cyclus_id):
    data = request.get_json()
    app.logger.info(f"PUT /api/cycli/{cyclus_id} data: {data}")
    if not data: return jsonify({"error": "No input data provided"}), 400

    update_data = {} # Use DB column names (PascalCase) for helper kwargs
    try:
        if 'startuur' in data:
            update_data['startuur'] = time.fromisoformat(data['startuur']).isoformat() # Pass as string
        if 'tijdstip' in data:
            update_data['tijdstip'] = time.fromisoformat(data['tijdstip']).isoformat() # Pass as string
        if 'vlucht_cyclus_id' in data:
            vc_id = data['vlucht_cyclus_id']
            if vc_id is None:
                update_data['VluchtCyclusId'] = None
            else:
                try:
                    update_data['VluchtCyclusId'] = int(vc_id)
                except (ValueError, TypeError):
                    raise ValueError("Invalid format for vlucht_cyclus_id, must be an integer or null")

        if not update_data:
             return jsonify({"error": "No valid fields provided for update"}), 400

        cyclus = CyclusHelper.update_cyclus(cyclus_id=cyclus_id, **update_data)
        if cyclus:
            app.logger.info(f"Cyclus {cyclus_id} updated successfully.")
            return jsonify(cyclus)
        else:
            existing = CyclusHelper.get_cyclus_by_id(cyclus_id)
            if existing:
                 app.logger.error(f"Update failed for existing cyclus {cyclus_id}.")
                 return jsonify({"error": "Cyclus update failed (check VluchtCyclusId?)"}), 500
            else:
                return jsonify({"error": "Cyclus not found"}), 404
    except (ValueError, TypeError) as ve:
        return handle_error(ve, "Invalid data type for update", 400)
    except Exception as e:
        return handle_error(e, f"Error updating cyclus {cyclus_id}")

@app.route('/api/cycli/<int:cyclus_id>', methods=['DELETE'])
def delete_cyclus(cyclus_id):
    app.logger.info(f"DELETE /api/cycli/{cyclus_id}")
    try:
        # Helper now checks for DockingCyclus references and raises ValueError
        success = CyclusHelper.delete_cyclus(cyclus_id)
        if success:
            app.logger.info(f"Cyclus {cyclus_id} deleted successfully")
            return '', 204
        else:
            return jsonify({"error": "Cyclus not found"}), 404
    except ValueError as ve:
         # Catch the specific error raised by the helper for FK violation
         return handle_error(ve, str(ve), 409) # Conflict
    except Exception as e:
         # Catch other unexpected errors
         return handle_error(e, f"Error deleting cyclus {cyclus_id}")


# --- VluchtCyclus Routes ---
@app.route('/api/vlucht-cycli', methods=['GET'])
def get_vlucht_cycli():
    try:
        # Allow filtering by FKs in VluchtCyclus table
        filters = {}
        param_map = {
            'drone_id': 'DroneId',
            'zone_id': 'ZoneId',
            'plaats_id': 'PlaatsId',
            'verslag_id': 'VerslagId'
        }
        for param_key, db_col in param_map.items():
            param_val_str = request.args.get(param_key)
            if param_val_str:
                try:
                    filters[db_col] = int(param_val_str)
                except ValueError:
                    return jsonify({"error": f"Invalid {param_key} parameter"}), 400

        if filters:
             # Add helper VluchtCyclusHelper.get_vlucht_cycli_filtered(**filters) or query directly
            try:
                query = supabase.table("VluchtCyclus").select("*")
                for col, val in filters.items():
                     query = query.eq(col, val)
                response = query.execute()
                vlucht_cycli = response.data
            except Exception as db_e:
                 raise Exception(f"Database error filtering vlucht cycli: {db_e}") from db_e
        else:
            vlucht_cycli = VluchtCyclusHelper.get_all_vlucht_cycli()
        return jsonify(vlucht_cycli)
    except Exception as e:
        return handle_error(e, "Failed to retrieve vlucht cycli")

@app.route('/api/vlucht-cycli/<int:vlucht_cyclus_id>', methods=['GET'])
def get_vlucht_cyclus(vlucht_cyclus_id):
    try:
        vlucht_cyclus = VluchtCyclusHelper.get_vlucht_cyclus_by_id(vlucht_cyclus_id)
        if vlucht_cyclus:
            return jsonify(vlucht_cyclus)
        return jsonify({"error": "VluchtCyclus not found"}), 404
    except Exception as e:
        return handle_error(e, f"Failed to retrieve VluchtCyclus {vlucht_cyclus_id}")

@app.route('/api/vlucht-cycli', methods=['POST'])
def create_vlucht_cyclus():
    data = request.get_json()
    app.logger.info(f"POST /api/vlucht-cycli data: {data}")
    # No strictly required fields based on DB (all FKs nullable), but maybe enforce one?
    if not data: return jsonify({"error": "No input data provided"}), 400

    try:
        # Extract optional FKs (expect snake_case from JSON)
        fk_values = {}
        param_map = {
            'verslag_id': 'verslag_id', # JSON key -> helper param name
            'plaats_id': 'plaats_id',
            'drone_id': 'drone_id',
            'zone_id': 'zone_id'
        }
        for json_key, helper_param in param_map.items():
            val = data.get(json_key)
            if val is not None:
                try:
                    fk_values[helper_param] = int(val)
                except (ValueError, TypeError):
                     raise ValueError(f"Invalid format for {json_key}, must be an integer or null")
            else:
                fk_values[helper_param] = None # Explicitly pass None

        # Maybe require at least one FK to be provided?
        # if not any(fk_values.values()):
        #     return jsonify({"error": "At least one ID (verslag, plaats, drone, or zone) must be provided"}), 400

        vlucht_cyclus = VluchtCyclusHelper.create_vlucht_cyclus(**fk_values)

        if vlucht_cyclus:
            app.logger.info(f"VluchtCyclus created successfully: {vlucht_cyclus.get('Id')}")
            return jsonify(vlucht_cyclus), 201
        else:
            app.logger.error("VluchtCyclusHelper.create_vlucht_cyclus returned None.")
            return jsonify({"error": "Failed to create VluchtCyclus (check reference IDs?)"}), 500
    except (ValueError, TypeError) as ve:
        return handle_error(ve, "Invalid ID format for VluchtCyclus", 400)
    except KeyError as ke:
         return handle_error(ke, f"Missing field: {ke}", 400)
    except Exception as e:
        return handle_error(e, "Error creating VluchtCyclus")


@app.route('/api/vlucht-cycli/<int:vlucht_cyclus_id>', methods=['PUT'])
def update_vlucht_cyclus(vlucht_cyclus_id):
    data = request.get_json()
    app.logger.info(f"PUT /api/vlucht-cycli/{vlucht_cyclus_id} data: {data}")
    if not data: return jsonify({"error": "No input data provided"}), 400

    update_data = {} # Use PascalCase for helper kwargs
    try:
        # Map JSON snake_case keys to DB PascalCase keys
        param_map = {
            'verslag_id': 'VerslagId',
            'plaats_id': 'PlaatsId',
            'drone_id': 'DroneId',
            'zone_id': 'ZoneId'
        }
        for json_key, db_key in param_map.items():
             if json_key in data:
                 val = data[json_key]
                 if val is None:
                     update_data[db_key] = None
                 else:
                     try:
                         update_data[db_key] = int(val)
                     except (ValueError, TypeError):
                          raise ValueError(f"Invalid format for {json_key}, must be an integer or null")

        if not update_data:
             return jsonify({"error": "No valid fields provided for update"}), 400

        vlucht_cyclus = VluchtCyclusHelper.update_vlucht_cyclus(
            vlucht_cyclus_id=vlucht_cyclus_id, **update_data
        )
        if vlucht_cyclus:
             app.logger.info(f"VluchtCyclus {vlucht_cyclus_id} updated successfully.")
             return jsonify(vlucht_cyclus)
        else:
            existing = VluchtCyclusHelper.get_vlucht_cyclus_by_id(vlucht_cyclus_id)
            if existing:
                 app.logger.error(f"Update failed for existing VluchtCyclus {vlucht_cyclus_id}.")
                 return jsonify({"error": "VluchtCyclus update failed (check reference IDs?)"}), 500
            else:
                return jsonify({"error": "VluchtCyclus not found"}), 404
    except (ValueError, TypeError) as ve:
        return handle_error(ve, "Invalid ID format for update", 400)
    except Exception as e:
        return handle_error(e, f"Error updating VluchtCyclus {vlucht_cyclus_id}")

@app.route('/api/vlucht-cycli/<int:vlucht_cyclus_id>', methods=['DELETE'])
def delete_vlucht_cyclus(vlucht_cyclus_id):
    app.logger.info(f"DELETE /api/vlucht-cycli/{vlucht_cyclus_id}")
    try:
        # Helper checks for Cyclus reference and raises ValueError (409)
        success = VluchtCyclusHelper.delete_vlucht_cyclus(vlucht_cyclus_id)
        if success:
            app.logger.info(f"VluchtCyclus {vlucht_cyclus_id} deleted successfully")
            return '', 204
        else:
            return jsonify({"error": "VluchtCyclus not found"}), 404
    except ValueError as ve: # Catch specific error from helper for FK violation
        return handle_error(ve, str(ve), 409) # Conflict
    except Exception as e:
        return handle_error(e, f"Error deleting VluchtCyclus {vlucht_cyclus_id}")


# --- DockingCyclus Routes ---
@app.route('/api/docking-cycli', methods=['GET'])
def get_docking_cycli():
    try:
        # Allow filtering by FKs
        filters = {}
        param_map = {
            'drone_id': 'DroneId',
            'docking_id': 'DockingId',
            'cyclus_id': 'CyclusId'
        }
        for param_key, db_col in param_map.items():
            param_val_str = request.args.get(param_key)
            if param_val_str:
                try:
                    filters[db_col] = int(param_val_str)
                except ValueError:
                    return jsonify({"error": f"Invalid {param_key} parameter"}), 400

        if filters:
             # Use specific helpers or direct query
             try:
                query = supabase.table("DockingCyclus").select("*")
                for col, val in filters.items():
                     query = query.eq(col, val)
                response = query.execute()
                docking_cycli = response.data
             except Exception as db_e:
                 raise Exception(f"Database error filtering docking cycli: {db_e}") from db_e
             # Example using helpers:
             # if 'CyclusId' in filters:
             #     docking_cycli = DockingCyclusHelper.get_docking_cycli_by_cyclus(filters['CyclusId'])
             # # Add similar logic for other filters or combine if needed
        else:
            docking_cycli = DockingCyclusHelper.get_all_docking_cycli()
        return jsonify(docking_cycli)
    except Exception as e:
        return handle_error(e, "Failed to retrieve docking cycli")

@app.route('/api/docking-cycli/<int:docking_cyclus_id>', methods=['GET'])
def get_docking_cyclus(docking_cyclus_id):
    try:
        docking_cyclus = DockingCyclusHelper.get_docking_cyclus_by_id(docking_cyclus_id)
        if docking_cyclus:
            return jsonify(docking_cyclus)
        return jsonify({"error": "DockingCyclus not found"}), 404
    except Exception as e:
        return handle_error(e, f"Failed to retrieve DockingCyclus {docking_cyclus_id}")

@app.route('/api/docking-cycli', methods=['POST'])
def create_docking_cyclus():
    data = request.get_json()
    app.logger.info(f"POST /api/docking-cycli data: {data}")
    if not data: return jsonify({"error": "No input data provided"}), 400

    # FKs seem required based on schema
    required_keys = ['drone_id', 'docking_id', 'cyclus_id']
    missing_keys = [key for key in required_keys if key not in data or data[key] is None]
    if missing_keys:
         return jsonify({"error": f"Missing required fields: {', '.join(missing_keys)}"}), 400

    try:
        drone_id_val = int(data['drone_id'])
        docking_id_val = int(data['docking_id'])
        cyclus_id_val = int(data['cyclus_id'])

        # Call helper with validated IDs
        docking_cyclus = DockingCyclusHelper.create_docking_cyclus(
            drone_id=drone_id_val,
            docking_id=docking_id_val,
            cyclus_id=cyclus_id_val
        )
        if docking_cyclus:
            app.logger.info(f"DockingCyclus created successfully: {docking_cyclus.get('Id')}")
            return jsonify(docking_cyclus), 201
        else:
            app.logger.error("DockingCyclusHelper.create_docking_cyclus returned None.")
            return jsonify({"error": "Failed to create DockingCyclus (check reference IDs?)"}), 500
    except (ValueError, TypeError) as ve:
        # Catches explicit ValueError from helper on FK violation or int conversion error
        return handle_error(ve, "Invalid data for DockingCyclus", 400)
    except KeyError as ke:
        return handle_error(ke, f"Missing field: {ke}", 400)
    except Exception as e:
        return handle_error(e, "Error creating DockingCyclus")

@app.route('/api/docking-cycli/<int:docking_cyclus_id>', methods=['PUT'])
def update_docking_cyclus(docking_cyclus_id):
    data = request.get_json()
    app.logger.info(f"PUT /api/docking-cycli/{docking_cyclus_id} data: {data}")
    if not data: return jsonify({"error": "No input data provided"}), 400

    update_data = {} # Use PascalCase for helper kwargs
    try:
        # Map JSON snake_case keys to DB PascalCase keys
        param_map = {
            'drone_id': 'DroneId',
            'docking_id': 'DockingId',
            'cyclus_id': 'CyclusId'
        }
        for json_key, db_key in param_map.items():
             if json_key in data:
                 val = data[json_key]
                 # FKs are likely NOT NULL, so don't allow None
                 if val is None:
                      raise ValueError(f"{json_key} cannot be null for DockingCyclus.")
                 try:
                     update_data[db_key] = int(val)
                 except (ValueError, TypeError):
                      raise ValueError(f"Invalid format for {json_key}, must be an integer.")

        if not update_data:
             return jsonify({"error": "No valid fields provided for update"}), 400

        docking_cyclus = DockingCyclusHelper.update_docking_cyclus(
             docking_cyclus_id=docking_cyclus_id, **update_data
        )
        if docking_cyclus:
            app.logger.info(f"DockingCyclus {docking_cyclus_id} updated successfully.")
            return jsonify(docking_cyclus)
        else:
             existing = DockingCyclusHelper.get_docking_cyclus_by_id(docking_cyclus_id)
             if existing:
                 app.logger.error(f"Update failed for existing DockingCyclus {docking_cyclus_id}.")
                 return jsonify({"error": "DockingCyclus update failed (check reference IDs?)"}), 500
             else:
                 return jsonify({"error": "DockingCyclus not found"}), 404
    except (ValueError, TypeError) as ve:
        return handle_error(ve, "Invalid data for DockingCyclus update", 400)
    except Exception as e:
        return handle_error(e, f"Error updating DockingCyclus {docking_cyclus_id}")

@app.route('/api/docking-cycli/<int:docking_cyclus_id>', methods=['DELETE'])
def delete_docking_cyclus(docking_cyclus_id):
    app.logger.info(f"DELETE /api/docking-cycli/{docking_cyclus_id}")
    try:
        success = DockingCyclusHelper.delete_docking_cyclus(docking_cyclus_id)
        if success:
            app.logger.info(f"DockingCyclus {docking_cyclus_id} deleted successfully")
            return '', 204
        else:
            return jsonify({"error": "DockingCyclus not found"}), 404
    except Exception as e:
        # This table isn't referenced by others, so FK errors unlikely on delete
        return handle_error(e, f"Error deleting DockingCyclus {docking_cyclus_id}")


# --- Docking Routes (Add basic CRUD similar to Startplaats if needed) ---
@app.route('/api/docking', methods=['GET'])
def get_docking_stations():
    try:
        is_beschikbaar_str = request.args.get('isbeschikbaar')
        is_beschikbaar = str_to_bool(is_beschikbaar_str)

        if is_beschikbaar is True:
             stations = DockingHelper.get_available_dockings()
        elif is_beschikbaar is False:
             # Add helper or filter directly
             try:
                  response = supabase.table("Docking").select("*").eq("isbeschikbaar", False).execute()
                  stations = response.data
             except Exception as db_e:
                  raise Exception(f"Database error filtering docking stations: {db_e}") from db_e
        else:
             stations = DockingHelper.get_all_dockings()
        return jsonify(stations)
    except Exception as e:
        return handle_error(e, "Failed to retrieve docking stations")

@app.route('/api/docking/<int:docking_id>', methods=['GET'])
def get_docking_station(docking_id):
    try:
        station = DockingHelper.get_docking_by_id(docking_id)
        if station:
            return jsonify(station)
        return jsonify({"error": "Docking station not found"}), 404
    except Exception as e:
        return handle_error(e, f"Failed to retrieve docking station {docking_id}")


@app.route('/api/docking', methods=['POST'])
def create_docking_station():
    data = request.get_json()
    app.logger.info(f"POST /api/docking data: {data}")
    if not data: return jsonify({"error": "No input data provided"}), 400

    if 'locatie' not in data or data['locatie'] is None:
        return jsonify({"error": "Missing required field: locatie"}), 400

    try:
        locatie_str = str(data['locatie']).strip()
        if not locatie_str: raise ValueError("Location (locatie) cannot be empty.")

        is_beschikbaar_val = data.get('isbeschikbaar', True)
        if not isinstance(is_beschikbaar_val, bool):
             app.logger.warning("Invalid type for 'isbeschikbaar' in POST /api/docking, defaulting to True.")
             is_beschikbaar_val = True

        station = DockingHelper.create_docking(
            locatie=locatie_str,
            is_beschikbaar=is_beschikbaar_val
        )
        if station:
            app.logger.info(f"Docking station created successfully: {station.get('Id')}")
            return jsonify(station), 201
        else:
            app.logger.error("DockingHelper.create_docking returned None.")
            return jsonify({"error": "Failed to create docking station"}), 500
    except (ValueError, TypeError) as ve:
        return handle_error(ve, "Invalid data for docking station", 400)
    except KeyError as ke:
         return handle_error(ke, f"Missing field: {ke}", 400)
    except Exception as e:
        return handle_error(e, "Error creating docking station")

@app.route('/api/docking/<int:docking_id>', methods=['PUT'])
def update_docking_station(docking_id):
    data = request.get_json()
    app.logger.info(f"PUT /api/docking/{docking_id} data: {data}")
    if not data: return jsonify({"error": "No input data provided"}), 400

    update_data = {}
    try:
        if 'locatie' in data:
            locatie_str = str(data['locatie']).strip()
            if not locatie_str: raise ValueError("Location (locatie) cannot be empty.")
            update_data['locatie'] = locatie_str
        if 'isbeschikbaar' in data:
            if not isinstance(data['isbeschikbaar'], bool):
                 raise ValueError("isbeschikbaar must be a boolean (true/false).")
            update_data['isbeschikbaar'] = data['isbeschikbaar']

        if not update_data:
             return jsonify({"error": "No valid fields provided for update"}), 400

        station = DockingHelper.update_docking(docking_id=docking_id, **update_data)
        if station:
             app.logger.info(f"Docking station {docking_id} updated successfully.")
             return jsonify(station)
        else:
             existing = DockingHelper.get_docking_by_id(docking_id)
             if existing:
                 app.logger.error(f"Update failed for existing docking station {docking_id}.")
                 return jsonify({"error": "Docking station update failed"}), 500
             else:
                 return jsonify({"error": "Docking station not found"}), 404
    except ValueError as ve:
        return handle_error(ve, "Invalid data type for update", 400)
    except Exception as e:
        return handle_error(e, f"Error updating docking station {docking_id}")


@app.route('/api/docking/<int:docking_id>', methods=['DELETE'])
def delete_docking_station(docking_id):
    app.logger.info(f"DELETE /api/docking/{docking_id}")
    try:
        success = DockingHelper.delete_docking(docking_id)
        if success:
            app.logger.info(f"Docking station {docking_id} deleted successfully")
            return '', 204
        else:
            return jsonify({"error": "Docking station not found"}), 404
    except ValueError as ve: # Catch specific error from helper for FK violation
        return handle_error(ve, str(ve), 409) # Conflict
    except Exception as e:
        return handle_error(e, f"Error deleting docking station {docking_id}")


# --- Dashboard Routes (Commented/Corrected) ---

# THIS ROUTE IS PROBLEMATIC: Needs redesign based on actual DB schema.
# Evenement does NOT directly link to Startplaats, Docking, or Drone.
# Links are: Evenement -> Zone -> VluchtCyclus -> Drone/Startplaats
#           Evenement -> Zone -> VluchtCyclus <- Cyclus -> DockingCyclus -> Drone/Docking
# You need JOINs or multiple queries to gather this info.
# @app.route('/api/dashboard/event-overview/<int:event_id>', methods=['GET'])
# def get_event_overview(event_id):
#     app.logger.warning("Route /api/dashboard/event-overview/<id> needs complete redesign based on DB schema")
#     try:
#         # 1. Get Event details
#         event = EvenementHelper.get_event_by_id(event_id)
#         if not event: return jsonify({"error": "Event not found"}), 404
#
#         # 2. Get Zones for this Event
#         zones = ZoneHelper.get_zones_by_event(event_id)
#         zone_ids = [z['Id'] for z in zones]
#
#         # 3. Get VluchtCycli associated with these Zones
#         vlucht_cycli = []
#         if zone_ids:
#             # Need helper or direct query: VluchtCyclusHelper.get_vlucht_cycli_by_zone_ids(zone_ids)
#             # Direct query example:
#             response = supabase.table("VluchtCyclus").select("*").in_("ZoneId", zone_ids).execute()
#             vlucht_cycli = response.data
#
#         # 4. Extract unique Drone IDs, Startplaats IDs from VluchtCycli
#         drone_ids = {vc['DroneId'] for vc in vlucht_cycli if vc.get('DroneId')}
#         startplaats_ids = {vc['PlaatsId'] for vc in vlucht_cycli if vc.get('PlaatsId')}
#         vlucht_cyclus_ids = {vc['Id'] for vc in vlucht_cycli}
#
#         # 5. Get details for these Drones and Startplaatsen
#         drones = []
#         if drone_ids:
#             response = supabase.table("Drone").select("*").in_("Id", list(drone_ids)).execute()
#             drones = response.data
#
#         startplaatsen = []
#         if startplaats_ids:
#              response = supabase.table("Startplaats").select("*").in_("Id", list(startplaats_ids)).execute()
#              startplaatsen = response.data
#
#         # 6. Get Cycli associated with these VluchtCycli
#         cycli = []
#         if vlucht_cyclus_ids:
#              response = supabase.table("Cyclus").select("*").in_("VluchtCyclusId", list(vlucht_cyclus_ids)).execute()
#              cycli = response.data
#
#         # 7. Get DockingCycli associated with these Cycli (more complex, maybe aggregate later)
#         # ...
#
#         overview = {
#             "event": event,
#             "zones": zones,
#             "vlucht_cycli_count": len(vlucht_cycli),
#             "associated_drones": drones, # Or just count/status summary
#             "associated_startplaatsen": startplaatsen, # Or just count/availability summary
#             "associated_cycli_count": len(cycli),
#             # Add more aggregated stats as needed
#         }
#         return jsonify(overview)
#
#     except Exception as e:
#          return handle_error(e, f"Error generating event overview for {event_id}")


@app.route('/api/dashboard/drone-status', methods=['GET'])
def get_drone_status():
    # This dashboard provides overall drone status, not specific to an event
    # (as Drone table doesn't link directly to Evenement)
    app.logger.info("GET /api/dashboard/drone-status")
    try:
        drones = DroneHelper.get_all_drones()
        status_counts = {status: 0 for status in DroneHelper.VALID_STATUSES}
        total_battery = 0
        count_with_battery = 0
        operational_drones = 0
        ready_to_fly_drones = 0

        for drone in drones:
            status = drone.get('status', 'Unknown')
            if status in status_counts:
                status_counts[status] += 1
            else: # Should not happen if VALID_STATUSES is correct
                status_counts['Unknown'] = status_counts.get('Unknown', 0) + 1

            battery = drone.get('batterij') # Correct key from DB
            if battery is not None:
                 total_battery += battery
                 count_with_battery += 1

            if status == 'AVAILABLE':
                 operational_drones += 1
                 if drone.get('magOpstijgen') is True:
                     ready_to_fly_drones +=1
            elif status == 'IN_USE':
                 operational_drones += 1


        avg_battery = round(total_battery / count_with_battery) if count_with_battery > 0 else 0

        return jsonify({
            "total_drones": len(drones),
            "status_distribution": status_counts,
            "average_battery_level_percent": avg_battery,
            "operational_drones": operational_drones,
            "ready_to_fly_drones": ready_to_fly_drones,
            # "drones": drones # Maybe remove this if the list is large and sensitive
        })
    except Exception as e:
        return handle_error(e, "Error getting drone status dashboard")


# THIS ROUTE IS PROBLEMATIC / NEEDS REDESIGN:
# The original assumes relationships that don't exist (e.g., multiple VluchtCycli per Cyclus).
# Correct relationship: Cyclus *can* have ONE VluchtCyclusId. DockingCyclus links to Cyclus.
# So an overview for a Cyclus should show its details, its *single* linked VluchtCyclus (if any),
# and all DockingCycli linked to it.
# @app.route('/api/dashboard/cyclus-overview/<int:cyclus_id>', methods=['GET'])
# def get_cyclus_overview(cyclus_id):
#      app.logger.warning("Route /api/dashboard/cyclus-overview needs careful redesign based on DB schema")
#      try:
#          cyclus = CyclusHelper.get_cyclus_by_id(cyclus_id)
#          if not cyclus:
#              return jsonify({"error": "Cyclus not found"}), 404
#
#          # Fetch DockingCycli linked TO this Cyclus (Correct relationship)
#          docking_cycli_list = DockingCyclusHelper.get_docking_cycli_by_cyclus(cyclus_id)
#
#          # Fetch the SINGLE VluchtCyclus associated via Cyclus.VluchtCyclusId (if exists)
#          vlucht_cyclus_id = cyclus.get("VluchtCyclusId")
#          vlucht_cyclus_details = None
#          if vlucht_cyclus_id:
#              vlucht_cyclus_details = VluchtCyclusHelper.get_vlucht_cyclus_by_id(vlucht_cyclus_id)
#              # Optionally enrich VluchtCyclus details (e.g., fetch linked Drone/Zone/Verslag names)
#              # if vlucht_cyclus_details:
#              #    drone_id = vlucht_cyclus_details.get('DroneId')
#              #    if drone_id: vlucht_cyclus_details['drone_info'] = DroneHelper.get_drone_by_id(drone_id)
#              #    # ... similar for zone, verslag, plaats ...
#
#          # Aggregate data based on available info
#          # Example: Get unique drones involved in docking for this cyclus
#          docking_drone_ids = {dc['DroneId'] for dc in docking_cycli_list if dc.get('DroneId')}
#          docking_drones = []
#          if docking_drone_ids:
#              response = supabase.table("Drone").select("Id, status").in_("Id", list(docking_drone_ids)).execute()
#              docking_drones = response.data
#
#          overview = {
#              "cyclus": cyclus,
#              "associated_vlucht_cyclus": vlucht_cyclus_details,
#              "docking_info": {
#                   "total_docking_events": len(docking_cycli_list),
#                   "involved_drones": docking_drones, # List of drones involved in docking
#                   "docking_cycli_records": docking_cycli_list # Full records if needed
#              }
#          }
#          return jsonify(overview)
#      except Exception as e:
#         return handle_error(e, f"Error getting cyclus overview dashboard for {cyclus_id}")


# Run the application
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5328))
    # Use FLASK_DEBUG env var for debug mode control
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

    app.logger.info(f'Flask app starting on port {port} in {"DEBUG" if debug_mode else "PRODUCTION"} mode')
    # host='0.0.0.0' makes it accessible externally, use '127.0.0.1' for local only
    app.run(host='0.0.0.0', port=port, debug=debug_mode)