const destinations = [
  {
    id: '1',
    description: 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    name: 'Chamonix',
    pictures: [
      {
        src: 'http://picsum.photos/300/200?r=0.0762563005163317',
        description: 'Chamonix parliament building'
      }
    ]
  },
  {
    id: '2',
    description: 'Geneva, is a beautiful city, a true asian pearl, with crowded streets.',
    name: 'Geneva',
    pictures: [
      {
        src: 'http://picsum.photos/300/200?r=0.0762563005163317',
        description: 'Geneva parliament building'
      },
      {
        src: 'http://picsum.photos/300/200?r=0.0762563005163317',
        description: 'Geneva parliament building'
      }
    ]
  },
  {
    id: '3',
    description: 'Paris, is a beautiful city, a true asian pearl, with crowded streets.',
    name: 'Paris',
    pictures: [
      {
        src: 'http://picsum.photos/300/200?r=0.0762563005163317',
        description: 'Paris parliament building'
      },
      {
        src: 'http://picsum.photos/300/200?r=0.0762563005163317',
        description: 'Paris parliament building'
      }
    ]
  },
  {
    id: '4',
    description: 'Nice, is a beautiful city, a true asian pearl, with crowded streets.',
    name: 'Nice',
    pictures: [
      {
        src: 'http://picsum.photos/300/200?r=0.0762563005163317',
        description: 'Nice parliament building'
      },
      {
        src: 'http://picsum.photos/300/200?r=0.0762563005163317',
        description: 'Nice parliament building'
      },
      {
        src: 'http://picsum.photos/300/200?r=0.0762563005163317',
        description: 'Nice parliament building'
      }
    ]
  },
  {
    id: '5',
    description: 'Cannes, is a beautiful city, a true asian pearl, with crowded streets.',
    name: 'Cannes',
    pictures: [
    ]
  },
  {
    id: '6',
    description: 'Lyon, is a beautiful city, a true asian pearl, with crowded streets.',
    name: 'Lyon',
    pictures: [
    ]
  }
];

const getDestinationById = (id) => destinations.find((destination) => destination.id === id);

const getDestinations = () => destinations;

export {getDestinationById, getDestinations};
