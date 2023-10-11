from typing import Dict, Union, List, Tuple
import itertools
import copy

from pymatgen.core.structure import Structure
from pymatgen.core.lattice import Lattice
from pymatgen.core.periodic_table import Element
from pymatgen.analysis.local_env import CrystalNN
from ase.data import chemical_symbols
from matplotlib.colors import to_hex
import numpy as np
import pyvista as pv

from OgreInterface.plotting_tools.colors import vesta_colors
from OgreInterface.miller import MillerSearch
from OgreInterface import utils as ogre_utils


def get_formatted_formula(formula: str) -> str:
    groups = itertools.groupby(formula, key=lambda x: x.isdigit())

    formatted_formula = []
    for k, group in groups:
        if k:
            data = ["sub", {}, "".join(list(group))]
        else:
            data = ["span", {}, "".join(list(group))]

        formatted_formula.append(data)

    return formatted_formula


def get_formatted_spacegroup(spacegroup: str) -> str:
    formatted_spacegroup = []

    i = 0
    while i < len(spacegroup):
        s = spacegroup[i]
        if s == "_":
            data = ["sub", {}, spacegroup[i + 1]]
            formatted_spacegroup.append(data)
            i += 2
        if s == "-":
            data = ["span", {"className": "overline"}, spacegroup[i + 1]]
            formatted_spacegroup.append(data)
            i += 2
        else:
            data = ["span", {}, spacegroup[i]]
            formatted_spacegroup.append(data)
            i += 1

    return formatted_spacegroup


def get_bond_info(
    structure: Structure,
    bond_dict_site_property: str = "base_index",
) -> Dict[int, Dict[str, Union[np.ndarray, int]]]:
    oxi_struc = structure.copy()
    oxi_struc.add_oxidation_state_by_guess()
    cnn = CrystalNN(search_cutoff=7.0, cation_anion=True)

    bond_dict = {}

    for i in range(len(structure)):
        info_dict = cnn.get_nn_info(oxi_struc, i)
        center_site = oxi_struc[i]
        center_coords = center_site.coords
        center_props = center_site.properties

        bonds = []
        to_Zs = []
        from_Zs = [center_site.specie.Z] * len(info_dict)
        to_eqs = []
        from_eqs = [center_props[bond_dict_site_property]] * len(info_dict)

        for neighbor in info_dict:
            neighbor_site = neighbor["site"]
            neighbor_props = neighbor["site"].properties
            neighbor_coords = neighbor_site.coords
            bond_vector = neighbor_coords - center_coords
            bonds.append(bond_vector)
            to_Zs.append(neighbor_site.specie.Z)
            to_eqs.append(neighbor_props[bond_dict_site_property])

        bonds = np.array(bonds)
        to_Zs = np.array(to_Zs).astype(int)
        from_Zs = np.array(from_Zs).astype(int)
        to_eqs = np.array(to_eqs).astype(int)
        from_eqs = np.array(from_eqs).astype(int)

        bond_dict[i] = {
            "bond_vectors": bonds,
            "to_Zs": to_Zs,
            "from_Zs": from_Zs,
            "to_site_index": to_eqs,
            "from_site_index": from_eqs,
        }

    return bond_dict


def get_rounded_structure(structure: Structure):
    return Structure(
        lattice=structure.lattice,
        species=structure.species,
        coords=np.mod(np.round(structure.frac_coords, 6), 1.0),
        coords_are_cartesian=False,
        to_unit_cell=True,
        site_properties=structure.site_properties,
    )


def get_plotting_information(
    structure: Structure,
    bond_dict: Dict[int, Dict[str, Union[np.ndarray, int]]],
    bond_dict_site_propery: str = "base_index",
):
    structure = get_rounded_structure(structure)

    lattice = structure.lattice

    atoms_to_show = []
    atom_Zs = []
    atom_site_indices = []

    for i, site in enumerate(structure):
        site_index = site.properties[bond_dict_site_propery]
        bond_info = bond_dict[site_index]
        cart_coords = site.coords
        bonds = bond_info["bond_vectors"]

        atoms_to_show.append(cart_coords)
        atoms_to_show.append(bonds + cart_coords[None, :])

        atom_Zs.append([site.specie.Z])
        atom_Zs.append(bond_info["to_Zs"])

        atom_site_indices.append([site_index])
        atom_site_indices.append(bond_info["to_site_index"])

        frac_coords = np.round(site.frac_coords, 6)
        zero_frac_coords = frac_coords == 0.0

        if zero_frac_coords.sum() > 0:
            image_shift = list(
                itertools.product([0, 1], repeat=zero_frac_coords.sum())
            )[1:]
            for shift in image_shift:
                image = np.zeros(3)
                image[zero_frac_coords] += np.array(shift)
                image_frac_coords = frac_coords + image
                image_cart_coords = lattice.get_cartesian_coords(
                    image_frac_coords
                )
                atoms_to_show.append(image_cart_coords)
                atoms_to_show.append(bonds + image_cart_coords)

                atom_Zs.append([site.specie.Z])
                atom_Zs.append(bond_info["to_Zs"])

                atom_site_indices.append([site_index])
                atom_site_indices.append(bond_info["to_site_index"])

    atoms_to_show = np.vstack(atoms_to_show)
    atom_Zs = np.concatenate(atom_Zs)
    atom_site_indices = np.concatenate(atom_site_indices)

    unique_atoms_to_show, mask = np.unique(
        np.round(atoms_to_show, 6),
        axis=0,
        return_index=True,
    )

    unique_atom_Zs = atom_Zs[mask]
    unique_atom_site_indicies = atom_site_indices[mask]

    atom_key = get_atom_key(
        structure=structure,
        cart_coords=unique_atoms_to_show,
        site_indices=unique_atom_site_indicies,
    )

    return (
        unique_atoms_to_show,
        unique_atom_Zs,
        atom_key,
    )


def get_atom_key(
    structure: Structure, cart_coords: np.ndarray, site_indices: np.ndarray
) -> List[Tuple[int, int, int, int]]:
    lattice = structure.lattice
    frac_coords = cart_coords.dot(lattice.inv_matrix)
    mod_frac_coords = np.mod(np.round(frac_coords, 6), 1.0)
    image = np.round(frac_coords - mod_frac_coords).astype(int)
    key_array = np.c_[site_indices, image]
    keys = list(map(tuple, key_array))

    return keys


def get_unit_cell(
    unit_cell: np.ndarray,
) -> pv.Line:
    frac_points = np.array(
        [
            [0, 0, 0],
            [1, 0, 0],
            [1, 1, 0],
            [0, 1, 0],
            [0, 0, 0],
            [0, 0, 1],
            [1, 0, 1],
            [1, 0, 0],
            [1, 0, 1],
            [1, 1, 1],
            [1, 1, 0],
            [1, 1, 1],
            [0, 1, 1],
            [0, 1, 0],
            [0, 1, 1],
            [0, 0, 1],
        ]
    )
    points = frac_points.dot(unit_cell)

    return [_three_flip(p) for p in points.tolist()]


def get_atom(
    position: np.ndarray,
    atomic_number: int,
) -> pv.Sphere:
    radius = Element(chemical_symbols[atomic_number]).atomic_radius / 2
    sphere = pv.Sphere(
        radius=radius,
        center=position,
        theta_resolution=20,
        phi_resolution=20,
    )

    return sphere


def get_bond(
    position: np.ndarray,
    bond: np.ndarray,
    atomic_number: int,
) -> pv.Cylinder:
    bond_center = position + (0.25 * bond)
    bond_length = np.linalg.norm(bond)
    norm_bond = bond / bond_length

    cylinder = pv.Cylinder(
        center=bond_center,
        direction=norm_bond,
        radius=0.1,
        height=0.5 * bond_length,
        resolution=20,
    )

    return cylinder


def get_radius(Z: int, scale: float = 0.5):
    return float(scale * Element(chemical_symbols[Z]).atomic_radius)


def _three_flip(xyz):
    x, y, z = xyz
    return [x, z, -y]


def get_threejs_data(data_dict):
    structure = Structure.from_dict(data_dict)
    structure.add_site_property("base_index", list(range(len(structure))))
    center_shift = structure.lattice.get_cartesian_coords([0.5, 0.5, 0.5])

    bond_dict = get_bond_info(
        structure=structure,
        bond_dict_site_property="base_index",
    )

    atom_positions, atomic_numbers, atom_keys = get_plotting_information(
        structure=structure,
        bond_dict=bond_dict,
        bond_dict_site_propery="base_index",
    )
    bond_list = []
    atom_list = [
        {
            "position": _three_flip(p.tolist()),
            "radius": get_radius(Z),
            "color": to_hex(vesta_colors[Z]),
        }
        for p, Z in zip(atom_positions, atomic_numbers)
    ]

    for i in range(len(atom_positions)):
        position = atom_positions[i]
        Z = atomic_numbers[i]
        atom_key = atom_keys[i]
        color = to_hex(vesta_colors[Z])

        bond_vectors = bond_dict[atom_key[0]]["bond_vectors"]
        to_site_index = bond_dict[atom_key[0]]["to_site_index"]
        to_Zs = bond_dict[atom_key[0]]["to_Zs"]
        end_positions = bond_vectors + position
        from_radius = get_radius(Z)

        bond_keys = get_atom_key(
            structure=structure,
            cart_coords=end_positions,
            site_indices=to_site_index,
        )

        for j, bond_key in enumerate(bond_keys):
            if bond_key in atom_keys:
                to_radius = get_radius(to_Zs[j])
                norm_vec = bond_vectors[j] / np.linalg.norm(bond_vectors[j])
                from_atom_edge = position + (from_radius * norm_vec)
                to_atom_edge = end_positions[j] - (to_radius * norm_vec)

                center_position = 0.5 * (from_atom_edge + to_atom_edge)
                bond_data = {
                    "toPosition": _three_flip(center_position.tolist()),
                    "fromPosition": _three_flip(position.tolist()),
                    "color": color,
                }
                bond_list.append(bond_data)

    basis_vecs = copy.deepcopy(structure.lattice.matrix)
    norm_basis_vecs = basis_vecs / np.linalg.norm(basis_vecs, axis=1)
    basis = [_three_flip(v) for v in norm_basis_vecs.tolist()]
    a, b, c = basis
    ab_cross = np.cross(a, b)
    ac_cross = -np.cross(a, c)
    bc_cross = np.cross(b, c)

    view_info = {
        "a": {
            "lookAt": a,
            "up": (ab_cross / np.linalg.norm(ab_cross)).tolist(),
        },
        "b": {
            "lookAt": b,
            "up": (ab_cross / np.linalg.norm(ab_cross)).tolist(),
        },
        "c": {
            "lookAt": c,
            "up": (ac_cross / np.linalg.norm(ac_cross)).tolist(),
        },
        "a*": {
            "lookAt": bc_cross.tolist(),
            "up": (ab_cross / np.linalg.norm(ab_cross)).tolist(),
        },
        "b*": {
            "lookAt": ac_cross.tolist(),
            "up": (ab_cross / np.linalg.norm(ab_cross)).tolist(),
        },
        "c*": {
            "lookAt": ab_cross.tolist(),
            "up": (ac_cross / np.linalg.norm(ac_cross)).tolist(),
        },
    }

    return {
        "atoms": atom_list,
        "bonds": bond_list,
        "unitCell": [{"points": get_unit_cell(structure.lattice.matrix)}],
        "basis": basis,
        "viewData": view_info,
        "centerShift": _three_flip((-1 * center_shift).tolist()),
    }


def run_miller_scan(
    film_bulk,
    substrate_bulk,
    max_film_miller_index: int,
    max_substrate_miller_index: int,
    max_area: float,
    max_strain: float,
) -> Dict:
    film_structure = Structure.from_dict(film_bulk)
    substrate_structure = Structure.from_dict(substrate_bulk)

    print(film_structure)
    print(substrate_structure)


if __name__ == "__main__":
    cif = "../ogre-stuff/ita/workflow_tests/cifs/InAs.cif"
    struc = Structure.from_file(cif)
