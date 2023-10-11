import React, { useEffect, useState } from "react";
import axios from "axios";

function Index() {
	const [message, setMessage] = useState("Loading...");
	const [people, setPeople] = useState([]);
	const [file, setFile] = useState(null);
	const [progress, setProgress] = useState({ started: false, pc: 0 });
	const [msg, setMsg] = useState(null);

	function handleUpload() {
		if (!file) {
			setMsg("No File Selected");
			return;
		}

		const fd = new FormData();
		fd.append("file", file);

		setMsg("Uploading...");
		setProgress((prevState) => {
			return { ...prevState, started: true };
		});
		axios
			.post("http://httpbin.org/post", fd, {
				onUploadProgress: (progressEvent) => {
					setProgress((prevState) => {
						return {
							...prevState,
							pc: progressEvent.progress * 100,
						};
					});
				},
				headers: {
					"Custom-Header": "value",
				},
			})
			.then((res) => {
				setMsg("Upload Successful");
				console.log(res.data);
			})
			.catch((err) => {
				setMsg("Upload Failed");
				console.errer(err);
			});
	}

	useEffect(() => {
		fetch("http://localhost:8080/api/home")
			.then((response) => response.json())
			.then((data) => {
				setMessage(data.message);
				setPeople(data.people);
				console.log(data.people);
			});
	}, []);

	return (
		<div>
			<input
				onChange={(e) => {
					setFile(e.target.files[0]);
				}}
				type='file'
			/>
			<button onClick={handleUpload}>Upload</button>

      {progress.started && <progress max="100" value={progress.pc}></progress>}
      {msg && <span>{msg}</span>}
		</div>
	);
}

export default Index;
