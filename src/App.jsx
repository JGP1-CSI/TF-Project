import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [transformers, setTransformers] = useState([]);
    const [selectedTransformer, setSelectedTransformer] = useState(null);
    const [transformerTickets, setTransformerTickets] = useState([]);
    const [noteData, setNoteData] = useState({ noteDescription: "" });
    const [error, setError] = useState(null);

    const BASE_URL = "http://localhost:6802";

    useEffect(() => {
        const fetchTransformers = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/users`);
                setTransformers(response.data);
            } catch (err) {
                console.error("Error fetching transformers:", err);
                setError("Failed to fetch transformers.");
            }
        };

        fetchTransformers();
    }, []);

    const handleTransformerChange = async (e) => {
        const name = e.target.value;
        setNoteData({ ...noteData, name });

        const selectedTransformer = transformers.find(transformer => transformer.TransformerName === name);
        setSelectedTransformer(selectedTransformer || null);

        if (selectedTransformer) {
            try {
                const ticketsResponse = await axios.get(`${BASE_URL}/api/tickets`, { params: { transformerId: selectedTransformer.id } });
                setTransformerTickets(ticketsResponse.data);
            } catch (err) {
                console.error("Error fetching tickets:", err);
            }
        }
    };

    const handleNoteChange = (e) => {
        setNoteData({ ...noteData, noteDescription: e.target.value });
    };

    const handleSubmitNote = async (e) => {
        e.preventDefault();
        const { noteDescription } = noteData;

        if (!noteDescription) {
            alert("Note description is required");
            return;
        }

        const selectedTransformer = transformers.find(transformer => transformer.TransformerName === noteData.name);

        try {
            const response = await axios.post(`${BASE_URL}/api/create-ticket`, { 
                transformerId: selectedTransformer.id, 
                changeDescription: noteDescription, 
                faction: selectedTransformer.faction, 
                status: 'Pending' 
            });

            const newTicket = {
                ticketId: response.data.ticketId,
                id: selectedTransformer.id,
                TransformerName: selectedTransformer.TransformerName,
                faction: selectedTransformer.faction,
                originalDescription: selectedTransformer.TransformersDescription || "No description available",
                ticketDescription: noteDescription,
                status: response.data.status, 
            };

            setTransformerTickets((prevTickets) => [...prevTickets, newTicket]);
            alert("Ticket created successfully");
            setNoteData({ noteDescription: "" });
        } catch (err) {
            console.error("Error creating ticket:", err);
            setError("Failed to create ticket.");
        }
    };

    const getBoxStyles = (faction) => {
        if (faction === "Autobot") {
            return {
                borderColor: "#e74c3c",  // Red
                color: "#e74c3c",
            };
        } else if (faction === "Decepticon") {
            return {
                borderColor: "#8e44ad",  // Purple
                color: "#8e44ad",
            };
        }
        return {};
    };

    return (
        <div className="container">
            <h1>Transformers Management System</h1>
            {error && <div className="error">{error}</div>}

            <div className="transformers-section">
                <h2>Select Transformer</h2>
                <select value={noteData.name} onChange={handleTransformerChange} className="select-box">
                    <option value="">Select a Transformer</option>
                    {transformers.map((transformer) => (
                        <option key={transformer.id} value={transformer.TransformerName}>
                            {transformer.TransformerName}
                        </option>
                    ))}
                </select>
            </div>

            {selectedTransformer && (
                <div className="transformer-details">
                    <div className="transformer-info" style={getBoxStyles(selectedTransformer.faction)}>
                        <h3>Transformer Details</h3>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Name</th>
                                    <td>{selectedTransformer.TransformerName}</td>
                                </tr>
                                <tr>
                                    <th>Faction</th>
                                    <td>{selectedTransformer.faction}</td>
                                </tr>
                                <tr>
                                    <th>Description</th>
                                    <td>{selectedTransformer.TransformersDescription || "No description available"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="tickets-section" style={getBoxStyles(selectedTransformer.faction)}>
                        <h3>Active Tickets</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Ticket ID</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transformerTickets.map((ticket) => (
                                    <tr key={ticket.ticketId}>
                                        <td>{ticket.ticketId}</td>
                                        <td>{ticket.ticketDescription}</td>
                                        <td>{ticket.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="create-note-section" style={getBoxStyles(selectedTransformer.faction)}>
                        <h3>Create Ticket</h3>
                        <form onSubmit={handleSubmitNote}>
                            <textarea
                                name="noteDescription"
                                value={noteData.noteDescription}
                                onChange={handleNoteChange}
                                placeholder="Describe the issue..."
                                className="note-textarea"
                            />
                            <button type="submit" className="submit-button">Create Ticket</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;

