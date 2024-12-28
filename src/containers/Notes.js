import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";

export default function Notes() {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    async function loadNote() {
      try {
        const fetchedNote = await API.get("notes", `/notes/${id}`);
        const { content, attachment } = fetchedNote;
        
        if (attachment) {
          fetchedNote.attachmentURL = await Storage.vault.get(attachment);
        }
        
        setContent(content);
        setNote(fetchedNote);
      } catch (e) {
        onError(e);
      }
    }

    loadNote();
  }, [id]);

  return (
    <div className="Notes">
      {note ? (
        <>
          <h2>{content}</h2>
          {note.attachmentURL && (
            <a href={note.attachmentURL} target="_blank" rel="noopener noreferrer">
              View Attachment
            </a>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
