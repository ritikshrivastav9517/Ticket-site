```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Train, Bus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// --- Import your static assets and components ---
import HomeLogo1 from "../assets/HomeLogo1.png";
import TravelOptions from './TravelOptions';

// Helper function
const getStationCode = (stationString) => {
    if (!stationString || !stationString.includes('(')) return stationString;
    const match = stationString.match(/\(([^)]+)\)/);
    return match ? match[1] : stationString;
};

// --- Ticket Item ---
const HomeTicketItem = ({ ticket, onDelete }) => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    const formattedDate = new Date(ticket.journeyDate).toLocaleDateString('en-GB');
    const isOwner = userInfo && userInfo._id === ticket.postedBy?._id;

    const handleDetailsClick = () => {
        if (ticket.travelType === 'bus') {
            navigate('/bus-tickets', { state: { scrollToId: ticket._id } });
        } else {
            navigate('/train-tickets', { state: { scrollToId: ticket._id } });
        }
    };

    const handleDeleteClick = async () => {
        if (!userInfo) {
            alert("Please log in to delete a ticket.");
            navigate('/login');
            return;
        }
        if (!isOwner) {
            alert("You can only delete your own tickets.");
            return;
        }

        if (window.confirm("Delete this ticket?")) {
            try {
                await axios.delete(`/api/v1/tickets/${ticket._id}`, { withCredentials: true });
                onDelete(ticket._id);
                alert("Deleted!");
            } catch (error) {
                alert("Delete failed");
            }
        }
    };

    return (
        <div className="relative bg-white p-4 rounded-lg shadow">
            <button onClick={handleDeleteClick} className="absolute top-2 right-2">
                <Trash2 size={18} />
            </button>

            <div className="flex justify-between mt-4">
                <div className="flex gap-2">
                    <span>{ticket.from}</span> → <span>{ticket.to}</span>
                </div>
                <span>{formattedDate}</span>
            </div>

            <button onClick={handleDetailsClick} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">
                Details
            </button>
        </div>
    );
};

// --- Section ---
const TicketSection = ({ title, tickets, iconType, onDelete }) => {
    if (tickets.length === 0) return null;

    return (
        <div>
            <h2 className="text-xl font-bold flex gap-2 items-center">
                {iconType === 'train' ? <Train /> : <Bus />} {title}
            </h2>

            <div className="space-y-3 mt-3">
                {tickets.map(ticket => (
                    <HomeTicketItem key={ticket._id} ticket={ticket} onDelete={onDelete} />
                ))}
            </div>
        </div>
    );
};

// --- MAIN ---
const Home = () => {
    const [busTickets, setBusTickets] = useState([]);
    const [trainTickets, setTrainTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const { data } = await axios.get('/api/v1/tickets');
                setBusTickets(data.data.filter(t => t.travelType === 'bus'));
                setTrainTickets(data.data.filter(t => t.travelType === 'train'));
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const handleDelete = (id) => {
        setBusTickets(prev => prev.filter(t => t._id !== id));
        setTrainTickets(prev => prev.filter(t => t._id !== id));
    };

    return (
        <>
            {/* 🔥 CI/CD PROOF */}
            <h1 style={{ color: "red", textAlign: "center", fontSize: "30px" }}>
                CI/CD WORKING 🔥
            </h1>

            <div className="p-5 space-y-10">

                <div
                    className="h-64 bg-cover rounded"
                    style={{ backgroundImage: `url(${HomeLogo1})` }}
                />

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <TicketSection title="Train Tickets" tickets={trainTickets} iconType="train" onDelete={handleDelete} />
                        <TicketSection title="Bus Tickets" tickets={busTickets} iconType="bus" onDelete={handleDelete} />
                    </div>
                )}

                <TravelOptions />
            </div>
        </>
    );
};

export default Home;
```
