/**
 * Test script to verify Google Maps URLs for bus stops
 * Run with: node test-maps-urls.js
 */

const BUS_STOPS = [
  {
    id: 'etzelstr-1',
    name: 'Etzelstraße (Stop 1)',
    address: 'Etzelstraße, 74076 Heilbronn, Germany',
  },
  {
    id: 'etzelstr-2',
    name: 'Etzelstraße (Stop 2)',
    address: 'Etzelstraße, 74076 Heilbronn, Germany',
  },
  {
    id: 'fuegerstrasse',
    name: 'Fügerstraße',
    address: 'Fügerstraße, 74076 Heilbronn, Germany',
  },
  {
    id: 'europaplatz-west',
    name: 'Europaplatz/Bildungscampus West',
    address: 'HN Europapl./Bildungscampus West, 74072 Heilbronn, Germany',
  },
  {
    id: 'industrieplatz-ost',
    name: 'Industrieplatz Ost',
    address: 'Heilbronn Industrieplatz Ost, 74076 Heilbronn, Germany',
  },
];

function getSearchQuery(stop) {
  if (stop.id === 'europaplatz-west') {
    return 'Europaplatz Bildungscampus West Heilbronn HNV bus stop';
  } else if (stop.id === 'industrieplatz-ost') {
    return 'Industrieplatz Ost Heilbronn HNV bus stop';
  } else if (stop.id === 'fuegerstrasse') {
    return 'Fügerstraße Heilbronn HNV bus stop';
  } else if (stop.id === 'etzelstr-1' || stop.id === 'etzelstr-2') {
    return 'Etzelstraße Heilbronn HNV bus stop';
  } else {
    return `${stop.name} Heilbronn HNV bus stop`;
  }
}

console.log('=== Google Maps URL Test for Bus Stops ===\n');

BUS_STOPS.forEach((stop) => {
  const searchQuery = getSearchQuery(stop);
  
  console.log(`Stop: ${stop.name}`);
  console.log(`Address: ${stop.address}`);
  console.log(`Search Query: ${searchQuery}`);
  console.log(`Google Maps URL: https://maps.google.com/?q=${encodeURIComponent(searchQuery)}`);
  console.log(`Navigation URL: https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(searchQuery)}`);
  console.log(`Street View URL: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}&map_action=pano`);
  console.log('---\n');
});

console.log('\n✅ Test URLs generated. Please verify these URLs open the correct locations in Google Maps.');

