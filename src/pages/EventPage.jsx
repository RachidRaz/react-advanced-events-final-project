import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ContextEvents } from '../api/events';
import { Center, Input, FormControl, FormLabel, Box, Heading, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useToast, Image } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons'

export default function EventPage() {
    const toast = useToast();
    const navigate = useNavigate();
    const { eventsData, usersData } = useContext(ContextEvents);
    const { eventId } = useParams();
    const [currentEvent, setCurrentEvent] = useState(null);
    const [user, setUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // define form data
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startTime: "",
        endTime: ""
    });

    // matching event data and preset form data
    useEffect(() => {
        const event = eventsData ? eventsData.find(data => data.id === eventId) : [];
        setCurrentEvent(event);

        if (event) {
            setFormData({
                title: event.title,
                description: event.description,
                startTime: event.startTime,
                endTime: event.endTime
            });
        }


    }, [eventId, eventsData]);

    useEffect(() => {
        if (usersData && currentEvent) {
            const createdByUser = usersData.find(user => user.id === (currentEvent.createdBy ? currentEvent.createdBy.toString() : ''));
            setUser(createdByUser);
        }
    }, [usersData, currentEvent]);

    // display edit modal when editing
    const handleEditClick = () => {
        setShowEditModal(true);
    };

    // closing edit modal
    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    // set values when entering details to form
    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // submit form data to be saved
    const handleSubmit = async () => {
        try {
            const updatedEvent = { ...currentEvent };
            updatedEvent.title = formData.title;
            updatedEvent.description = formData.description;
            updatedEvent.startTime = formData.startTime;
            updatedEvent.endTime = formData.endTime;

            await fetch(`http://localhost:3000/events/${updatedEvent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedEvent)
            });

            toast({
                title: 'Event Updated',
                description: "Event data updated successfully",
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            setShowEditModal(false);
        } catch (error) {
            toast({
                title: 'Error',
                description: "Failed to update event data",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            console.error("Error updating event data:", error);
        }
    };

    // handle delete action with user prompt
    const handleDeleteConfirm = async () => {
        const confirmation = window.confirm('Are you sure you want to delete this event?');
        if (confirmation) {
            await handleDeleteClick(eventId);
        }
    };

    // handle delete functionality
    const handleDeleteClick = async (eventId) => {
        try {
            await fetch(`http://localhost:3000/events/${eventId}`, {
                method: 'DELETE',
            });

            toast({
                title: 'Event Deleted',
                description: "Event deleted successfully",
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            navigate('/')
            window.location.reload();
        } catch (error) {
            toast({
                title: 'Error',
                description: "Failed to delete event",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            console.error("Error deleting event:", error);
        }
    };

    // display default image when no image is provided or image src is broken
    const handleImageError = (e) => {
        e.target.src = '/images/default-placeholder.jpg';
    };

    return (
        <Box p="6">
            <Link to='/'>
                <ArrowBackIcon boxSize={6} />
            </Link>
            <Center>
                <Heading as="h1" mb="4">Event Details</Heading>
            </Center>

            {/* if event exists display event and user details, else default to no event warning */}
            {currentEvent ? (
                <Center>
                    <Box maxW="200px">
                        <Text fontSize="lg" mb="2" style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "bold" }}>
                            <Image
                                src={user?.image}
                                alt="User Image"
                                borderRadius="full"
                                boxSize="50px"
                                ml="2"
                                display="inline-block"
                            />
                            {user?.name}
                        </Text>

                        <Image
                            src={currentEvent?.image}
                            alt="Event Image"
                            borderRadius="lg"
                            mt="2"
                            boxSize="300px"
                            width="200px" height="200px"
                            onError={handleImageError}
                            objectFit="cover"
                        />
                        <Text fontSize="xl" mb="2"><b>Title:</b> {currentEvent.title}</Text>
                        <Text fontSize="lg" mb="2"><b>Description:</b> {currentEvent.description}</Text>
                        <Text fontSize="lg" mb="2"><b>Start Time:</b> {currentEvent.startTime}</Text>
                        <Text fontSize="lg" mb="2"><b>End Time:</b> {currentEvent.endTime}</Text>

                        <Button colorScheme="blue" onClick={handleEditClick}>Edit</Button>
                        <Button colorScheme="red" ml="2" onClick={handleDeleteConfirm}>Delete</Button>
                    </Box>
                </Center>

            ) : (
                <Text fontSize="xl">Event not found!</Text>
            )}


            {/* Edit Modal */}
            <Modal isOpen={showEditModal} onClose={handleCloseEditModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Event</ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={handleSubmit}>
                        <ModalBody>
                            <FormControl>
                                <FormLabel>Title</FormLabel>
                                <Input type="text" name="title" value={formData.title} onChange={handleFormChange} />
                            </FormControl>
                            <FormControl mt="4">
                                <FormLabel>Description</FormLabel>
                                <Input type="text" name="description" value={formData.description} onChange={handleFormChange} />
                            </FormControl>
                            <FormControl mt="4">
                                <FormLabel>Start Time</FormLabel>
                                <Input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleFormChange} />
                            </FormControl>
                            <FormControl mt="4">
                                <FormLabel>End Time</FormLabel>
                                <Input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleFormChange} />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} type="submit">
                                Save
                            </Button>
                            <Button onClick={handleCloseEditModal}>Cancel</Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>

        </Box>
    );
}
