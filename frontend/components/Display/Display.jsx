import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
	OrbitControls,
	SoftShadows,
	Stage,
	Center,
	OrthographicCamera,
	Bounds,
} from "@react-three/drei";
import * as THREE from "three";

function Display(props) {
	const dispRef = useRef();
	const lightRef = useRef();
	const lightRef2 = useRef();

	return (
		<div ref={dispRef} className='w-[100%] h-[100%]'>
			<Canvas
				gl={{ preserveDrawingBuffer: true }}
				dpr={1}
				orthographic={true}
			>
				<Bounds fit clip margin={1.4}>
					{props.children}
				</Bounds>

				<ambientLight intensity={0.1} />
				<pointLight
					ref={lightRef}
					position={[0, 0, 0]}
					intensity={100}
				/>
				<pointLight
					ref={lightRef2}
					position={[0, 1, 0]}
					intensity={100}
				/>

				<OrbitControls
					onChange={(e) => {
						if (!e) return;
						const camera = e.target.object;
						const radius = camera.position.length();

						if (lightRef.current) {
							lightRef.current.position.set(-10, 0, 0);
							lightRef.current.position.add(camera.position);
							lightRef.current.intensity = 1 * radius * radius;
						}

						if (lightRef2.current) {
							lightRef2.current.position.set(10, 0, 0);
							lightRef2.current.position.add(camera.position);
							lightRef2.current.intensity = 1 * radius * radius;
						}
					}}
				/>
			</Canvas>
		</div>
	);
}

export default Display;
