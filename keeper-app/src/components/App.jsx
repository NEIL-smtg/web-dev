import {React, useState} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
	const [noteArr, updateNote] = useState([]);

	function addNote(event, noteItem) {
		updateNote((prev) => {
			return [...prev, noteItem];
		})
		event.preventDefault();
	}

	function deleteNote(id){
		updateNote((prev) => {
			return (
				prev.filter((element, index) => {
					return (index !== id);
				})
			)
		});
	}

	function createNote(element, index) {
		return (
			<Note
			key={index}
			id={index}
			title={element.title}
			content={element.content}
			onClick={deleteNote}
		/>);
	}

	return (
	<div>
		<Header />
		<CreateArea addNote={addNote}/>
		{noteArr.map(createNote)}
		<Footer />
	</div>
	);
}

export default App;