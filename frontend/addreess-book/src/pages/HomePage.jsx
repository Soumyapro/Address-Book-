import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const HomePage = () => {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [error, setError] = useState('');
    const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '', address: '' });
    const [editContact, setEditContact] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [redirect, setRedirect] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [contactsPerPage] = useState(6);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/get-details', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.data && response.data.data) {
                    setContacts(response.data.data);
                    setFilteredContacts(response.data.data);
                } else {
                    setError('Unexpected response format.');
                }
            } catch (err) {
                setError('Failed to fetch contacts. Please try again later.');
            }
        };
        fetchContacts();
    }, [token]);

    const handleChange = (e) => {
        setNewContact({ ...newContact, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (editContact) {
                response = await axios.put(
                    `http://localhost:8080/api/update-details/${editContact._id}`,
                    newContact,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const updatedContacts = contacts.map(contact =>
                    contact._id === editContact._id ? response.data : contact
                );
                setContacts(updatedContacts);
                setFilteredContacts(updatedContacts);
                setEditContact(null);
            } else {
                response = await axios.post(
                    'http://localhost:8080/api/submit-details',
                    newContact,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const updatedContacts = [...contacts, response.data];
                setContacts(updatedContacts);
                setFilteredContacts(updatedContacts);
            }
            setNewContact({ name: '', relation: '', phone: '', address: '' });
        } catch (err) {
            setError('Failed to add/update contact. Please try again later.');
        }
    };

    const handleEdit = (contact) => {
        setEditContact(contact);
        setNewContact({
            name: contact.name,
            relation: contact.relation,
            phone: contact.phone,
            address: contact.address
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/delete-details/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const updatedContacts = contacts.filter(contact => contact._id !== id);
            setContacts(updatedContacts);
            setFilteredContacts(updatedContacts);
        } catch (err) {
            setError('Failed to delete contact. Please try again later.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken('');
        setRedirect('/LoginPage');
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const searchResults = contacts.filter(contact =>
            Object.values(contact).some(val =>
                val.toString().toLowerCase().includes(e.target.value.toLowerCase())
            )
        );
        setFilteredContacts(searchResults);
        setCurrentPage(1);
    };

    const indexOfLastContact = currentPage * contactsPerPage;
    const indexOfFirstContact = indexOfLastContact - contactsPerPage;
    const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);

    const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-8">
            <motion.div
                className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Address Book</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by any field"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white mb-6">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 bg-gray-200">Name</th>
                                <th className="py-2 px-4 bg-gray-200">Relation</th>
                                <th className="py-2 px-4 bg-gray-200">Phone</th>
                                <th className="py-2 px-4 bg-gray-200">Address</th>
                                <th className="py-2 px-4 bg-gray-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentContacts.length > 0 ? (
                                currentContacts.map((contact) => (
                                    <tr key={contact._id} className="hover:bg-gray-100 transition duration-200">
                                        <td className="border px-4 py-2">{contact.name}</td>
                                        <td className="border px-4 py-2">{contact.relation}</td>
                                        <td className="border px-4 py-2">{contact.phone}</td>
                                        <td className="border px-4 py-2">{contact.address}</td>
                                        <td className="border px-4 py-2">
                                            <button
                                                onClick={() => handleEdit(contact)}
                                                className="text-blue-500 hover:underline mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(contact._id)}
                                                className="text-red-500 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">No contacts found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-4">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`mx-1 px-3 py-1 border rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={newContact.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Relation</label>
                            <input
                                type="text"
                                name="relation"
                                value={newContact.relation}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={newContact.phone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={newContact.address}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <button
                            type="submit"
                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                        >
                            {editContact ? 'Update Contact' : 'Add Contact'}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                        Logout
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default HomePage;
