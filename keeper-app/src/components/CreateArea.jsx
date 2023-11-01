import {React, useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import { Fab } from "@mui/material";
import Zoom from '@mui/material/Zoom';

function CreateArea(props) {

	let [expandTextArea, setExpandTextArea] = useState(false);
	const [noteItem, setNoteItem] = useState({
		title: '',
		content: ''
	});

	function TAOnClick() {
		setExpandTextArea(true);
	}

	function textOnChange(event) {
		const {value, name} = event.target;

		setNoteItem((prev) => {
			return {
				...prev,
				[name]: value
			};
		});
	}

	function submit(event) {
		props.addNote(event, noteItem);
		setNoteItem(() => {
			return {
				title: '',
				content: ''
			}
		});
	}

	function TextArea(){
		return (
			<textarea
			 	onClick={TAOnClick}
				value={noteItem.content}
				onChange={textOnChange}
				name="content"
				placeholder="Take a note..."
				rows={expandTextArea ? 3 : 1}
			/>
		);
	}

	function Input() {
		return (
			expandTextArea &&
			<input
				value={noteItem.title}
				onChange={textOnChange}
				name="title"
				placeholder="Title"/>
		);
	}

	return (
	
	<div>
		<form className="create-note" onSubmit={submit}>
			{Input()}
			{TextArea()}
			<Zoom in={expandTextArea} appear={expandTextArea}>
				<Fab type="submit"><AddIcon /></Fab>
			</Zoom>
		</form>
	</div>
	
	);
}

export default CreateArea;
