import { createContext, useState, useEffect } from "react";

const ContextEvents = createContext();


const EventProvider = ({ children }) => {

    const [usersData, setUsersData] = useState(null);
    const [eventsData, setEventsData] = useState(null);
    const [categoriesData, setCategoriesData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // fetching users from webserver
                const usersResponse = await fetch('http://localhost:3000/users');
                if (!usersResponse.ok) {
                    throw new Error('Failed to fetch users data');
                }
                const users = await usersResponse.json();
                console.error('User data:', users);
                setUsersData(users);

                // fetching events from webserver
                const eventsResponse = await fetch('http://localhost:3000/events');
                if (!eventsResponse.ok) {
                    throw new Error('Failed to fetch events data');
                }
                const events = await eventsResponse.json();
                console.error('Event data:', events);
                setEventsData(events);

                // fetching categories from webserver
                const categoriesResponse = await fetch('http://localhost:3000/categories');
                if (!categoriesResponse.ok) {
                    throw new Error('Failed to fetch categories data');
                }
                const categories = await categoriesResponse.json();
                console.error('Categories data:', categories);
                setCategoriesData(categories);

            } catch (error) {
            }
        };

        fetchData();
    }, []);

    return (
        <ContextEvents.Provider value={{ eventsData, usersData, categoriesData }}>
            {children}
        </ContextEvents.Provider>
    );
}

export { EventProvider, ContextEvents };
