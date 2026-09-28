const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  {
    name: 'AbiCare Front-Load Washing Machine',
    category: 'Laundry',
    imageUrl: 'images/washing-machine.svg',
    description: 'A quiet, energy-efficient washing machine with practical everyday cycles.',
    price: 3299,
    stock: 8
  },
  {
    name: 'PressPro Steam Iron',
    category: 'Laundry',
    imageUrl: 'images/steam-iron.svg',
    description: 'A powerful steam iron with a smooth ceramic soleplate for easy pressing.',
    price: 249,
    stock: 24
  },
  {
    name: 'VisionMax 55-inch Smart TV',
    category: 'Entertainment',
    imageUrl: 'images/smart-tv.svg',
    description: 'A vivid 4K smart television with streaming apps and clear built-in sound.',
    price: 4899,
    stock: 6
  },
  {
    name: 'BreezeCool Split Air Conditioner',
    category: 'Cooling',
    imageUrl: 'images/air-conditioner.svg',
    description: 'Reliable room cooling with multiple fan speeds and an easy-to-use remote.',
    price: 3799,
    stock: 10
  },
  {
    name: 'BlendMate Multi-Speed Blender',
    category: 'Kitchen',
    imageUrl: 'images/blender.svg',
    description: 'A durable countertop blender for smoothies, sauces, and everyday prep.',
    price: 399,
    stock: 18
  },
  {
    name: 'ChefCore Four-Burner Stove',
    category: 'Kitchen',
    imageUrl: 'images/stove.svg',
    description: 'A dependable four-burner stove with generous cooking space for family meals.',
    price: 2899,
    stock: 7
  },
  {
    name: 'HeatWave 25L Microwave Oven',
    category: 'Kitchen',
    description: 'A compact microwave with quick cooking, reheating, and defrost settings.',
    price: 1199,
    stock: 14
  },
  {
    name: 'CrispAir Digital Air Fryer',
    category: 'Kitchen',
    description: 'Enjoy crisp meals with less oil using preset cooking programs and a roomy basket.',
    price: 899,
    stock: 16
  },
  {
    name: 'ToastLine Four-Slice Toaster',
    category: 'Kitchen',
    description: 'Even browning, wide slots, and simple controls for quick breakfasts.',
    price: 299,
    stock: 20
  },
  {
    name: 'MeltMate Sandwich Maker',
    category: 'Kitchen',
    description: 'Non-stick plates and a compact design for golden toasted sandwiches.',
    price: 349,
    stock: 12
  },
  {
    name: 'QuickBoil Electric Kettle',
    category: 'Kitchen',
    description: 'A fast-boiling kettle with automatic shutoff and a generous 1.7L capacity.',
    price: 249,
    stock: 25
  },
  {
    name: 'FreshKeep 330L Double-Door Fridge',
    category: 'Refrigeration',
    imageUrl: 'images/fridge.avif',
    description: 'Spacious, reliable cold storage with adjustable shelves and a dedicated freezer.',
    price: 5499,
    stock: 5
  },
  {
    name: 'FreezeBox 200L Chest Freezer',
    category: 'Refrigeration',
    description: 'Efficient frozen storage for family kitchens, shops, and entertaining.',
    price: 3299,
    stock: 6
  },
  {
    name: 'SoundArc Wireless Speaker',
    category: 'Entertainment',
    description: 'Room-filling wireless sound with rich bass and a long-lasting battery.',
    price: 699,
    stock: 18
  },
  {
    name: 'CinemaBase 5.1 Home Theatre',
    category: 'Entertainment',
    description: 'Immersive surround sound for movie nights, music, and gaming.',
    price: 2499,
    stock: 4
  },
  {
    name: 'AirBreeze Standing Fan',
    category: 'Cooling',
    description: 'Adjustable oscillation and three speeds for comfortable everyday airflow.',
    price: 499,
    stock: 22
  },
  {
    name: 'CleanGlide Cordless Vacuum',
    category: 'Cleaning',
    description: 'Lightweight cordless cleaning with strong suction for floors and furniture.',
    price: 1299,
    stock: 9
  }
];

async function seedProducts() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing from the .env file.');
  }

  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} appliance products.`);
}

seedProducts()
  .catch(error => {
    console.error('Could not seed products:', error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());