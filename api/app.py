from flask import Flask, request, jsonify
from datetime import date, time
import os
from dotenv import load_dotenv

# Import all helper classes
from helpers import (
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

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# --- Evenement Routes ---
@app.route('/api/events', methods=['GET'])
def get_events():
    events = EvenementHelper.get_all_events()
    return jsonify(events)

@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = EvenementHelper.get_event_by_id(event_id)
    if event:
        return jsonify(event)
    return jsonify({"error": "Event not found"}), 404

@app.route('/api/events', methods=['POST'])
def create_event():
    data = request.get_json()
    try:
        event = EvenementHelper.create_event(
            start_datum=date.fromisoformat(data['start_datum']),
            eind_datum=date.fromisoformat(data['eind_datum']),
            naam=data['naam'],
            beschrijving=data.get('beschrijving', '')
        )
        return jsonify(event), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    data = request.get_json()
    try:
        event = EvenementHelper.update_event(
            event_id=event_id,
            start_datum=date.fromisoformat(data['start_datum']) if 'start_datum' in data else None,
            eind_datum=date.fromisoformat(data['eind_datum']) if 'eind_datum' in data else None,
            naam=data.get('naam'),
            beschrijving=data.get('beschrijving')
        )
        if event:
            return jsonify(event)
        return jsonify({"error": "Event not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    success = EvenementHelper.delete_event(event_id)
    if success:
        return jsonify({"message": "Event deleted successfully"}), 200
    return jsonify({"error": "Event not found"}), 404

# --- Zone Routes ---
@app.route('/api/zones', methods=['GET'])
def get_zones():
    event_id = request.args.get('event_id')
    if event_id:
        zones = ZoneHelper.get_zones_by_event(int(event_id))
    else:
        zones = ZoneHelper.get_all_zones()
    return jsonify(zones)

@app.route('/api/zones/<int:zone_id>', methods=['GET'])
def get_zone(zone_id):
    zone = ZoneHelper.get_zone_by_id(zone_id)
    if zone:
        return jsonify(zone)
    return jsonify({"error": "Zone not found"}), 404

@app.route('/api/zones', methods=['POST'])
def create_zone():
    data = request.get_json()
    try:
        zone = ZoneHelper.create_zone(
            evenement_id=data['evenement_id'],
            naam=data['naam'],
            beschrijving=data.get('beschrijving', ''),
            coord_1=data['coord_1'],
            coord_2=data['coord_2'],
            coord_3=data['coord_3'],
            coord_4=data['coord_4']
        )
        return jsonify(zone), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/zones/<int:zone_id>', methods=['PUT'])
def update_zone(zone_id):
    data = request.get_json()
    try:
        zone = ZoneHelper.update_zone(
            zone_id=zone_id,
            evenement_id=data.get('evenement_id'),
            naam=data.get('naam'),
            beschrijving=data.get('beschrijving'),
            coord_1=data.get('coord_1'),
            coord_2=data.get('coord_2'),
            coord_3=data.get('coord_3'),
            coord_4=data.get('coord_4')
        )
        if zone:
            return jsonify(zone)
        return jsonify({"error": "Zone not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/zones/<int:zone_id>', methods=['DELETE'])
def delete_zone(zone_id):
    success = ZoneHelper.delete_zone(zone_id)
    if success:
        return jsonify({"message": "Zone deleted successfully"}), 200
    return jsonify({"error": "Zone not found"}), 404

# --- Startplaats Routes ---
@app.route('/api/startplaatsen', methods=['GET'])
def get_startplaatsen():
    event_id = request.args.get('event_id')
    if event_id:
        startplaatsen = StartplaatsHelper.get_startplaatsen_by_event(int(event_id))
    else:
        startplaatsen = StartplaatsHelper.get_all_startplaatsen()
    return jsonify(startplaatsen)

@app.route('/api/startplaatsen/<int:startplaats_id>', methods=['GET'])
def get_startplaats(startplaats_id):
    startplaats = StartplaatsHelper.get_startplaats_by_id(startplaats_id)
    if startplaats:
        return jsonify(startplaats)
    return jsonify({"error": "Startplaats not found"}), 404

@app.route('/api/startplaatsen', methods=['POST'])
def create_startplaats():
    data = request.get_json()
    try:
        startplaats = StartplaatsHelper.create_startplaats(
            evenement_id=data['evenement_id'],
            naam=data['naam'],
            beschrijving=data.get('beschrijving', ''),
            locatie=data['locatie']
        )
        return jsonify(startplaats), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/startplaatsen/<int:startplaats_id>', methods=['PUT'])
def update_startplaats(startplaats_id):
    data = request.get_json()
    try:
        startplaats = StartplaatsHelper.update_startplaats(
            startplaats_id=startplaats_id,
            evenement_id=data.get('evenement_id'),
            naam=data.get('naam'),
            beschrijving=data.get('beschrijving'),
            locatie=data.get('locatie')
        )
        if startplaats:
            return jsonify(startplaats)
        return jsonify({"error": "Startplaats not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/startplaatsen/<int:startplaats_id>', methods=['DELETE'])
def delete_startplaats(startplaats_id):
    success = StartplaatsHelper.delete_startplaats(startplaats_id)
    if success:
        return jsonify({"message": "Startplaats deleted successfully"}), 200
    return jsonify({"error": "Startplaats not found"}), 404

# --- Verslag Routes ---
@app.route('/api/verslagen', methods=['GET'])
def get_verslagen():
    event_id = request.args.get('event_id')
    if event_id:
        verslagen = VerslagHelper.get_verslagen_by_event(int(event_id))
    else:
        verslagen = VerslagHelper.get_all_verslagen()
    return jsonify(verslagen)

@app.route('/api/verslagen/<int:verslag_id>', methods=['GET'])
def get_verslag(verslag_id):
    verslag = VerslagHelper.get_verslag_by_id(verslag_id)
    if verslag:
        return jsonify(verslag)
    return jsonify({"error": "Verslag not found"}), 404

@app.route('/api/verslagen', methods=['POST'])
def create_verslag():
    data = request.get_json()
    try:
        verslag = VerslagHelper.create_verslag(
            evenement_id=data['evenement_id'],
            titel=data['titel'],
            inhoud=data['inhoud'],
            datum=date.fromisoformat(data['datum'])
        )
        return jsonify(verslag), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/verslagen/<int:verslag_id>', methods=['PUT'])
def update_verslag(verslag_id):
    data = request.get_json()
    try:
        verslag = VerslagHelper.update_verslag(
            verslag_id=verslag_id,
            evenement_id=data.get('evenement_id'),
            titel=data.get('titel'),
            inhoud=data.get('inhoud'),
            datum=date.fromisoformat(data['datum']) if 'datum' in data else None
        )
        if verslag:
            return jsonify(verslag)
        return jsonify({"error": "Verslag not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/verslagen/<int:verslag_id>', methods=['DELETE'])
def delete_verslag(verslag_id):
    success = VerslagHelper.delete_verslag(verslag_id)
    if success:
        return jsonify({"message": "Verslag deleted successfully"}), 200
    return jsonify({"error": "Verslag not found"}), 404

# --- Drone Routes ---
@app.route('/api/drones', methods=['GET'])
def get_drones():
    app.logger.info("Received GET /api/drones request") # Use Flask logger
    try:
        drones = DroneHelper.get_all_drones()
        app.logger.debug(f"Fetched drones data: {drones}")
        return jsonify(drones)
    except Exception as e:
        app.logger.error(f"Error in get_drones: {e}\n{traceback.format_exc()}") # Log full traceback
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

    # --- FIX: Validate keys SENT BY THE DIALOG ---
    required_keys = ['status', 'batterij', 'magOpstijgen']
    missing_keys = [key for key in required_keys if key not in data]
    if missing_keys:
        error_msg = f"Missing required fields: {', '.join(missing_keys)}"
        app.logger.warning(f"Bad request for POST /api/drones: {error_msg}")
        return jsonify({"error": error_msg}), 400

    try:
        # Validate battery level
        batterij_val = data['batterij']
        if not isinstance(batterij_val, (int, float)): # Allow float temporarily if needed, but DB expects int
             raise ValueError("Battery level must be a number.")
        batterij = int(batterij_val)
        if not (0 <= batterij <= 100):
             raise ValueError("Battery level must be between 0 and 100.")

        # Validate status
        valid_statuses = ['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'OFFLINE']
        status_val = data['status']
        if status_val not in valid_statuses:
             raise ValueError(f"Invalid status '{status_val}'. Must be one of: {', '.join(valid_statuses)}")

        # Validate magOpstijgen (should be boolean)
        mag_opstijgen_val = data['magOpstijgen']
        if not isinstance(mag_opstijgen_val, bool):
            # Handle potential string 'true'/'false' if necessary, but boolean is better
             raise ValueError("magOpstijgen must be a boolean (true/false).")

        # --- FIX: Call the HELPER with the arguments IT expects ---
        # DroneHelper.create_drone expects: status, batterij, mag_opstijgen
        new_drone = DroneHelper.create_drone(
            status=status_val,
            batterij=batterij,
            mag_opstijgen=mag_opstijgen_val
        )

        if new_drone:
            app.logger.info(f"Successfully created drone: {new_drone}")
            return jsonify(new_drone), 201
        else:
            app.logger.error("DroneHelper.create_drone returned None")
            return jsonify({"error": "Failed to create drone in database (helper returned None)"}), 500

    except ValueError as ve: # Catch specific validation errors
        error_msg = str(ve)
        app.logger.warning(f"Validation error for POST /api/drones: {error_msg}")
        return jsonify({"error": error_msg}), 400
    except Exception as e:
        app.logger.error(f"Error in create_drone: {e}\n{traceback.format_exc()}")
        return jsonify({"error": "An internal server error occurred while creating the drone"}), 500


@app.route('/api/drones/<int:drone_id>', methods=['PUT'])
def update_drone(drone_id):
    app.logger.info(f"Received PUT /api/drones/{drone_id} request")
    data = request.get_json()
    app.logger.debug(f"Received data for update: {data}")

    if not data:
        app.logger.warning(f"No input data provided for PUT /api/drones/{drone_id}")
        return jsonify({"error": "No input data provided"}), 400

    # Prepare update_data based on what helper expects (kwargs)
    update_data = {}
    if 'status' in data:
        valid_statuses = ['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'OFFLINE']
        if data['status'] not in valid_statuses:
             return jsonify({"error": f"Invalid status '{data['status']}'"}), 400
        update_data['status'] = data['status']
    if 'batterij' in data:
        try:
            batterij = int(data['batterij'])
            if not (0 <= batterij <= 100):
                return jsonify({"error": "Battery level must be between 0 and 100"}), 400
            update_data['batterij'] = batterij
        except ValueError:
            return jsonify({"error": "Invalid battery level."}), 400
    if 'magOpstijgen' in data:
        if not isinstance(data['magOpstijgen'], bool):
             return jsonify({"error": "magOpstijgen must be boolean."}), 400
        update_data['magOpstijgen'] = data['magOpstijgen']

    if not update_data:
         return jsonify({"error": "No valid fields provided for update"}), 400

    try:
        updated_drone = DroneHelper.update_drone(drone_id, **update_data)
        if updated_drone:
            app.logger.info(f"Successfully updated drone {drone_id}: {updated_drone}")
            return jsonify(updated_drone)
        else:
            app.logger.warning(f"Drone {drone_id} not found for update or update failed.")
            # Check if drone exists first? Helper might handle this.
            return jsonify({"error": "Drone not found or update failed"}), 404 # Or 500?
    except Exception as e:
        app.logger.error(f"Error in update_drone({drone_id}): {e}\n{traceback.format_exc()}")
        return jsonify({"error": "An internal server error occurred while updating the drone"}), 500

@app.route('/api/drones/<int:drone_id>', methods=['DELETE'])
def delete_drone(drone_id):
    app.logger.info(f"Received DELETE /api/drones/{drone_id} request")
    try:
        success = DroneHelper.delete_drone(drone_id)
        if success:
            app.logger.info(f"Successfully deleted drone {drone_id}")
            # Return 204 No Content on successful deletion is common
            return '', 204
            # Or return a message:
            # return jsonify({"message": "Drone deleted successfully"}), 200
        else:
            # This might happen if the drone didn't exist
            app.logger.warning(f"Drone {drone_id} not found for deletion.")
            return jsonify({"error": "Drone not found"}), 404
    except Exception as e:
        app.logger.error(f"Error in delete_drone({drone_id}): {e}\n{traceback.format_exc()}")
        return jsonify({"error": "An internal server error occurred while deleting the drone"}), 500

# --- Cyclus Routes ---
@app.route('/api/cycli', methods=['GET'])
def get_cycli():
    event_id = request.args.get('event_id')
    if event_id:
        cycli = CyclusHelper.get_cycli_by_event(int(event_id))
    else:
        cycli = CyclusHelper.get_all_cycli()
    return jsonify(cycli)

@app.route('/api/cycli/<int:cyclus_id>', methods=['GET'])
def get_cyclus(cyclus_id):
    cyclus = CyclusHelper.get_cyclus_by_id(cyclus_id)
    if cyclus:
        return jsonify(cyclus)
    return jsonify({"error": "Cyclus not found"}), 404

@app.route('/api/cycli', methods=['POST'])
def create_cyclus():
    data = request.get_json()
    try:
        cyclus = CyclusHelper.create_cyclus(
            evenement_id=data['evenement_id'],
            naam=data['naam'],
            beschrijving=data.get('beschrijving', ''),
            start_tijd=time.fromisoformat(data['start_tijd']),
            eind_tijd=time.fromisoformat(data['eind_tijd']),
            status=data['status']
        )
        return jsonify(cyclus), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/cycli/<int:cyclus_id>', methods=['PUT'])
def update_cyclus(cyclus_id):
    data = request.get_json()
    try:
        cyclus = CyclusHelper.update_cyclus(
            cyclus_id=cyclus_id,
            evenement_id=data.get('evenement_id'),
            naam=data.get('naam'),
            beschrijving=data.get('beschrijving'),
            start_tijd=time.fromisoformat(data['start_tijd']) if 'start_tijd' in data else None,
            eind_tijd=time.fromisoformat(data['eind_tijd']) if 'eind_tijd' in data else None,
            status=data.get('status')
        )
        if cyclus:
            return jsonify(cyclus)
        return jsonify({"error": "Cyclus not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/cycli/<int:cyclus_id>', methods=['DELETE'])
def delete_cyclus(cyclus_id):
    success = CyclusHelper.delete_cyclus(cyclus_id)
    if success:
        return jsonify({"message": "Cyclus deleted successfully"}), 200
    return jsonify({"error": "Cyclus not found"}), 404

# --- VluchtCyclus Routes ---
@app.route('/api/vlucht-cycli', methods=['GET'])
def get_vlucht_cycli():
    cyclus_id = request.args.get('cyclus_id')
    if cyclus_id:
        vlucht_cycli = VluchtCyclusHelper.get_vlucht_cycli_by_cyclus(int(cyclus_id))
    else:
        vlucht_cycli = VluchtCyclusHelper.get_all_vlucht_cycli()
    return jsonify(vlucht_cycli)

@app.route('/api/vlucht-cycli/<int:vlucht_cyclus_id>', methods=['GET'])
def get_vlucht_cyclus(vlucht_cyclus_id):
    vlucht_cyclus = VluchtCyclusHelper.get_vlucht_cyclus_by_id(vlucht_cyclus_id)
    if vlucht_cyclus:
        return jsonify(vlucht_cyclus)
    return jsonify({"error": "Vlucht cyclus not found"}), 404

@app.route('/api/vlucht-cycli', methods=['POST'])
def create_vlucht_cyclus():
    data = request.get_json()
    try:
        vlucht_cyclus = VluchtCyclusHelper.create_vlucht_cyclus(
            cyclus_id=data['cyclus_id'],
            drone_id=data['drone_id'],
            zone_id=data['zone_id'],
            startplaats_id=data['startplaats_id'],
            start_tijd=time.fromisoformat(data['start_tijd']),
            eind_tijd=time.fromisoformat(data['eind_tijd']),
            status=data['status'],
            opmerkingen=data.get('opmerkingen', '')
        )
        return jsonify(vlucht_cyclus), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/vlucht-cycli/<int:vlucht_cyclus_id>', methods=['PUT'])
def update_vlucht_cyclus(vlucht_cyclus_id):
    data = request.get_json()
    try:
        vlucht_cyclus = VluchtCyclusHelper.update_vlucht_cyclus(
            vlucht_cyclus_id=vlucht_cyclus_id,
            cyclus_id=data.get('cyclus_id'),
            drone_id=data.get('drone_id'),
            zone_id=data.get('zone_id'),
            startplaats_id=data.get('startplaats_id'),
            start_tijd=time.fromisoformat(data['start_tijd']) if 'start_tijd' in data else None,
            eind_tijd=time.fromisoformat(data['eind_tijd']) if 'eind_tijd' in data else None,
            status=data.get('status'),
            opmerkingen=data.get('opmerkingen')
        )
        if vlucht_cyclus:
            return jsonify(vlucht_cyclus)
        return jsonify({"error": "Vlucht cyclus not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/vlucht-cycli/<int:vlucht_cyclus_id>', methods=['DELETE'])
def delete_vlucht_cyclus(vlucht_cyclus_id):
    success = VluchtCyclusHelper.delete_vlucht_cyclus(vlucht_cyclus_id)
    if success:
        return jsonify({"message": "Vlucht cyclus deleted successfully"}), 200
    return jsonify({"error": "Vlucht cyclus not found"}), 404

# --- DockingCyclus Routes ---
@app.route('/api/docking-cycli', methods=['GET'])
def get_docking_cycli():
    cyclus_id = request.args.get('cyclus_id')
    if cyclus_id:
        docking_cycli = DockingCyclusHelper.get_docking_cycli_by_cyclus(int(cyclus_id))
    else:
        docking_cycli = DockingCyclusHelper.get_all_docking_cycli()
    return jsonify(docking_cycli)

@app.route('/api/docking-cycli/<int:docking_cyclus_id>', methods=['GET'])
def get_docking_cyclus(docking_cyclus_id):
    docking_cyclus = DockingCyclusHelper.get_docking_cyclus_by_id(docking_cyclus_id)
    if docking_cyclus:
        return jsonify(docking_cyclus)
    return jsonify({"error": "Docking cyclus not found"}), 404

@app.route('/api/docking-cycli', methods=['POST'])
def create_docking_cyclus():
    data = request.get_json()
    try:
        docking_cyclus = DockingCyclusHelper.create_docking_cyclus(
            cyclus_id=data['cyclus_id'],
            drone_id=data['drone_id'],
            docking_id=data['docking_id'],
            start_tijd=time.fromisoformat(data['start_tijd']),
            eind_tijd=time.fromisoformat(data['eind_tijd']),
            status=data['status'],
            opmerkingen=data.get('opmerkingen', '')
        )
        return jsonify(docking_cyclus), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/docking-cycli/<int:docking_cyclus_id>', methods=['PUT'])
def update_docking_cyclus(docking_cyclus_id):
    data = request.get_json()
    try:
        docking_cyclus = DockingCyclusHelper.update_docking_cyclus(
            docking_cyclus_id=docking_cyclus_id,
            cyclus_id=data.get('cyclus_id'),
            drone_id=data.get('drone_id'),
            docking_id=data.get('docking_id'),
            start_tijd=time.fromisoformat(data['start_tijd']) if 'start_tijd' in data else None,
            eind_tijd=time.fromisoformat(data['eind_tijd']) if 'eind_tijd' in data else None,
            status=data.get('status'),
            opmerkingen=data.get('opmerkingen')
        )
        if docking_cyclus:
            return jsonify(docking_cyclus)
        return jsonify({"error": "Docking cyclus not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/docking-cycli/<int:docking_cyclus_id>', methods=['DELETE'])
def delete_docking_cyclus(docking_cyclus_id):
    success = DockingCyclusHelper.delete_docking_cyclus(docking_cyclus_id)
    if success:
        return jsonify({"message": "Docking cyclus deleted successfully"}), 200
    return jsonify({"error": "Docking cyclus not found"}), 404

# --- Dashboard Routes ---
@app.route('/api/dashboard/event-overview/<int:event_id>', methods=['GET'])
def get_event_overview(event_id):
    try:
        # Get the event basic information
        event = EvenementHelper.get_event_by_id(event_id)
        if not event:
            return jsonify({"error": "Event not found"}), 404
        
        # Get zones count
        zones = ZoneHelper.get_zones_by_event(event_id)
        
        # Get startplaatsen count
        startplaatsen = StartplaatsHelper.get_startplaatsen_by_event(event_id)
        
        # Get docking stations count
        docking_stations = DockingHelper.get_docking_stations_by_event(event_id)
        
        # Get cycli information
        cycli = CyclusHelper.get_cycli_by_event(event_id)
        
        # Get active drone count
        active_drones = DroneHelper.get_active_drones_by_event(event_id)
        
        # Compile overview data
        overview = {
            "event": event,
            "stats": {
                "zones_count": len(zones),
                "startplaatsen_count": len(startplaatsen),
                "docking_stations_count": len(docking_stations),
                "cycli_count": len(cycli),
                "active_drones_count": len(active_drones)
            },
            "zones": zones,
            "startplaatsen": startplaatsen,
            "docking_stations": docking_stations
        }
        
        return jsonify(overview)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/dashboard/drone-status', methods=['GET'])
def get_drone_status():
    try:
        event_id = request.args.get('event_id')
        drones = DroneHelper.get_all_drones() if not event_id else DroneHelper.get_active_drones_by_event(int(event_id))
        
        # Group by status
        status_counts = {}
        for drone in drones:
            status = drone.get('status', 'Unknown')
            if status not in status_counts:
                status_counts[status] = 0
            status_counts[status] += 1
        
        # Calculate battery level averages
        battery_levels = [drone.get('battery_level', 0) for drone in drones if drone.get('battery_level') is not None]
        avg_battery = sum(battery_levels) / len(battery_levels) if battery_levels else 0
        
        return jsonify({
            "total_drones": len(drones),
            "status_distribution": status_counts,
            "average_battery_level": avg_battery,
            "drones": drones
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/dashboard/cyclus-overview/<int:cyclus_id>', methods=['GET'])
def get_cyclus_overview(cyclus_id):
    try:
        # Get the cyclus information
        cyclus = CyclusHelper.get_cyclus_by_id(cyclus_id)
        if not cyclus:
            return jsonify({"error": "Cyclus not found"}), 404
        
        # Get vlucht cycli for this cyclus
        vlucht_cycli = VluchtCyclusHelper.get_vlucht_cycli_by_cyclus(cyclus_id)
        
        # Get docking cycli for this cyclus
        docking_cycli = DockingCyclusHelper.get_docking_cycli_by_cyclus(cyclus_id)
        
        # Count by status
        vlucht_status_counts = {}
        for vc in vlucht_cycli:
            status = vc.get('status', 'Unknown')
            if status not in vlucht_status_counts:
                vlucht_status_counts[status] = 0
            vlucht_status_counts[status] += 1
        
        docking_status_counts = {}
        for dc in docking_cycli:
            status = dc.get('status', 'Unknown')
            if status not in docking_status_counts:
                docking_status_counts[status] = 0
            docking_status_counts[status] += 1
        
        overview = {
            "cyclus": cyclus,
            "stats": {
                "total_vlucht_cycli": len(vlucht_cycli),
                "total_docking_cycli": len(docking_cycli),
                "vlucht_status_distribution": vlucht_status_counts,
                "docking_status_distribution": docking_status_counts
            },
            "vlucht_cycli": vlucht_cycli,
            "docking_cycli": docking_cycli
        }
        
        return jsonify(overview)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the application
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5328))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)