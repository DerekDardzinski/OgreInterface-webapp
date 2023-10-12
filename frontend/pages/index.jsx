import React, { useState, useEffect } from "react";
import AppContext from "../components/AppContext/AppContext";
import FileUploader from "../components/FileUploader/FileUploader";
import StructureView from "../components/StructureView/StructureView";
import BaseCard from "../components/BaseCard/BaseCard";
import SelectionPage from "../components/SelectionPage/SelectionPage";

function Index() {
	const [substrateData, setSubstrateData] = useState("");
	const [filmData, setFilmData] = useState("");

	return (
		<AppContext.Provider
			value={{
				film: [filmData, setFilmData],
				substrate: [substrateData, setSubstrateData],
			}}
		>
			<div className='bg-pagebg w-screen h-full min-h-screen'>
				<div className='flex items-top justify-center'>
					<div className='max-w-[100vh] flex-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-6'>
						<div className='md:col-span-2'>
							<BaseCard>
								<div className='flex justify-center items-center text-2xl font-bold'>
									Welcome to the OgreInterface Web Application
								</div>
							</BaseCard>
						</div>
						<div className='md:col-span-2'>
							<FileUploader />
						</div>

						{substrateData != "" && filmData != "" && (
							<>
								<StructureView structureData={filmData} />
								<StructureView structureData={substrateData} />
								<SelectionPage />
							</>
						)}
					</div>
				</div>
			</div>
		</AppContext.Provider>
	);
}

export default Index;
