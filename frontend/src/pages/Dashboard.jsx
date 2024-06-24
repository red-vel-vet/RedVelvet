import { useState, useEffect } from 'react';
import api from '../api';

function Dashboard() {
    const [hosts, setHosts] = useState([]);
    const [hostData, setHostData] = useState({
        name: '',
        description: '',
        approval_required: false,
        application_fee: '0.00',
        membership_available: false,
    });

    const [eventData, setEventData] = useState({
        title: '',
        start: '',
        end: '',
        city: '',
        state: '',
        description: '',
        membership_required: false,
        host: '',
    });

    useEffect(() => {
        getHosts();
    }, []);

    const getHosts = () => {
        api.get('/api/user-hosts/')
            .then((res) => res.data)
            .then((data) => { setHosts(data); console.log(data); })
            .catch((err) => alert(err));
    };

    const createHost = (e) => {
        e.preventDefault();
        api.post("/api/hosts/create/", hostData)
            .then((res) => {
                if (res.status === 201) {
                    alert("Host created successfully");
                    getHosts();
                    setHostData({
                        name: '',
                        description: '',
                        approval_required: false,
                        application_fee: '0.00',
                        membership_available: false,
                    }); // Reset the form after successful submission
                } else {
                    alert("Failed to create host");
                }
            })
            .catch((err) => alert(err));
    };

    const createEvent = (e) => {
        e.preventDefault();
        api.post("/api/events/create/", eventData)
            .then((res) => {
                if (res.status === 201) {
                    alert("Event created successfully");
                    setEventData({
                        title: '',
                        start: '',
                        end: '',
                        city: '',
                        state: '',
                        description: '',
                        membership_required: false,
                        host: '',
                    }); // Reset the form after successful submission
                } else {
                    alert("Failed to create event");
                }
            })
            .catch((err) => alert(err));
    };

    const handleHostChange = (e) => {
        const { name, value, type, checked } = e.target;
        setHostData({
            ...hostData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleEventChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEventData({
            ...eventData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Your Hosts</h2>
            <ul>
                {hosts.map(host => (
                    <li key={host.id}>
                        {host.name}
                    </li>
                ))}
            </ul>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <h2>Create New Host</h2>
                    <form onSubmit={createHost}>
                        <div>
                            <label>
                                Name:
                                <input
                                    type="text"
                                    name="name"
                                    value={hostData.name}
                                    onChange={handleHostChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Description:
                                <textarea
                                    name="description"
                                    value={hostData.description}
                                    onChange={handleHostChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Approval Required?:
                                <input
                                    type="checkbox"
                                    name="approval_required"
                                    checked={hostData.approval_required}
                                    onChange={handleHostChange}
                                />
                            </label>
                        </div>
                        {hostData.approval_required && (
                            <div>
                                <label>
                                    Application Fee:
                                    <input
                                        type="text"
                                        name="application_fee"
                                        value={hostData.application_fee}
                                        onChange={handleHostChange}
                                    />
                                </label>
                            </div>
                        )}
                        <div>
                            <label>
                                Membership Available?:
                                <input
                                    type="checkbox"
                                    name="membership_available"
                                    checked={hostData.membership_available}
                                    onChange={handleHostChange}
                                />
                            </label>
                        </div>
                        <button type="submit">Create Host</button>
                    </form>
                </div>

                <div>
                    <h2>Create New Event</h2>
                    <form onSubmit={createEvent}>
                        <div>
                            <label>
                                Title:
                                <input
                                    type="text"
                                    name="title"
                                    value={eventData.title}
                                    onChange={handleEventChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Start:
                                <input
                                    type="datetime-local"
                                    name="start"
                                    value={eventData.start}
                                    onChange={handleEventChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                End:
                                <input
                                    type="datetime-local"
                                    name="end"
                                    value={eventData.end}
                                    onChange={handleEventChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                City:
                                <input
                                    type="text"
                                    name="city"
                                    value={eventData.city}
                                    onChange={handleEventChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                State:
                                <input
                                    type="text"
                                    name="state"
                                    value={eventData.state}
                                    onChange={handleEventChange}
                                    maxLength="2"
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Description:
                                <textarea
                                    name="description"
                                    value={eventData.description}
                                    onChange={handleEventChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Membership Required?:
                                <input
                                    type="checkbox"
                                    name="membership_required"
                                    checked={eventData.membership_required}
                                    onChange={handleEventChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Host:
                                <select
                                    name="host"
                                    value={eventData.host}
                                    onChange={handleEventChange}
                                >
                                    <option value="">Select a Host</option>
                                    {hosts.map(host => (
                                        <option key={host.id} value={host.id}>
                                            {host.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <button type="submit">Create Event</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;