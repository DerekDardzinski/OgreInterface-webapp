from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from pymatgen.core.structure import Structure
from pymatgen.symmetry.analyzer import SpacegroupAnalyzer
import json
import utils

# app instance
app = Flask(
    __name__,
    # static_url_path="",
    # static_folder="../frontend/.next",
    # template_folder="../fontend/.next",
)
CORS(app)


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
    film_formula_comp = utils.get_formatted_formula(film_formula)
    film_sg = SpacegroupAnalyzer(structure=film_struc)
    film_sg_symbol = film_sg.get_space_group_symbol()
    film_sg_comp = utils.get_formatted_spacegroup(film_sg_symbol)
    film_label = (
        [["span", {}, "Film: "]]
        + film_formula_comp
        + [["span", {}, " ("]]
        + film_sg_comp
        + [["span", {}, ")"]]
    )

    substrate_struc = Structure.from_str(substrate_file_contents, fmt="cif")
    substrate_formula = substrate_struc.composition.reduced_formula
    substrate_formula_comp = utils.get_formatted_formula(substrate_formula)
    substrate_sg = SpacegroupAnalyzer(structure=substrate_struc)
    substrate_sg_symbol = substrate_sg.get_space_group_symbol()
    substrate_sg_comp = utils.get_formatted_spacegroup(substrate_sg_symbol)
    substrate_label = (
        [["span", {}, "Substrate: "]]
        + substrate_formula_comp
        + [["span", {}, " ("]]
        + substrate_sg_comp
        + [["span", {}, ")"]]
    )

    return jsonify(
        {
            "film": film_struc.to_json(),
            "filmSpaceGroup": film_sg_symbol,
            "filmLabel": film_label,
            "substrate": substrate_struc.to_json(),
            "substrateLabel": substrate_label,
        }
    )


@app.route("/api/structure_to_three", methods=["POST"])
@cross_origin()
def convert_structure_to_three():
    json_data = request.data.decode()
    data_dict = json.loads(json_data)

    if len(data_dict.keys()) == 0:
        return jsonify({"atoms": [], "bonds": [], "basis": []})
    else:
        plotting_data = utils.get_threejs_data(data_dict=data_dict)

        return jsonify(plotting_data)


@app.route("/api/miller_scan", methods=["POST"])
@cross_origin()
def miller_scan():
    data = request.form
    max_film_miller = data["maxFilmMiller"]
    max_substrate_miller = data["maxSubstrateMiller"]
    _max_area = data["maxArea"]

    if _max_area == "":
        max_area = None
    else:
        max_area = float(max_area.strip())

    max_strain = data["maxStrain"]
    substrate_structure_dict = json.loads(data["substrateStructure"])
    film_structure_dict = json.loads(data["filmStructure"])

    utils.run_miller_scan(
        film_bulk=film_structure_dict,
        substrate_bulk=substrate_structure_dict,
        max_film_miller_index=int(max_film_miller.strip()),
        max_substrate_miller_index=int(max_substrate_miller.strip()),
        max_area=max_area,
        max_strain=float(max_strain.strip()),
    )

    return jsonify({"test": "test"})


if __name__ == "__main__":
    app.run(debug=False, port=8080)
