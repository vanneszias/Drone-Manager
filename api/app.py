from flask import Flask, request, jsonify
from datetime import date, time
import os
import traceback
from dotenv import load_dotenv

# Import all helper classes
from .helpers import (
    EvenementHelper,
    ZoneHelper,
    StartplaatsHelper,
    VerslagHelper,
    DroneHelper,
    DockingHelper, # Import DockingHelper if needed
    CyclusHelper,
    VluchtCyclusHelper,
    DockingCyclusHelper
)

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# --- Helper Function for Parsing Boolean Query Params ---
def str_to_bool(s):
    if s is None:
        return None
    return s.lower() in ['true', '1', 't', 'y', 'yes']

# --- Evenement Routes ---
@app.route('/api/events', methods=['GET'])
def get_events():
    try:
        events = EvenementHelper.get_all_events()
        return jsonify(events)
    except Exception as e:
        app.logger.error(f"Error getting events: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    try:
        event = EvenementHelper.get_event_by_id(event_id)
        if event:
            return jsonify(event)
        return jsonify({"error": "Event not found"}), 404
    except Exception as e:
        app.logger.error(f"Error getting event {event_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/events', methods=['POST'])
def create_event():
    data = request.get_json()
    app.logger.info(f"Received POST /api/events request data: {data}")

    if not data:
        app.logger.warning("No data received for POST /api/events")
        return jsonify({"error": "No input data provided"}), 400

    required_keys = ['start_datum', 'eind_datum', 'start_tijd', 'tijdsduur', 'naam']
    missing_keys = [key for key in required_keys if key not in data]
    if missing_keys:
        error_msg = f"Missing required fields: {', '.join(missing_keys)}"
        app.logger.error(error_msg)
        return jsonify({"error": error_msg}), 400

    try:
        event = EvenementHelper.create_event(
            start_datum=date.fromisoformat(data['start_datum']),
            eind_datum=date.fromisoformat(data['eind_datum']),
            start_tijd=time.fromisoformat(data['start_tijd']),
            tijdsduur=time.fromisoformat(data['tijdsduur']),
            naam=data['naam']
        )
        if event:
            app.logger.info(f"Event created successfully: {event}")
            return jsonify(event), 201
        else:
             app.logger.error("EvenementHelper.create_event returned None")
             return jsonify({"error": "Failed to create event in database"}), 500
    except (ValueError, TypeError) as ve: # Catch format/type errors
        error_msg = f"Invalid date, time, or data type: {ve}"
        app.logger.error(error_msg)
        return jsonify({"error": error_msg}), 400
    except KeyError as ke:
        error_msg = f"Missing required field: {ke}"
        app.logger.error(error_msg)
        return jsonify({"error": error_msg}), 400
    except Exception as e:
        app.logger.error(f"Error creating event: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    data = request.get_json()
    app.logger.info(f"Received PUT /api/events/{event_id} request data: {data}")
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    update_data = {}
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
            update_data['Naam'] = data['naam']

        if not update_data:
             return jsonify({"error": "No valid fields provided for update"}), 400

        # Call helper with explicit DB column names (or ensure helper handles conversion)
        event = EvenementHelper.update_event(event_id=event_id, **update_data)

        if event:
            app.logger.info(f"Event {event_id} updated successfully: {event}")
            return jsonify(event)
        else:
            return jsonify({"error": "Event not found or update failed"}), 404
    except (ValueError, TypeError) as ve:
        error_msg = f"Invalid date, time, or data type for update: {ve}"
        app.logger.error(error_msg)
        return jsonify({"error": error_msg}), 400
    except Exception as e:
        app.logger.error(f"Error updating event {event_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    app.logger.info(f"Received DELETE /api/events/{event_id} request")
    try:
        success = EvenementHelper.delete_event(event_id)
        if success:
            app.logger.info(f"Event {event_id} deleted successfully")
            return '', 204 # Standard practice for DELETE success
        else:
            return jsonify({"error": "Event not found"}), 404
    except Exception as e:
        app.logger.error(f"Error deleting event {event_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

# --- Zone Routes ---
@app.route('/api/zones', methods=['GET'])
def get_zones():
    try:
        # Correct: Filter by EvenementId if provided
        event_id = request.args.get('event_id')
        if event_id:
            zones = ZoneHelper.get_zones_by_event(int(event_id))
        else:
            zones = ZoneHelper.get_all_zones()
        return jsonify(zones)
    except ValueError:
         return jsonify({"error": "Invalid event_id provided"}), 400
    except Exception as e:
        app.logger.error(f"Error getting zones: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/zones/<int:zone_id>', methods=['GET'])
def get_zone(zone_id):
    try:
        zone = ZoneHelper.get_zone_by_id(zone_id)
        if zone:
            return jsonify(zone)
        return jsonify({"error": "Zone not found"}), 404
    except Exception as e:
        app.logger.error(f"Error getting zone {zone_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/zones', methods=['POST'])
def create_zone():
    data = request.get_json()
    app.logger.info(f"Received POST /api/zones request data: {data}")

    if not data:
         app.logger.warning("No data received for POST /api/zones")
         return jsonify({"error": "No input data provided"}), 400

    # Correct: Keys based on DB schema
    required_keys = ['naam', 'breedte', 'lengte', 'evenement_id']
    missing_keys = [key for key in required_keys if key not in data]
    if missing_keys:
        error_msg = f"Missing required fields: {', '.join(missing_keys)}"
        app.logger.error(error_msg)
        return jsonify({"error": error_msg}), 400

    try:
        breedte_val = float(data['breedte'])
        lengte_val = float(data['lengte'])
        evenement_id_val = int(data['evenement_id'])
        naam_val = str(data['naam'])

        if breedte_val <= 0 or lengte_val <= 0:
            raise ValueError("Width (breedte) and Length (lengte) must be positive numbers.")
        if not naam_val.strip():
             raise ValueError("Zone name (naam) cannot be empty.")

        # Correct: Call helper with DB fields
        zone = ZoneHelper.create_zone(
            breedte=breedte_val,
            lengte=lengte_val,
            naam=naam_val,
            evenement_id=evenement_id_val
        )

        if zone:
            app.logger.info(f"Zone created successfully: {zone}")
            return jsonify(zone), 201
        else:
             app.logger.error("ZoneHelper.create_zone returned None")
             return jsonify({"error": "Failed to create zone in database"}), 500

    except (KeyError, ValueError, TypeError) as e: # Catch specific data errors
        error_msg = f"Invalid or missing zone data: {e}"
        app.logger.error(f"{error_msg}\n{traceback.format_exc()}")
        return jsonify({"error": error_msg}), 400
    except Exception as e:
        app.logger.error(f"Error creating zone: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/zones/<int:zone_id>', methods=['PUT'])
def update_zone(zone_id):
    data = request.get_json()
    app.logger.info(f"Received PUT /api/zones/{zone_id} request data: {data}")
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    update_data = {}
    try:
        # Correct: Update based on DB fields
        if 'naam' in data:
            update_data['naam'] = str(data['naam'])
            if not update_data['naam'].strip():
                 raise ValueError("Zone name (naam) cannot be empty.")
        if 'breedte' in data:
            update_data['breedte'] = float(data['breedte'])
            if update_data['breedte'] <= 0:
                raise ValueError("Width (breedte) must be positive.")
        if 'lengte' in data:
            update_data['lengte'] = float(data['lengte'])
            if update_data['lengte'] <= 0:
                raise ValueError("Length (lengte) must be positive.")
        if 'evenement_id' in data:
            update_data['EvenementId'] = int(data['evenement_id']) # Match DB column casing if helper expects kwargs directly

        if not update_data:
             return jsonify({"error": "No valid fields provided for update"}), 400

        zone = ZoneHelper.update_zone(zone_id=zone_id, **update_data)

        if zone:
            app.logger.info(f"Zone {zone_id} updated successfully: {zone}")
            return jsonify(zone)
        else:
            return jsonify({"error": "Zone not found or update failed"}), 404
    except (ValueError, TypeError) as ve:
        error_msg = f"Invalid data type for update: {ve}"
        app.logger.error(error_msg)
        return jsonify({"error": error_msg}), 400
    except Exception as e:
        app.logger.error(f"Error updating zone {zone_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/zones/<int:zone_id>', methods=['DELETE'])
def delete_zone(zone_id):
    app.logger.info(f"Received DELETE /api/zones/{zone_id} request")
    try:
        success = ZoneHelper.delete_zone(zone_id)
        if success:
            app.logger.info(f"Zone {zone_id} deleted successfully")
            return '', 204
        else:
            return jsonify({"error": "Zone not found"}), 404
    except Exception as e:
        app.logger.error(f"Error deleting zone {zone_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

# --- Startplaats Routes (Corrected based on DB Schema) ---
@app.route('/api/startplaatsen', methods=['GET'])
def get_startplaatsen():
    try:
        # Correct: No filtering by event_id. Maybe filter by isbeschikbaar?
        is_beschikbaar_str = request.args.get('isbeschikbaar')
        is_beschikbaar = str_to_bool(is_beschikbaar_str)

        if is_beschikbaar is True:
             startplaatsen = StartplaatsHelper.get_available_startplaatsen()
        elif is_beschikbaar is False:
             # Assuming a helper exists or filtering directly
             response = supabase.table("Startplaats").select("*").eq("isbeschikbaar", False).execute()
             startplaatsen = response.data
        else:
             startplaatsen = StartplaatsHelper.get_all_startplaatsen()
        return jsonify(startplaatsen)
    except Exception as e:
        app.logger.error(f"Error getting startplaatsen: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@app.route('/api/startplaatsen/<int:startplaats_id>', methods=['GET'])
def get_startplaats(startplaats_id):
    try:
        startplaats = StartplaatsHelper.get_startplaats_by_id(startplaats_id)
        if startplaats:
            return jsonify(startplaats)
        return jsonify({"error": "Startplaats not found"}), 404
    except Exception as e:
        app.logger.error(f"Error getting startplaats {startplaats_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/startplaatsen', methods=['POST'])
def create_startplaats():
    data = request.get_json()
    app.logger.info(f"Received POST /api/startplaatsen request data: {data}")
    if not data:
         return jsonify({"error": "No input data provided"}), 400

    # Correct: Expect 'locatie' and optional 'isbeschikbaar'
    if 'locatie' not in data:
        return jsonify({"error": "Missing required field: locatie"}), 400

    try:
        locatie_val = str(data['locatie'])
        # Default isbeschikbaar to True if not provided or invalid
        is_beschikbaar_val = data.get('isbeschikbaar', True)
        if not isinstance(is_beschikbaar_val, bool):
             is_beschikbaar_val = True # Default to True on invalid input

        if not locatie_val.strip():
             raise ValueError("Location (locatie) cannot be empty.")

        # Correct: Call helper with DB fields
        startplaats = StartplaatsHelper.create_startplaats(
            locatie=locatie_val,
            is_beschikbaar=is_beschikbaar_val
        )
        if startplaats:
            app.logger.info(f"Startplaats created successfully: {startplaats}")
            return jsonify(startplaats), 201
        else:
            app.logger.error("StartplaatsHelper.create_startplaats returned None")
            return jsonify({"error": "Failed to create startplaats"}), 500
    except (ValueError, TypeError) as ve:
        error_msg = f"Invalid data for startplaats: {ve}"
        app.logger.error(error_msg)
        return jsonify({"error": error_msg}), 400
    except Exception as e:
        app.logger.error(f"Error creating startplaats: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/startplaatsen/<int:startplaats_id>', methods=['PUT'])
def update_startplaats(startplaats_id):
    data = request.get_json()
    app.logger.info(f"Received PUT /api/startplaatsen/{startplaats_id} request data: {data}")
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    update_data = {}
    try:
        # Correct: Update based on DB fields
        if 'locatie' in data:
            update_data['locatie'] = str(data['locatie'])
            if not update_data['locatie'].strip():
                raise ValueError("Location (locatie) cannot be empty.")
        if 'isbeschikbaar' in data:
            if not isinstance(data['isbeschikbaar'], bool):
                 raise ValueError("isbeschikbaar must be a boolean (true/false).")
            update_data['isbeschikbaar'] = data['isbeschikbaar']

        if not update_data:
             return jsonify({"error": "No valid fields provided for update"}), 400

        startplaats = StartplaatsHelper.update_startplaats(startplaats_id=startplaats_id, **update_data)
        if startplaats:
             app.logger.info(f"Startplaats {startplaats_id} updated successfully: {startplaats}")
             return jsonify(startplaats)
        else:
            return jsonify({"error": "Startplaats not found or update failed"}), 404
    except ValueError as ve:
        error_msg = f"Invalid data type for update: {ve}"
        app.logger.error(error_msg)
        return jsonify({"error": error_msg}), 400
    except Exception as e:
        app.logger.error(f"Error updating startplaats {startplaats_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/startplaatsen/<int:startplaats_id>', methods=['DELETE'])
def delete_startplaats(startplaats_id):
    app.logger.info(f"Received DELETE /api/startplaatsen/{startplaats_id} request")
    try:
        success = StartplaatsHelper.delete_startplaats(startplaats_id)
        if success:
            app.logger.info(f"Startplaats {startplaats_id} deleted successfully")
            return '', 204
        else:
            return jsonify({"error": "Startplaats not found"}), 404
    except Exception as e:
        app.logger.error(f"Error deleting startplaats {startplaats_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

# --- Verslag Routes (Corrected based on DB Schema) ---
@app.route('/api/verslagen', methods=['GET'])
def get_verslagen():
    try:
        # Correct: Filter by status, not event_id
        is_verzonden_str = request.args.get('isverzonden')
        is_geaccepteerd_str = request.args.get('isgeaccepteerd')

        is_verzonden = str_to_bool(is_verzonden_str)
        is_geaccepteerd = str_to_bool(is_geaccepteerd_str)

        # Use the specific helper if filtering, otherwise get all
        if is_verzonden is not None or is_geaccepteerd is not None:
             verslagen = VerslagHelper.get_verslagen_by_status(is_verzonden=is_verzonden, is_geaccepteerd=is_geaccepteerd)
        else:
             verslagen = VerslagHelper.get_all_verslagen()
        return jsonify(verslagen)
    except Exception as e:
        app.logger.error(f"Error getting verslagen: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/verslagen/<int:verslag_id>', methods=['GET'])
def get_verslag(verslag_id):
    try:
        verslag = VerslagHelper.get_verslag_by_id(verslag_id)
        if verslag:
            return jsonify(verslag)
        return jsonify({"error": "Verslag not found"}), 404
    except Exception as e:
        app.logger.error(f"Error getting verslag {verslag_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/verslagen', methods=['POST'])
def create_verslag():
    data = request.get_json()
    app.logger.info(f"Received POST /api/verslagen request data: {data}")
    if not data:
         return jsonify({"error": "No input data provided"}), 400

    # Correct: Expect DB fields
    required_keys = ['onderwerp', 'inhoud']
    missing_keys = [key for key in required_keys if key not in data]
    if missing_keys:
         return jsonify({"error": f"Missing required fields: {', '.join(missing_keys)}"}), 400

    try:
        onderwerp_val = str(data['onderwerp'])
        inhoud_val = str(data['inhoud'])
        # Default booleans to False if not provided or invalid
        is_verzonden_val = data.get('isverzonden', False)
        if not isinstance(is_verzonden_val, bool): is_verzonden_val = False
        is_geaccepteerd_val = data.get('isgeaccepteerd', False)
        if not isinstance(is_geaccepteerd_val, bool): is_geaccepteerd_val = False

        if not onderwerp_val.strip() or not inhoud_val.strip():
             raise ValueError("Onderwerp and Inhoud cannot be empty.")

        # Correct: Call helper with DB fields
        verslag = VerslagHelper.create_verslag(
            onderwerp=onderwerp_val,
            inhoud=inhoud_val,
            isverzonden=is_verzonden_val,
            isgeaccepteerd=is_geaccepteerd_val
        )
        if verslag:
            app.logger.info(f"Verslag created successfully: {verslag}")
            return jsonify(verslag), 201
        else:
             app.logger.error("VerslagHelper.create_verslag returned None")
             return jsonify({"error": "Failed to create verslag"}), 500
    except (ValueError, TypeError) as ve:
        error_msg = f"Invalid data for verslag: {ve}"
        app.logger.error(error_msg)
        return jsonify({"error": error_msg}), 400
    except Exception as e:
        app.logger.error(f"Error creating verslag: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/verslagen/<int:verslag_id>', methods=['PUT'])
def update_verslag(verslag_id):
    data = request.get_json()
    app.logger.info(f"Received PUT /api/verslagen/{verslag_id} request data: {data}")
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    update_data = {}
    try:
        # Correct: Update based on DB fields
        if 'onderwerp' in data:
            update_data['onderwerp'] = str(data['onderwerp'])
            if not update_data['onderwerp'].strip(): raise ValueError("Onderwerp cannot be empty.")
        if 'inhoud' in data:
            update_data['inhoud'] = str(data['inhoud'])
            if not update_data['inhoud'].strip(): raise ValueError("Inhoud cannot be empty.")
        if 'isverzonden' in data:
             if not isinstance(data['isverzonden'], bool): raise ValueError("isverzonden must be boolean.")
             update_data['isverzonden'] = data['isverzonden']
        if 'isgeaccepteerd' in data:
             if not isinstance(data['isgeaccepteerd'], bool): raise ValueError("isgeaccepteerd must be boolean.")
             update_data['isgeaccepteerd'] = data['isgeaccepteerd']

        if not update_data:
             return jsonify({"error": "No valid fields provided for update"}), 400

        verslag = VerslagHelper.update_verslag(verslag_id=verslag_id, **update_data)
        if verslag:
            app.logger.info(f"Verslag {verslag_id} updated successfully: {verslag}")
            return jsonify(verslag)
        else:
            return jsonify({"error": "Verslag not found or update failed"}), 404
    except ValueError as ve:
        error_msg = f"Invalid data type for update: {ve}"
        app.logger.error(error_msg)
        return jsonify({"error": error_msg}), 400
    except Exception as e:
        app.logger.error(f"Error updating verslag {verslag_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/verslagen/<int:verslag_id>', methods=['DELETE'])
def delete_verslag(verslag_id):
    app.logger.info(f"Received DELETE /api/verslagen/{verslag_id} request")
    try:
        success = VerslagHelper.delete_verslag(verslag_id)
        if success:
            app.logger.info(f"Verslag {verslag_id} deleted successfully")
            return '', 204
        else:
            return jsonify({"error": "Verslag not found"}), 404
    except Exception as e:
        app.logger.error(f"Error deleting verslag {verslag_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

# --- Drone Routes (Verified OK) ---
@app.route('/api/drones', methods=['GET'])
def get_drones():
    app.logger.info("Received GET /api/drones request")
    try:
        drones = DroneHelper.get_all_drones()
        app.logger.debug(f"Fetched drones data: {drones}")
        return jsonify(drones)
    except Exception as e:
        app.logger.error(f"Error in get_drones: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Failed to fetch drones: {str(e)}"}), 500

@app.route('/api/drones/<int:drone_id>', methods=['GET'])
def get_drone(drone_id):
    app.logger.info(f"Received GET /api/drones/{drone_id} request")
    try:
        drone = DroneHelper.get_drone_by_id(drone_id)
        if drone:
            app.logger.debug(f"Found drone {drone_id}: {drone}")
            return jsonify(drone)
        else:
            app.logger.warning(f"Drone with ID {drone_id} not found")
            return jsonify({"error": "Drone not found"}), 404
    except Exception as e:
        app.logger.error(f"Error in get_drone({drone_id}): {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Failed to fetch drone {drone_id}: {str(e)}"}), 500

@app.route('/api/drones', methods=['POST'])
def create_drone():
    app.logger.info("Received POST /api/drones request")
    data = request.get_json()
    app.logger.debug(f"Received data: {data}")
    if not data:
        app.logger.warning("No input data provided for POST /api/drones")
        return jsonify({"error": "No input data provided"}), 400
    required_keys = ['status', 'batterij', 'magOpstijgen']
    missing_keys = [key for key in required_keys if key not in data]
    if missing_keys:
        error_msg = f"Missing required fields: {', '.join(missing_keys)}"
        app.logger.warning(f"Bad request for POST /api/drones: {error_msg}")
        return jsonify({"error": error_msg}), 400
    try:
        batterij_val = data['batterij']
        if not isinstance(batterij_val, (int, float)): raise ValueError("Battery level must be a number.")
        batterij = int(batterij_val)
        if not (0 <= batterij <= 100): raise ValueError("Battery level must be between 0 and 100.")
        valid_statuses = ['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'OFFLINE']
        status_val = data['status']
        if status_val not in valid_statuses: raise ValueError(f"Invalid status '{status_val}'. Must be one of: {', '.join(valid_statuses)}")
        mag_opstijgen_val = data['magOpstijgen']
        if not isinstance(mag_opstijgen_val, bool): raise ValueError("magOpstijgen must be a boolean (true/false).")
        new_drone = DroneHelper.create_drone(status=status_val, batterij=batterij, mag_opstijgen=mag_opstijgen_val)
        if new_drone:
            app.logger.info(f"Successfully created drone: {new_drone}")
            return jsonify(new_drone), 201
        else:
            app.logger.error("DroneHelper.create_drone returned None")
            return jsonify({"error": "Failed to create drone in database"}), 500
    except ValueError as ve:
        error_msg = str(ve)
        app.logger.warning(f"Validation error for POST /api/drones: {error_msg}")
        return jsonify({"error": error_msg}), 400
    except Exception as e:
        app.logger.error(f"Error in create_drone: {e}\n{traceback.format_exc()}")
        return jsonify({"error": "An internal server error occurred"}), 500

@app.route('/api/drones/<int:drone_id>', methods=['PUT'])
def update_drone(drone_id):
    app.logger.info(f"Received PUT /api/drones/{drone_id} request")
    data = request.get_json()
    app.logger.debug(f"Received data for update: {data}")
    if not data:
        app.logger.warning(f"No input data provided for PUT /api/drones/{drone_id}")
        return jsonify({"error": "No input data provided"}), 400
    update_data = {}
    try:
        if 'status' in data:
            valid_statuses = ['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'OFFLINE']
            if data['status'] not in valid_statuses: raise ValueError(f"Invalid status '{data['status']}'")
            update_data['status'] = data['status']
        if 'batterij' in data:
            batterij = int(data['batterij'])
            if not (0 <= batterij <= 100): raise ValueError("Battery level must be between 0 and 100")
            update_data['batterij'] = batterij
        if 'magOpstijgen' in data:
            if not isinstance(data['magOpstijgen'], bool): raise ValueError("magOpstijgen must be boolean.")
            update_data['magOpstijgen'] = data['magOpstijgen']
        if not update_data: return jsonify({"error": "No valid fields provided for update"}), 400
        updated_drone = DroneHelper.update_drone(drone_id, **update_data)
        if updated_drone:
            app.logger.info(f"Successfully updated drone {drone_id}: {updated_drone}")
            return jsonify(updated_drone)
        else:
            app.logger.warning(f"Drone {drone_id} not found for update or update failed.")
            return jsonify({"error": "Drone not found or update failed"}), 404
    except ValueError as ve:
        error_msg = str(ve)
        app.logger.warning(f"Validation error for PUT /api/drones/{drone_id}: {error_msg}")
        return jsonify({"error": error_msg}), 400
    except Exception as e:
        app.logger.error(f"Error in update_drone({drone_id}): {e}\n{traceback.format_exc()}")
        return jsonify({"error": "An internal server error occurred"}), 500

@app.route('/api/drones/<int:drone_id>', methods=['DELETE'])
def delete_drone(drone_id):
    app.logger.info(f"Received DELETE /api/drones/{drone_id} request")
    try:
        success = DroneHelper.delete_drone(drone_id)
        if success:
            app.logger.info(f"Successfully deleted drone {drone_id}")
            return '', 204
        else:
            app.logger.warning(f"Drone {drone_id} not found for deletion.")
            return jsonify({"error": "Drone not found"}), 404
    except Exception as e:
        app.logger.error(f"Error in delete_drone({drone_id}): {e}\n{traceback.format_exc()}")
        return jsonify({"error": "An internal server error occurred"}), 500

# --- Cyclus Routes (Corrected based on DB Schema) ---
@app.route('/api/cycli', methods=['GET'])
def get_cycli():
    try:
        # Correct: No filtering by event_id
        # Maybe filter by VluchtCyclusId if needed?
        vlucht_cyclus_id = request.args.get('vlucht_cyclus_id')
        if vlucht_cyclus_id:
             # Add a helper function get_cycli_by_vlucht_cyclus if needed
             response = supabase.table("Cyclus").select("*").eq("VluchtCyclusId", int(vlucht_cyclus_id)).execute()
             cycli = response.data
        else:
             cycli = CyclusHelper.get_all_cycli()
        return jsonify(cycli)
    except ValueError:
        return jsonify({"error": "Invalid vlucht_cyclus_id provided"}), 400
    except Exception as e:
        app.logger.error(f"Error getting cycli: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/cycli/<int:cyclus_id>', methods=['GET'])
def get_cyclus(cyclus_id):
    try:
        cyclus = CyclusHelper.get_cyclus_by_id(cyclus_id)
        if cyclus:
            return jsonify(cyclus)
        return jsonify({"error": "Cyclus not found"}), 404
    except Exception as e:
        app.logger.error(f"Error getting cyclus {cyclus_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/cycli', methods=['POST'])
def create_cyclus():
    data = request.get_json()
    app.logger.info(f"Received POST /api/cycli request data: {data}")
    if not data: return jsonify({"error": "No input data provided"}), 400

    # Correct: Expect DB fields
    required_keys = ['startuur', 'tijdstip'] # VluchtCyclusId is optional FK
    missing_keys = [key for key in required_keys if key not in data]
    if missing_keys:
         return jsonify({"error": f"Missing required fields: {', '.join(missing_keys)}"}), 400

    try:
        startuur_val = time.fromisoformat(data['startuur'])
        tijdstip_val = time.fromisoformat(data['tijdstip'])
        vlucht_cyclus_id_val = data.get('vlucht_cyclus_id') # Optional
        if vlucht_cyclus_id_val is not None:
            vlucht_cyclus_id_val = int(vlucht_cyclus_id_val)

        # Correct: Call helper with DB fields
        cyclus = CyclusHelper.create_cyclus(
            startuur=startuur_val,
            tijdstip=tijdstip_val,
            vlucht_cyclus_id=vlucht_cyclus_id_val
        )
        if cyclus:
            app.logger.info(f"Cyclus created successfully: {cyclus}")
            return jsonify(cyclus), 201
        else:
             app.logger.error("CyclusHelper.create_cyclus returned None")
             return jsonify({"error": "Failed to create cyclus"}), 500
    except (ValueError, TypeError) as ve:
        error_msg = f"Invalid data for cyclus: {ve}"
        app.logger.error(error_msg)
        return jsonify({"error": error_msg}), 400
    except Exception as e:
        app.logger.error(f"Error creating cyclus: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/cycli/<int:cyclus_id>', methods=['PUT'])
def update_cyclus(cyclus_id):
    data = request.get_json()
    app.logger.info(f"Received PUT /api/cycli/{cyclus_id} request data: {data}")
    if not data: return jsonify({"error": "No input data provided"}), 400

    update_data = {}
    try:
        # Correct: Update based on DB fields
        if 'startuur' in data:
            update_data['startuur'] = time.fromisoformat(data['startuur']).isoformat()
        if 'tijdstip' in data:
            update_data['tijdstip'] = time.fromisoformat(data['tijdstip']).isoformat()
        if 'vlucht_cyclus_id' in data: # Allow updating/setting the FK
             update_data['VluchtCyclusId'] = int(data['vlucht_cyclus_id']) if data['vlucht_cyclus_id'] is not None else None

        if not update_data:
             return jsonify({"error": "No valid fields provided for update"}), 400

        cyclus = CyclusHelper.update_cyclus(cyclus_id=cyclus_id, **update_data)
        if cyclus:
            app.logger.info(f"Cyclus {cyclus_id} updated successfully: {cyclus}")
            return jsonify(cyclus)
        else:
            return jsonify({"error": "Cyclus not found or update failed"}), 404
    except (ValueError, TypeError) as ve:
        error_msg = f"Invalid data type for update: {ve}"
        app.logger.error(error_msg)
        return jsonify({"error": error_msg}), 400
    except Exception as e:
        app.logger.error(f"Error updating cyclus {cyclus_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/cycli/<int:cyclus_id>', methods=['DELETE'])
def delete_cyclus(cyclus_id):
    app.logger.info(f"Received DELETE /api/cycli/{cyclus_id} request")
    try:
        # Need to handle foreign key constraint if CyclusId is used in DockingCyclus
        # Option 1: Set FK in DockingCyclus to NULL first (if allowed)
        # Option 2: Delete related DockingCyclus rows first
        # Option 3: Use ON DELETE SET NULL or ON DELETE CASCADE in DB (not currently set)
        # Simple deletion (will fail if FK constraint exists):
        success = CyclusHelper.delete_cyclus(cyclus_id)
        if success:
            app.logger.info(f"Cyclus {cyclus_id} deleted successfully")
            return '', 204
        else:
            return jsonify({"error": "Cyclus not found"}), 404
    except Exception as e:
        # Catch potential FK violation errors
        if "violates foreign key constraint" in str(e).lower():
             error_msg = f"Cannot delete Cyclus {cyclus_id} because it is referenced by other records (e.g., DockingCyclus)."
             app.logger.warning(error_msg)
             return jsonify({"error": error_msg}), 409 # 409 Conflict
        app.logger.error(f"Error deleting cyclus {cyclus_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

# --- VluchtCyclus Routes (Corrected based on DB Schema) ---
@app.route('/api/vlucht-cycli', methods=['GET'])
def get_vlucht_cycli():
    try:
        # Correct: Cannot filter by cyclus_id. Can filter by FKs in VluchtCyclus table
        drone_id = request.args.get('drone_id')
        zone_id = request.args.get('zone_id')
        plaats_id = request.args.get('plaats_id')
        verslag_id = request.args.get('verslag_id')

        query = supabase.table("VluchtCyclus").select("*")
        if drone_id: query = query.eq("DroneId", int(drone_id))
        if zone_id: query = query.eq("ZoneId", int(zone_id))
        if plaats_id: query = query.eq("PlaatsId", int(plaats_id))
        if verslag_id: query = query.eq("VerslagId", int(verslag_id))

        response = query.execute()
        vlucht_cycli = response.data
        # Or call specific helpers like get_vlucht_cycli_by_drone if they exist
        # else:
        #    vlucht_cycli = VluchtCyclusHelper.get_all_vlucht_cycli()
        return jsonify(vlucht_cycli)
    except ValueError:
         return jsonify({"error": "Invalid ID provided for filtering"}), 400
    except Exception as e:
        app.logger.error(f"Error getting vlucht-cycli: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/vlucht-cycli/<int:vlucht_cyclus_id>', methods=['GET'])
def get_vlucht_cyclus(vlucht_cyclus_id):
    try:
        vlucht_cyclus = VluchtCyclusHelper.get_vlucht_cyclus_by_id(vlucht_cyclus_id)
        if vlucht_cyclus:
            return jsonify(vlucht_cyclus)
        return jsonify({"error": "Vlucht cyclus not found"}), 404
    except Exception as e:
        app.logger.error(f"Error getting vlucht-cyclus {vlucht_cyclus_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/vlucht-cycli', methods=['POST'])
def create_vlucht_cyclus():
    data = request.get_json()
    app.logger.info(f"Received POST /api/vlucht-cycli request data: {data}")
    # No strictly required fields based on DB (all FKs nullable), but usually at least one is expected
    if not data: return jsonify({"error": "No input data provided"}), 400

    try:
        # Correct: Expect optional DB fields (FKs)
        verslag_id_val = data.get('verslag_id')
        plaats_id_val = data.get('plaats_id')
        drone_id_val = data.get('drone_id')
        zone_id_val = data.get('zone_id')

        # Basic validation/conversion if values are present
        if verslag_id_val is not None: verslag_id_val = int(verslag_id_val)
        if plaats_id_val is not None: plaats_id_val = int(plaats_id_val)
        if drone_id_val is not None: drone_id_val = int(drone_id_val)
        if zone_id_val is not None: zone_id_val = int(zone_id_val)

        if not any([verslag_id_val, plaats_id_val, drone_id_val, zone_id_val]):
            return jsonify({"error": "At least one ID (verslag, plaats, drone, or zone) must be provided"}), 400

        # Correct: Call helper with optional DB fields
        vlucht_cyclus = VluchtCyclusHelper.create_vlucht_cyclus(
            verslag_id=verslag_id_val,
            plaats_id=plaats_id_val,
            drone_id=drone_id_val,
            zone_id=zone_id_val
        )
        if vlucht_cyclus:
            app.logger.info(f"VluchtCyclus created successfully: {vlucht_cyclus}")
            return jsonify(vlucht_cyclus), 201
        else:
            app.logger.error("VluchtCyclusHelper.create_vlucht_cyclus returned None")
            return jsonify({"error": "Failed to create vlucht cyclus"}), 500
    except (ValueError, TypeError) as ve:
        error_msg = f"Invalid ID format for VluchtCyclus: {ve}"
        app.logger.error(error_msg)
        return jsonify({"error": error_msg}), 400
    except Exception as e:
        # Catch FK constraint errors if IDs don't exist in referenced tables
        if "violates foreign key constraint" in str(e).lower():
            error_msg = f"Invalid reference ID provided (e.g., DroneId, ZoneId does not exist): {e}"
            app.logger.warning(error_msg)
            return jsonify({"error": error_msg}), 400
        app.logger.error(f"Error creating vlucht-cyclus: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/vlucht-cycli/<int:vlucht_cyclus_id>', methods=['PUT'])
def update_vlucht_cyclus(vlucht_cyclus_id):
    data = request.get_json()
    app.logger.info(f"Received PUT /api/vlucht-cycli/{vlucht_cyclus_id} request data: {data}")
    if not data: return jsonify({"error": "No input data provided"}), 400

    update_data = {}
    try:
        # Correct: Update based on optional DB fields (FKs)
        if 'verslag_id' in data: update_data['VerslagId'] = int(data['verslag_id']) if data['verslag_id'] is not None else None
        if 'plaats_id' in data: update_data['PlaatsId'] = int(data['plaats_id']) if data['plaats_id'] is not None else None
        if 'drone_id' in data: update_data['DroneId'] = int(data['drone_id']) if data['drone_id'] is not None else None
        if 'zone_id' in data: update_data['ZoneId'] = int(data['zone_id']) if data['zone_id'] is not None else None

        if not update_data:
             return jsonify({"error": "No valid fields provided for update"}), 400

        vlucht_cyclus = VluchtCyclusHelper.update_vlucht_cyclus(vlucht_cyclus_id=vlucht_cyclus_id, **update_data)
        if vlucht_cyclus:
             app.logger.info(f"VluchtCyclus {vlucht_cyclus_id} updated successfully: {vlucht_cyclus}")
             return jsonify(vlucht_cyclus)
        else:
            return jsonify({"error": "VluchtCyclus not found or update failed"}), 404
    except (ValueError, TypeError) as ve:
        error_msg = f"Invalid ID format for update: {ve}"
        app.logger.error(error_msg)
        return jsonify({"error": error_msg}), 400
    except Exception as e:
        # Catch FK constraint errors
        if "violates foreign key constraint" in str(e).lower():
            error_msg = f"Invalid reference ID provided for update: {e}"
            app.logger.warning(error_msg)
            return jsonify({"error": error_msg}), 400
        app.logger.error(f"Error updating vlucht-cyclus {vlucht_cyclus_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/vlucht-cycli/<int:vlucht_cyclus_id>', methods=['DELETE'])
def delete_vlucht_cyclus(vlucht_cyclus_id):
    app.logger.info(f"Received DELETE /api/vlucht-cycli/{vlucht_cyclus_id} request")
    try:
         # Check if this VluchtCyclusId is referenced in the Cyclus table
        response = supabase.table("Cyclus").select("Id").eq("VluchtCyclusId", vlucht_cyclus_id).limit(1).execute()
        if response.data:
            error_msg = f"Cannot delete VluchtCyclus {vlucht_cyclus_id} because it is referenced by Cyclus {response.data[0]['Id']}."
            app.logger.warning(error_msg)
            return jsonify({"error": error_msg}), 409 # Conflict

        success = VluchtCyclusHelper.delete_vlucht_cyclus(vlucht_cyclus_id)
        if success:
            app.logger.info(f"VluchtCyclus {vlucht_cyclus_id} deleted successfully")
            return '', 204
        else:
            return jsonify({"error": "VluchtCyclus not found"}), 404
    except Exception as e:
        app.logger.error(f"Error deleting vlucht-cyclus {vlucht_cyclus_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

# --- DockingCyclus Routes (Corrected based on DB Schema) ---
@app.route('/api/docking-cycli', methods=['GET'])
def get_docking_cycli():
    try:
        # Correct: Filtering by cyclus_id is valid
        cyclus_id = request.args.get('cyclus_id')
        drone_id = request.args.get('drone_id')
        docking_id = request.args.get('docking_id')

        query = supabase.table("DockingCyclus").select("*")
        if cyclus_id: query = query.eq("CyclusId", int(cyclus_id))
        if drone_id: query = query.eq("DroneId", int(drone_id))
        if docking_id: query = query.eq("DockingId", int(docking_id))

        response = query.execute()
        docking_cycli = response.data
        # Or call specific helpers like get_docking_cycli_by_cyclus if they exist
        # else:
        #    docking_cycli = DockingCyclusHelper.get_all_docking_cycli()
        return jsonify(docking_cycli)
    except ValueError:
         return jsonify({"error": "Invalid ID provided for filtering"}), 400
    except Exception as e:
        app.logger.error(f"Error getting docking-cycli: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/docking-cycli/<int:docking_cyclus_id>', methods=['GET'])
def get_docking_cyclus(docking_cyclus_id):
    try:
        docking_cyclus = DockingCyclusHelper.get_docking_cyclus_by_id(docking_cyclus_id)
        if docking_cyclus:
            return jsonify(docking_cyclus)
        return jsonify({"error": "Docking cyclus not found"}), 404
    except Exception as e:
        app.logger.error(f"Error getting docking-cyclus {docking_cyclus_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/docking-cycli', methods=['POST'])
def create_docking_cyclus():
    data = request.get_json()
    app.logger.info(f"Received POST /api/docking-cycli request data: {data}")
    if not data: return jsonify({"error": "No input data provided"}), 400

    # Correct: Expect DB fields (FKs)
    required_keys = ['drone_id', 'docking_id', 'cyclus_id']
    missing_keys = [key for key in required_keys if key not in data]
    if missing_keys:
         return jsonify({"error": f"Missing required fields: {', '.join(missing_keys)}"}), 400

    try:
        drone_id_val = int(data['drone_id'])
        docking_id_val = int(data['docking_id'])
        cyclus_id_val = int(data['cyclus_id'])

        # Correct: Call helper with DB fields
        docking_cyclus = DockingCyclusHelper.create_docking_cyclus(
            drone_id=drone_id_val,
            docking_id=docking_id_val,
            cyclus_id=cyclus_id_val
        )
        if docking_cyclus:
            app.logger.info(f"DockingCyclus created successfully: {docking_cyclus}")
            return jsonify(docking_cyclus), 201
        else:
            app.logger.error("DockingCyclusHelper.create_docking_cyclus returned None")
            return jsonify({"error": "Failed to create docking cyclus"}), 500
    except (ValueError, TypeError) as ve:
        error_msg = f"Invalid ID format for DockingCyclus: {ve}"
        app.logger.error(error_msg)
        return jsonify({"error": error_msg}), 400
    except Exception as e:
         # Catch FK constraint errors
        if "violates foreign key constraint" in str(e).lower():
            error_msg = f"Invalid reference ID provided (DroneId, DockingId, or CyclusId does not exist): {e}"
            app.logger.warning(error_msg)
            return jsonify({"error": error_msg}), 400
        app.logger.error(f"Error creating docking-cyclus: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/docking-cycli/<int:docking_cyclus_id>', methods=['PUT'])
def update_docking_cyclus(docking_cyclus_id):
    data = request.get_json()
    app.logger.info(f"Received PUT /api/docking-cycli/{docking_cyclus_id} request data: {data}")
    if not data: return jsonify({"error": "No input data provided"}), 400

    update_data = {}
    try:
        # Correct: Update based on DB fields (FKs)
        if 'drone_id' in data: update_data['DroneId'] = int(data['drone_id']) if data['drone_id'] is not None else None
        if 'docking_id' in data: update_data['DockingId'] = int(data['docking_id']) if data['docking_id'] is not None else None
        if 'cyclus_id' in data: update_data['CyclusId'] = int(data['cyclus_id']) if data['cyclus_id'] is not None else None

        if not update_data:
             return jsonify({"error": "No valid fields provided for update"}), 400

        docking_cyclus = DockingCyclusHelper.update_docking_cyclus(docking_cyclus_id=docking_cyclus_id, **update_data)
        if docking_cyclus:
            app.logger.info(f"DockingCyclus {docking_cyclus_id} updated successfully: {docking_cyclus}")
            return jsonify(docking_cyclus)
        else:
            return jsonify({"error": "DockingCyclus not found or update failed"}), 404
    except (ValueError, TypeError) as ve:
        error_msg = f"Invalid ID format for update: {ve}"
        app.logger.error(error_msg)
        return jsonify({"error": error_msg}), 400
    except Exception as e:
         # Catch FK constraint errors
        if "violates foreign key constraint" in str(e).lower():
            error_msg = f"Invalid reference ID provided for update: {e}"
            app.logger.warning(error_msg)
            return jsonify({"error": error_msg}), 400
        app.logger.error(f"Error updating docking-cyclus {docking_cyclus_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/docking-cycli/<int:docking_cyclus_id>', methods=['DELETE'])
def delete_docking_cyclus(docking_cyclus_id):
    app.logger.info(f"Received DELETE /api/docking-cycli/{docking_cyclus_id} request")
    try:
        success = DockingCyclusHelper.delete_docking_cyclus(docking_cyclus_id)
        if success:
            app.logger.info(f"DockingCyclus {docking_cyclus_id} deleted successfully")
            return '', 204
        else:
            return jsonify({"error": "DockingCyclus not found"}), 404
    except Exception as e:
        app.logger.error(f"Error deleting docking-cyclus {docking_cyclus_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


# --- Docking Routes (Example - Add if needed) ---
# @app.route('/api/docking', methods=['GET'])
# def get_docking_stations():
#     try:
#         # Similar logic to get_startplaatsen
#         is_beschikbaar_str = request.args.get('isbeschikbaar')
#         is_beschikbaar = str_to_bool(is_beschikbaar_str)
#         if is_beschikbaar is True:
#             stations = DockingHelper.get_available_dockings()
#         # Add logic for is_beschikbaar is False if needed
#         else:
#             stations = DockingHelper.get_all_dockings()
#         return jsonify(stations)
#     except Exception as e:
#         app.logger.error(f"Error getting docking stations: {e}\n{traceback.format_exc()}")
#         return jsonify({"error": f"Internal server error: {str(e)}"}), 500

# @app.route('/api/docking', methods=['POST'])
# def create_docking_station():
#     # Similar logic to create_startplaats using 'locatie' and 'isbeschikbaar'
#     pass


# --- Dashboard Routes (Commented Out - Need Redesign Based on Corrected Schema) ---
# These routes heavily rely on relationships/helpers that were incorrect based on the DB schema review.
# They need to be redesigned to fetch and aggregate data based on the *actual* relationships.
"""
@app.route('/api/dashboard/event-overview/<int:event_id>', methods=['GET'])
def get_event_overview(event_id):
    # PROBLEM: Relies on get_startplaatsen_by_event, get_docking_stations_by_event,
    # get_cycli_by_event, get_active_drones_by_event which are likely incorrect/non-existent
    # based on the actual DB schema. Needs complete rewrite using valid joins/queries.
    app.logger.warning("Route /api/dashboard/event-overview needs redesign based on DB schema")
    return jsonify({"error": "Route under construction due to schema mismatch"}), 501 # 501 Not Implemented

@app.route('/api/dashboard/drone-status', methods=['GET'])
def get_drone_status():
    # PROBLEM: get_active_drones_by_event likely incorrect. Aggregation logic might be okay
    # if based on get_all_drones, but event filtering is suspect.
    app.logger.warning("Route /api/dashboard/drone-status needs review for event filtering based on DB schema")
    try:
        # Fetch all drones for now, ignore event_id filtering until relationship is clear
        drones = DroneHelper.get_all_drones()
        status_counts = {}
        total_battery = 0
        count_with_battery = 0
        for drone in drones:
            status = drone.get('status', 'Unknown')
            status_counts[status] = status_counts.get(status, 0) + 1
            battery = drone.get('batterij') # Correct key from DB
            if battery is not None:
                 total_battery += battery
                 count_with_battery += 1

        avg_battery = total_battery / count_with_battery if count_with_battery > 0 else 0

        return jsonify({
            "total_drones": len(drones),
            "status_distribution": status_counts,
            "average_battery_level": avg_battery,
            "drones": drones # Maybe remove this if the list is large
        })
    except Exception as e:
        app.logger.error(f"Error getting drone status dashboard: {e}\n{traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/dashboard/cyclus-overview/<int:cyclus_id>', methods=['GET'])
def get_cyclus_overview(cyclus_id):
     # PROBLEM: Relies on potentially non-existent helpers like get_vlucht_cycli_by_cyclus
     # and get_docking_cycli_by_cyclus. DockingCyclus link IS valid, VluchtCyclus is NOT.
     app.logger.warning("Route /api/dashboard/cyclus-overview needs redesign based on DB schema (VluchtCyclus relationship)")
     try:
         cyclus = CyclusHelper.get_cyclus_by_id(cyclus_id)
         if not cyclus:
             return jsonify({"error": "Cyclus not found"}), 404

         # Fetch DockingCycli (Correct relationship)
         docking_cycli = DockingCyclusHelper.get_docking_cycli_by_cyclus(cyclus_id) # Assuming helper exists

         # Fetch VluchtCycli associated via Cyclus.VluchtCyclusId (if exists)
         vlucht_cyclus_id = cyclus.get("VluchtCyclusId")
         vlucht_cycli_details = None
         if vlucht_cyclus_id:
             vlucht_cycli_details = VluchtCyclusHelper.get_vlucht_cyclus_by_id(vlucht_cyclus_id)

         # Aggregate data based on available info
         docking_status_counts = {} # Example aggregation
         for dc in docking_cycli:
             # Need status field IN DockingCyclus table for this to work
             status = dc.get('status', 'Unknown')
             docking_status_counts[status] = docking_status_counts.get(status, 0) + 1

         overview = {
             "cyclus": cyclus,
             "stats": {
                 "total_docking_cycli": len(docking_cycli),
                 # Add other relevant stats based on actual Cyclus/DockingCyclus fields
                 "docking_status_distribution": docking_status_counts, # IF status exists
             },
             "associated_vlucht_cyclus": vlucht_cycli_details, # Show the single associated one
             "docking_cycli": docking_cycli,
         }
         return jsonify(overview)
     except Exception as e:
        app.logger.error(f"Error getting cyclus overview dashboard for {cyclus_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500
"""

# Run the application
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5328))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    # Configure logging for better debugging
    if not app.debug:
        import logging
        # Log to stdout
        stream_handler = logging.StreamHandler()
        stream_handler.setLevel(logging.INFO)
        app.logger.addHandler(stream_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('Flask app started')
    else:
         app.logger.setLevel(logging.DEBUG)
         app.logger.info('Flask app started in DEBUG mode')

    app.run(host='0.0.0.0', port=port, debug=debug)