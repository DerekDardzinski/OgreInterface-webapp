from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from pymatgen.core.structure import Structure
from pymatgen.symmetry.analyzer import SpacegroupAnalyzer
import json
import utils

# app instance
app = Flask(__name__)
CORS(app)


@app.route("/api/home", methods=["GET"])
def return_home():
    return jsonify(
        {
            "message": "Hello World!!!!!!",
            "people": ["Jack", "Harry", "Barry"],
        }
    )


@app.route("/api/structure_upload", methods=["POST"])
@cross_origin(supports_credentials=False)
def substrate_file_upload():
    film_file = request.files["filmFile"]
    substrate_file = request.files["substrateFile"]
    film_file.headers.add("Access-Control-Allow-Origin", "*")
    substrate_file.headers.add("Access-Control-Allow-Origin", "*")

    with film_file.stream as film_f:
        film_file_contents = film_f.read().decode()

    with substrate_file.stream as substrate_f:
        substrate_file_contents = substrate_f.read().decode()

    film_struc = Structure.from_str(film_file_contents, fmt="cif")
    film_formula = film_struc.composition.reduced_formula
    film_sg = SpacegroupAnalyzer(structure=film_struc)
    film_sg_symbol = film_sg.get_space_group_symbol()

    substrate_struc = Structure.from_str(substrate_file_contents, fmt="cif")
    substrate_formula = substrate_struc.composition.reduced_formula
    substrate_sg = SpacegroupAnalyzer(structure=substrate_struc)
    substrate_sg_symbol = substrate_sg.get_space_group_symbol()

    return jsonify(
        {
            "film": film_struc.to_json(),
            "filmSpaceGroup": film_sg_symbol,
            "filmFormula": film_formula,
            "substrate": substrate_struc.to_json(),
            "substrateSpaceGroup": substrate_sg_symbol,
            "substrateFormula": substrate_formula,
        }
    )


@app.route("/api/structure_to_three", methods=["POST"])
def convert_structure_to_three():
    json_data = request.data.decode()
    data_dict = json.loads(json_data)

    if len(data_dict.keys()) == 0:
        return jsonify({"atoms": [], "bonds": [], "basis": []})
    else:
        plotting_data = utils.get_threejs_data(data_dict=data_dict)

        return jsonify(plotting_data)


if __name__ == "__main__":
    app.run(debug=True, port=8080)
