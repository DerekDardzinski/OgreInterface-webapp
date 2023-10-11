import React from "react";

function DisplayCard(props) {
	return (
		<div className='aspect-square bg-cardbg border-gray-200 rounded-xl drop-shadow hover:drop-shadow-lg outline outline-1 outline-cardoutline'>
			<div className='text-xl flex items-center justify-center bg-cardhead h-[15%] rounded-t-xl'>
				{props.topContents}
			</div>
			<div className='bg-cardbg h-[70%]'>{props.children}</div>
			<div className='text-xl flex items-center justify-center bg-cardfoot h-[15%] rounded-b-xl'>
				{props.bottomContents}
			</div>
		</div>
	);
}

DisplayCard.defaultProps = {
	topLabel: "top",
	bottomLabel: "bot",
};

export default DisplayCard;
