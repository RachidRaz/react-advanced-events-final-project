import { useContext, useEffect, useState } from "react";
import '../assets/styles/style.css';
import { ContextEvents } from "../api/events";
import {
  useToast,
  Card,
  CardBody,
  CardFooter,
  Stack,
  Heading,
  Divider,
  ButtonGroup,
  Button,
  Image,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

export default function EventsPage() {

  // the response from json-server loaded here 
  const { eventsData, usersData, categoriesData } = useContext(ContextEvents);

  // declarations of constants
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newEventModal, setNewEventModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: ""
  });

  const [newFormData, setNewFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    id: Math.floor(Math.random() * 90 + 10).toString(), //creating a random identifier
    createdBy: 1,
    location: "",
    image: "",
    categoryIds: [Math.floor(Math.random() * 3) + 1], // creating a random category identifier
  });

  // storing event and event details
  // and display modal
  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime
    });
    setShowModal(true);
  };

  // close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // set form data
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle submit event
  const handleSubmit = async (e) => {

    // prevent default event behaviour
    e.preventDefault();

    // find event that is already stored
    const updatedEvent = eventsData.find(event => event.id === selectedEvent.id);

    // set the event details with form data
    updatedEvent.title = formData.title;
    updatedEvent.description = formData.description;
    updatedEvent.startTime = formData.startTime;
    updatedEvent.endTime = formData.endTime;

    // updating event details, display message and hide modal
    try {
      await fetch(`http://localhost:3000/events/${selectedEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedEvent)
      });

      toast({
        title: 'Event Updated',
        description: "Event Data Successfully Updated",
        status: 'success',
        duration: 9000,
        isClosable: true,
      });

      setShowModal(false);

    } catch (error) {

      // displaying error when event saving has failed
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  // display new event modal
  const handleNewEventClick = () => {
    setNewEventModal(true);
  };

  // close new event modal
  const handleCloseNewEventModal = () => {
    setNewEventModal(false);
  };

  // prepare and compose form data
  const handleNewFormChange = (e) => {
    setNewFormData({ ...newFormData, [e.target.name]: e.target.value });
  };

  // submitting the form data
  const handleNewEventSubmit = async (e) => {

    // prevent default event behaviour
    e.preventDefault();

    try {
      // storing event form data
      await fetch(`http://localhost:3000/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFormData)
      });

      // displaying toast message
      toast({
        title: 'Event Added',
        description: "New Event Added Successfully",
        status: 'success',
        duration: 9000,
        isClosable: true,
      });

      // closing modal
      handleCloseNewEventModal();

      // reloading page (event data will also be reloaded from events server)
      window.location.reload();

    } catch (error) {

      // displaying error when event saving has failed
      toast({
        title: 'Error',
        description: "Failed to add new event",
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  // set filter data
  const filterData = (categoryId) => {
    setSelectedCategory(categoryId === 'reset' ? null : categoryId);
  };

  // display default image when no image is provided or image src is broken
  const handleImageError = (e) => {
    e.target.src = '/images/default-placeholder.jpg';
  };

  // filter events by title and/or category search
  const filteredEvents = eventsData ? eventsData.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === null || event.categoryIds.includes(parseInt(selectedCategory));

    return matchesSearch && matchesCategory;
  }) : [];


  // truncate large text to prevent horizontal box stretching
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + ".." : text;
  };

  useEffect(() => {
  }, [filteredEvents, selectedCategory])

  return (
    <>
      {/* filter events functionality */}
      <div className="FilterSection">
        <div className="SearchBar">
          <input
            className="InputField"
            type="text"
            placeholder="Search by event title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="SearchIcon">
            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="Filters" maxW="200px">
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Filters
            </MenuButton>
            <MenuList>

              <MenuItem onClick={() => filterData('reset')}>Reset Filters</MenuItem>
              {categoriesData ? categoriesData.map(category => (
                <MenuItem key={category.id} onClick={() => filterData(category.id)}>{category.name}</MenuItem>
              )) : null}
            </MenuList>
          </Menu>
        </div>
        <Button className="AddEventButton" onClick={handleNewEventClick}>
          Add Event
        </Button>
      </div>

      <div className="CardContainer">
        {filteredEvents.map(event => (
          <Link to={`/eventpage/${event.id}`} key={event.id}>
            <Card key={event.id} maxW='sm'>
              <CardBody>
                <Image src={event.image} alt={event.title} borderRadius='lg' onError={handleImageError} width="100%" height="200px"
                  objectFit="cover" />
                <Stack mt='6' spacing='2'>
                  <Heading size='sd'>Title:</Heading>
                  <Text>{event.title ?? "No title provided"}</Text>
                  <Heading size='sd'>Description:</Heading>
                  <Text>{truncateText(event.description, 40) ?? "No description provided"}</Text>
                  <Heading size='sd'>Created By:</Heading>
                  <Text>{usersData.find(user => user.id === event.createdBy)?.name}</Text>
                  <Heading size='sd'>Start time:</Heading>
                  <Text>{event.startTime} <b>To</b> {event.endTime}</Text>
                </Stack>
              </CardBody>
              <Divider />
              <CardFooter>
              </CardFooter>
            </Card>
          </Link>

        ))}

        {/* new event modal */}
        <Modal isOpen={newEventModal} onClose={handleCloseNewEventModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Event</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleNewEventSubmit}>
              <ModalBody>
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input type="text" name="title" value={newFormData.title} onChange={handleNewFormChange} />
                </FormControl>
                <FormControl mt="4">
                  <FormLabel>Description</FormLabel>
                  <Input type="text" name="description" value={newFormData.description} onChange={handleNewFormChange} />
                </FormControl>
                <FormControl mt="4">
                  <FormLabel>Location</FormLabel>
                  <Input type="text" name="location" value={newFormData.location} onChange={handleNewFormChange} />
                </FormControl>
                <FormControl mt="4">
                  <FormLabel>Image URL</FormLabel>
                  <Input type="text" name="image" value={newFormData.image} onChange={handleNewFormChange} />
                </FormControl>
                <FormControl mt="4">
                  <FormLabel>Start Time</FormLabel>
                  <Input type="datetime-local" name="startTime" value={newFormData.startTime} onChange={handleNewFormChange} />
                </FormControl>
                <FormControl mt="4">
                  <FormLabel>End Time</FormLabel>
                  <Input type="datetime-local" name="endTime" value={newFormData.endTime} onChange={handleNewFormChange} />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} type="submit">
                  Add
                </Button>
                <Button onClick={handleCloseNewEventModal}>Cancel</Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </div>
    </>
  );

};
