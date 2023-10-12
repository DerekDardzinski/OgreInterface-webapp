import React, { useEffect, useState } from "react";
import BaseCard from "../BaseCard/BaseCard";

function OptimizePage() {
	const [filmNotation, setFilmNotation] = useState("cubic");
	const [substrateNotation, setSubstrateNotation] = useState("cubic");
	const [filmH, setFilmH] = useState(NaN);
	const [filmK, setFilmK] = useState(NaN);
	const [filmI, setFilmI] = useState("");
	const [filmL, setFilmL] = useState(NaN);
	const [substrateH, setSubstrateH] = useState(NaN);
	const [substrateK, setSubstrateK] = useState(NaN);
	const [substrateI, setSubstrateI] = useState("");
	const [substrateL, setSubstrateL] = useState(NaN);

	useEffect(() => {
		if (isNaN(filmH) || isNaN(filmK)) {
			setFilmI("");
		} else {
			setFilmI(-(filmH + filmK));
		}
	}, [filmH, filmK]);

	useEffect(() => {
		if (isNaN(substrateH) || isNaN(substrateK)) {
			setSubstrateI("");
		} else {
			setSubstrateI(-(substrateH + substrateK));
		}
	}, [substrateH, substrateK]);

	function handleSubmit(e) {
		// Prevent the browser from reloading the page
		e.preventDefault();

		// Read the form data
		const form = e.target;
		const formData = new FormData(form);

		// You can pass formData as a fetch body directly:
		// fetch('/some-api', { method: form.method, body: formData });

		// Or you can work with it as a plain object:
		const formJson = Object.fromEntries(formData.entries());
		console.log(formJson);
	}

	let filmMillerInput = <></>;
	if (filmNotation === "cubic") {
		filmMillerInput = (
			<div className='flex'>
				<div className=''>
					<label className='block mb-2 text-md text-gray-900'>
						h:
						<input
							type='text'
							id='filmH'
							placeholder='0'
							name='filmH'
							className='w-8 placeholder-gray-300 text-center ml-1 mr-3 border border-gray-300 rounded-md'
							onChange={(e) => {
								setFilmH(parseInt(e.target.value));
							}}
						/>
					</label>
				</div>
				<div className=''>
					<label className='block mb-2 text-md text-gray-900'>
						k:
						<input
							type='text'
							id='filmK'
							placeholder='0'
							name='filmK'
							className='w-8 placeholder-gray-300 text-center ml-1 mr-3 border border-gray-300 rounded-md'
							onChange={(e) => {
								setFilmK(parseInt(e.target.value));
							}}
						/>
					</label>
				</div>
				<div className=''>
					<label className='block mb-2 text-md text-gray-900'>
						l:
						<input
							type='text'
							id='filmL'
							placeholder='1'
							name='filmL'
							className='w-8 placeholder-gray-300 text-center ml-1 mr-3 border border-gray-300 rounded-md'
							onChange={(e) => {
								setFilmL(parseInt(e.target.value));
							}}
						/>
					</label>
				</div>
			</div>
		);
	}

	if (filmNotation === "hexagonal") {
		filmMillerInput = (
			<div className='flex'>
				<div className=''>
					<label className='block mb-2 text-md text-gray-900'>
						h:
						<input
							type='text'
							id='filmH'
							placeholder='0'
							name='filmH'
							className='w-8 placeholder-gray-300 text-center ml-1 mr-3 border border-gray-300 rounded-md'
							onChange={(e) => {
								setFilmH(parseInt(e.target.value));
							}}
						/>
					</label>
				</div>
				<div className=''>
					<label className='block mb-2 text-md text-gray-900'>
						k:
						<input
							type='text'
							id='filmK'
							placeholder='0'
							name='filmK'
							className='w-8 placeholder-gray-300 text-center ml-1 mr-3 border border-gray-300 rounded-md'
							onChange={(e) => {
								setFilmK(parseInt(e.target.value));
							}}
						/>
					</label>
				</div>
				<div className=''>
					<label className='block mb-2 text-md text-gray-900'>
						i:
						<input
							type='text'
							id='filmI'
							placeholder='0'
							value={filmI}
							name='filmI'
							className='w-8 placeholder-gray-300 text-center ml-1 mr-3 border border-gray-300 rounded-md'
							readOnly
						/>
					</label>
				</div>
				<div className=''>
					<label className='block mb-2 text-md text-gray-900'>
						l:
						<input
							type='text'
							id='filmL'
							placeholder='1'
							name='filmL'
							className='w-8 placeholder-gray-300 text-center ml-1 mr-3 border border-gray-300 rounded-md'
							onChange={(e) => {
								setFilmL(parseInt(e.target.value));
							}}
						/>
					</label>
				</div>
			</div>
		);
	}

	let substrateMillerInput = <></>;
	if (substrateNotation === "cubic") {
		substrateMillerInput = (
			<div className='flex'>
				<div className=''>
					<label className='block mb-2 text-md text-gray-900'>
						h:
						<input
							type='text'
							id='substrateH'
							placeholder='0'
							name='substrateH'
							className='w-8 placeholder-gray-300 text-center ml-1 mr-3 border border-gray-300 rounded-md'
							onChange={(e) => {
								setSubstrateH(parseInt(e.target.value));
							}}
						/>
					</label>
				</div>
				<div className=''>
					<label className='block mb-2 text-md text-gray-900'>
						k:
						<input
							type='text'
							id='substrateK'
							placeholder='0'
							name='substrateK'
							className='w-8 placeholder-gray-300 text-center ml-1 mr-3 border border-gray-300 rounded-md'
							onChange={(e) => {
								setSubstrateK(parseInt(e.target.value));
							}}
						/>
					</label>
				</div>
				<div className=''>
					<label className='block mb-2 text-md text-gray-900'>
						l:
						<input
							type='text'
							id='substrateL'
							placeholder='1'
							name='substrateL'
							className='w-8 placeholder-gray-300 text-center ml-1 mr-3 border border-gray-300 rounded-md'
							onChange={(e) => {
								setSubstrateL(parseInt(e.target.value));
							}}
						/>
					</label>
				</div>
			</div>
		);
	}

	if (substrateNotation === "hexagonal") {
		substrateMillerInput = (
			<div className='flex'>
				<div className=''>
					<label className='block mb-2 text-md text-gray-900'>
						h:
						<input
							type='text'
							id='hexSubstrateH'
							placeholder='0'
							name='substrateH'
							className='w-8 placeholder-gray-300 text-center ml-1 mr-3 border border-gray-300 rounded-md'
							onChange={(e) => {
								setSubstrateH(parseInt(e.target.value));
							}}
						/>
					</label>
				</div>
				<div className=''>
					<label className='block mb-2 text-md text-gray-900'>
						k:
						<input
							type='text'
							id='hexSubstrateK'
							placeholder='0'
							name='substrateK'
							className='w-8 placeholder-gray-300 text-center ml-1 mr-3 border border-gray-300 rounded-md'
							onChange={(e) => {
								setSubstrateK(parseInt(e.target.value));
							}}
						/>
					</label>
				</div>
				<div className=''>
					<label className='block mb-2 text-md text-gray-900'>
						i:
						<input
							type='text'
							id='hexSubstrateI'
							placeholder='0'
							name='substrateI'
							value={substrateI}
							className='w-8 placeholder-gray-300 text-center ml-1 mr-3 border border-gray-300 rounded-md'
							readOnly
						/>
					</label>
				</div>
				<div className=''>
					<label className='block mb-2 text-md text-gray-900'>
						l:
						<input
							type='text'
							id='hexSubstrateL'
							placeholder='1'
							name='substrateL'
							className='w-8 placeholder-gray-300 text-center ml-1 mr-3 border border-gray-300 rounded-md'
							onChange={(e) => {
								setSubstrateL(parseInt(e.target.value));
							}}
						/>
					</label>
				</div>
			</div>
		);
	}

	return (
		<div className='md:col-span-2'>
			<BaseCard>
				<form method='post' onSubmit={handleSubmit}>
					<div className='grid flex-auto grid-cols-2 gap-4'>
						<div>
							<p className='text-lg font-medium mb-1'>
								Film Miller Index:
							</p>
							<p className='text-md mb-1'>
								<label>
									<input
										className='mr-1'
										type='radio'
										name='filmMillerType'
										value='filmHKL'
										defaultChecked={true}
										onClick={() => setFilmNotation("cubic")}
									/>
									Cubic Notation
								</label>
								<label>
									<input
										className='ml-3 mr-1'
										type='radio'
										name='filmMillerType'
										value='filmHKIL'
										onClick={() =>
											setFilmNotation("hexagonal")
										}
									/>
									Hexagonal Notation
								</label>
							</p>
							{filmMillerInput}
						</div>
						<div>
							<p className='text-lg font-medium mb-1'>
								Substrate Miller Index:
							</p>
							<p className='text-md mb-1'>
								<label>
									<input
										className='mr-1'
										type='radio'
										name='substrateMillerType'
										value='substrateHKL'
										defaultChecked={true}
										onClick={() =>
											setSubstrateNotation("cubic")
										}
									/>
									Cubic Notation
								</label>
								<label>
									<input
										className='ml-3 mr-1'
										type='radio'
										name='substrateMillerType'
										value='substrateHKIL'
										onClick={() =>
											setSubstrateNotation("hexagonal")
										}
									/>
									Hexagonal Notation
								</label>
							</p>
							{substrateMillerInput}
						</div>
						<div>
							<label className='text-lg font-medium mb-1 text-gray-900'>
								Max Interface Area (optional):
							</label>
							<br></br>
							<input
								type='text'
								id='maxArea'
								name='maxArea'
								placeholder='200'
								className='placeholder-gray-300 mr-3 border border-gray-300 rounded-md pl-2'
							/>
						</div>
						<div>
							<label className='text-lg font-medium mb-1 text-gray-900'>
								Max Interface Strain:
							</label>
							<br></br>
							<input
								type='text'
								id='maxStrain'
								name='maxStrain'
								placeholder='0.05'
								className='placeholder-gray-300 mr-3 border border-gray-300 rounded-md pl-2'
							/>
						</div>
						<div className='flex items-center'>
							<label>
								<input
									className='ml-3 mr-1'
									type='checkbox'
									name='stableSubstrate'
									// value='substrateHKIL'
								/>
								Use most stable substrate?
							</label>
						</div>
						<div>
							<button
								type='submit'
								className='inline-flex items-center px-3 py-2 text-md font-medium text-center text-white rounded-lg bg-button hover:bg-buttonhover focus:ring-4 focus:outline-none focus:ring-blue-300'
							>
								Optimize Interface
								<svg
									className='w-3.5 h-3.5 ml-2'
									aria-hidden='true'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 14 10'
								>
									<path
										stroke='currentColor'
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='2'
										d='M1 5h12m0 0L9 1m4 4L9 9'
									/>
								</svg>
							</button>
						</div>
					</div>
				</form>
			</BaseCard>
		</div>
	);
}

export default OptimizePage;
