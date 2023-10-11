import React, {
	useEffect,
	useState,
	useContext,
	useRef,
	createElement,
	Children,
} from "react";
import Atom from "../Atom/Atom";
import Bond from "../Bond/Bond";
import Display from "../Display/Display";
import UnitCell from "../UnitCell/UnitCell";
import DisplayCard from "../DisplayCard/DisplayCard";
import { BasisVectors } from "../BasisVectors/BasisVectors";
import { GizmoHelper } from "../BasisVectors/GizmoHelper";
import { SpotLight, Stage } from "@react-three/drei";
import { invalidate, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function CameraRig(props) {
	const currentView = props.view;
	const currentViewData = props.viewData[currentView];
	const newUp = currentViewData.up;
	const newPosition = new THREE.Vector3().fromArray(currentViewData.lookAt);
	const zeroVec = new THREE.Vector3(0.0, 0.0, 0.0);
	const initCameraPosition = useThree((state) => state.camera.position);
	const radius = initCameraPosition.distanceTo(zeroVec);
	useFrame((state) => {
		const cameraPosition = new THREE.Vector3().add(state.camera.position);
		const endPosition = new THREE.Vector3().add(newPosition);
		endPosition.multiplyScalar(radius);
		if (props.animate) {
			state.camera.position.lerp(endPosition, 0.25);
			state.camera.lookAt(0, 0, 0);
			state.camera.up.set(newUp[0], newUp[1], newUp[2]);
			if (cameraPosition.angleTo(endPosition) < 0.01) {
				props.setAnimateView({ view: props.view, animate: false });
			}
			invalidate();
		}
	});
}

function StructureView(props) {
	const api = props.api;
	const structureData = props.structureData;
	const [atoms, setAtoms] = useState([]);
	const [bonds, setBonds] = useState([]);
	const [unitCell, setUnitCell] = useState([]);
	const [basis, setBasis] = useState([
		[1.0, 0.0, 0.0],
		[0.0, 1.0, 0.0],
		[0.0, 0.0, 1.0],
	]);
	const [centerShift, setCenterShift] = useState([0.0, 0.0, 0.0]);
	const [viewData, setViewData] = useState({
		a: {
			lookAt: [1.0, 0.0, 0.0],
			up: [0.0, 1.0, 0.0],
		},
		b: {
			lookAt: [1.0, 0.0, 0.0],
			up: [0.0, 1.0, 0.0],
		},
		c: {
			lookAt: [1.0, 0.0, 0.0],
			up: [0.0, 1.0, 0.0],
		},
		"a*": {
			lookAt: [1.0, 0.0, 0.0],
			up: [0.0, 1.0, 0.0],
		},
		"b*": {
			lookAt: [1.0, 0.0, 0.0],
			up: [0.0, 1.0, 0.0],
		},
		"c*": {
			lookAt: [1.0, 0.0, 0.0],
			up: [0.0, 1.0, 0.0],
		},
	});
	const [animateView, setAnimateView] = useState({
		view: "a",
		animate: false,
	});
	// const [animate, setAnimate] = useState(false);

	useEffect(() => {
		fetch(api, {
			method: "POST",
			body: structureData.structure,
		})
			.then((res) => {
				console.log("POSTING DATA");
				if (!res.ok) {
					throw new Error("Bad Response");
				}
				return res.json();
			})
			.then((data) => {
				console.log("SETTING DATA");
				setAtoms(
					data.atoms.map((props, i) => <Atom key={i} {...props} />)
				);
				setBonds(
					data.bonds.map((props, i) => <Bond key={i} {...props} />)
				);
				setUnitCell(
					data.unitCell.map((props, i) => (
						<UnitCell key={0} {...props} />
					))
				);
				setCenterShift(data.centerShift);
				setBasis(data.basis);
				setViewData(data.viewData);
			})
			.catch((err) => {
				console.error(err);
			});
	}, [api, structureData]);

	let toshow;
	if (atoms.length > 0) {
		toshow = (
			<Display>
				<group position={centerShift}>
					{atoms}
					{bonds}
					{unitCell}
				</group>

				<GizmoHelper alignment='bottom-left' margin={[60, 60]}>
					<ambientLight intensity={2.0} />
					{/* <pointLight position={[0, 0, 0]} intensity={10000} /> */}
					<BasisVectors
						basis={basis}
						axisColors={["red", "green", "blue"]}
						labelColor='black'
					/>
				</GizmoHelper>
				<CameraRig
					view={animateView.view}
					setAnimateView={setAnimateView}
					viewData={viewData}
					animate={animateView.animate}
				/>
			</Display>
		);
	} else {
		toshow = <></>;
	}

	const bottomButtons = (
		<div className='grid flex-auto grid-cols-6 justify-center items-left my-4 mx-12 gap-4'>
			<button
				onClick={() => {
					setAnimateView({ view: "a", animate: true });
				}}
				className='aspect-square bg-cardbutton hover:bg-cardbuttonhover focus:bg-cardbuttonfocus rounded-2xl flex justify-center items-center'
			>
				a
			</button>
			<button
				onClick={() => {
					setAnimateView({ view: "b", animate: true });
				}}
				className='aspect-square bg-cardbutton hover:bg-cardbuttonhover focus:bg-cardbuttonfocus rounded-2xl flex justify-center items-center'
			>
				b
			</button>
			<button
				onClick={() => {
					setAnimateView({ view: "c", animate: true });
				}}
				className='aspect-square bg-cardbutton hover:bg-cardbuttonhover focus:bg-cardbuttonfocus rounded-2xl flex justify-center items-center'
			>
				c
			</button>
			<button
				onClick={() => {
					setAnimateView({ view: "a*", animate: true });
				}}
				className='aspect-square bg-cardbutton hover:bg-cardbuttonhover focus:bg-cardbuttonfocus rounded-2xl flex justify-center items-center'
			>
				a*
			</button>
			<button
				onClick={() => {
					setAnimateView({ view: "b*", animate: true });
				}}
				className='aspect-square bg-cardbutton hover:bg-cardbuttonhover focus:bg-cardbuttonfocus rounded-2xl flex justify-center items-center'
			>
				b*
			</button>
			<button
				onClick={() => {
					setAnimateView({ view: "c*", animate: true });
				}}
				className='aspect-square bg-cardbutton hover:bg-cardbuttonhover focus:bg-cardbuttonfocus rounded-2xl flex justify-center items-center'
			>
				c*
			</button>
		</div>
	);

	let labelElements = [];
	structureData.labelData.forEach((v) => {
		console.log(v);
		labelElements.push(createElement(v[0], v[1], v[2]));
	});
	console.log(labelElements)
	// console.log(textElements)
	// const testList = [createElement('p', {"className": "overline"}, '4'), createElement('p', {"className": "underline"}, '4')]
	const label = createElement(
		"span",
		{ className: "inline-block" },
		labelElements
	);

	return (
		<DisplayCard
			// topContents={props.label + ": " + structureData.formula + "   (" + structureData.spacegroup + ")" + test}
			// topContents={(<><p>(F</p><p className="overline">4</p><p>3</p><p>m)</p></>)}
			topContents={label}
			bottomContents={bottomButtons}
		>
			{toshow}
		</DisplayCard>
	);
}

export default StructureView;
