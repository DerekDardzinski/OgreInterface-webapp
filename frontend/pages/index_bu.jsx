import React, { useEffect, useState } from "react";
import axios from "axios";

function Index() {
	const [file, setFile] = useState(null);
	const [msg, setMsg] = useState(null);

	function handleUpload() {
		if (!file) {
			setMsg("No File Selected");
			return;
		}

		const fd = new FormData();
		fd.append("file", file);

		setMsg("Uploading...");
		fetch("http://localhost:8080/api/sub_upload", {
            method: "POST",
            body: fd,
            headers: {
                "Custom-Header": "value",
            }
		})
		.then((res) => {
			if (!res.ok) {
				throw new Error("Bad Response");
			}
			setMsg("Upload Successful");
			return res.json();
		})
		.then(data => console.log(data))
		.catch((err) => {
			setMsg("Upload Failed");
			console.error(err);
		});
	}

	return (
		<div>
			<input
				onChange={(e) => {
					setFile(e.target.files[0]);
				}}
				type='file'
			/>
			<button onClick={handleUpload}>Upload</button>

		    {msg && <span>{msg}</span>}
		</div>
	);
}

export default Index;
