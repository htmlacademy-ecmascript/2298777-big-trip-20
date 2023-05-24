const offers = [
  {
    type: 'taxi',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 120
      }
    ]
  },
  {
    type: 'flight',
    offers: [
      {
        id: 1,
        title: 'Upgrade to comfort class',
        price: 50
      },
      {
        id: 2,
        title: 'Choose seats',
        price: 90
      },
    ]
  },
  {
    type: 'ship',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 120
      }
    ]
  },
  {
    type: 'train',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 120
      },
      {
        id: 2,
        title: 'Choose seats',
        price: 90
      },
      {
        id: 3,
        title: 'dinner',
        price: 40
      },
    ]
  },
  {
    type: 'drive',
    offers: [
      {
        id: 1,
        title: 'Rent a car',
        price: 200
      },
    ]
  }
];

// get offers by type and ids and return offers array
const getOfferById = (type, ids) => {
  const offer = offers.find((item) => item.type === type);
  const offerById = offer.offers.filter((item) => ids.includes(item.id));
  return offerById;
};

const getAllOffers = () => offers;

export {getOfferById, getAllOffers};
