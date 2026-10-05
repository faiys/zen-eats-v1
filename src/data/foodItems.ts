export interface FoodItem {
  id: string;
  name: string;
  category: string;
  categoryId?: string;
  isVeg?: boolean;
  rating: number;
  reviewCount: number;
  prepTime: string;
  tag: string;
  tagType: 'healthy' | 'grilled' | 'baked' | 'popular' | 'spicy';
  description: string;
  fullDescription: string;
  price: number;
  originalPrice: number;
  discount: string;
  images: string[];
  calories: string;
  portion: string;
  addOns: { id: string; name: string; extraPrice: number }[];
  popularTags: string[];
}

import samosaImg from '../assets/images/food_crispy_samosa_1790948500689.jpg';
import paneerPuffImg from '../assets/images/food_paneer_puff_1790948514885.jpg';
import burgerImg from '../assets/images/food_chicken_burger_1790948526738.jpg';
import pizzaImg from '../assets/images/food_mushroom_pizza_1790948569502.jpg';
import riceImg from '../assets/images/food_vegetable_rice_1790948583104.jpg';
import croissantImg from '../assets/images/food_croissant_sandwich_1790948597109.jpg';
import sweetImg from '../assets/images/food_sweet_treat_1790948609548.jpg';
import drinkImg from '../assets/images/food_mango_cooler_1790948660453.jpg';

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: 'samosa-plate',
    name: 'Crispy Samosa Platter',
    category: 'Snacks',
    isVeg: true,
    rating: 4.8,
    reviewCount: 165,
    prepTime: '10-15 mins',
    tag: 'Popular',
    tagType: 'popular',
    description: 'Crispy golden triangular pastry stuffed with spiced potatoes, crushed peas, and toasted coriander.',
    fullDescription: 'Two hot, freshly fried artisan samosas with flaky, hand-rolled pastry. Stuffed with tempered cumin potatoes, green peas, roasted cashews, and traditional garam masala. Accompanied by sweet saunth tamarind sauce and zesty mint coriander dip.',
    price: 30,
    originalPrice: 40,
    discount: '25% Off',
    images: [
      samosaImg,
      paneerPuffImg,
      samosaImg
    ],
    calories: '280 kcal',
    portion: '2 pcs + Mint & Tamarind Chutneys',
    addOns: [
      { id: 'extra-chutney', name: 'Extra Mint & Tamarind Chutney', extraPrice: 0 },
      { id: 'fried-chillies', name: 'Salted Fried Green Chillies', extraPrice: 0 },
      { id: 'masala-chai', name: 'Piping Hot Cutting Chai cup', extraPrice: 15 }
    ],
    popularTags: ['Crispy', 'Indian Street Food', 'Golden Crust', 'Potato Masala']
  },
  {
    id: 'paneer-puff',
    name: 'Spiced Paneer Tikka Puff',
    category: 'Bakery',
    isVeg: true,
    rating: 4.7,
    reviewCount: 142,
    prepTime: '10-15 mins',
    tag: 'Baked',
    tagType: 'baked',
    description: 'Flaky thousand-layer butter puff pastry packed with marinated cottage cheese tikka and bell peppers.',
    fullDescription: 'Freshly baked golden pastry shell made with fine French layering technique. The interior features succulent tandoori paneer cubes tossed in roasted cumin, kasuri methi, and slow-cooked onions with rich tomato reduction.',
    price: 45,
    originalPrice: 55,
    discount: '18% Off',
    images: [
      paneerPuffImg,
      croissantImg,
      paneerPuffImg
    ],
    calories: '320 kcal',
    portion: '1 large gourmet puff + house dip',
    addOns: [
      { id: 'spicy-mayo', name: 'Chipotle Garlic Dip', extraPrice: 0 },
      { id: 'warm-bake', name: 'Double Toasted & Crisped', extraPrice: 0 },
      { id: 'tissue-pack', name: 'Eco Paper Napkin & Fork', extraPrice: 0 }
    ],
    popularTags: ['Puff Pastry', 'Tandoori Paneer', 'Freshly Baked', 'Snack Treat']
  },
  {
    id: 'chicken-burger',
    name: 'Crispy Chicken Brioche Burger',
    category: 'Sandwiches',
    isVeg: false,
    rating: 4.9,
    reviewCount: 210,
    prepTime: '15-20 mins',
    tag: 'Grilled',
    tagType: 'grilled',
    description: 'Crispy fried spiced chicken fillet, melted cheddar cheese, fresh iceberg lettuce, and smoked paprika mayo.',
    fullDescription: 'Tender chicken breast coated in a buttermilk herb batter, fried to golden perfection. Nestled between toasted buttery brioche buns, melted aged cheddar, crisp farm-fresh lettuce, ripe tomato rounds, and creamy house dressing.',
    price: 75,
    originalPrice: 95,
    discount: '20% Off',
    images: [
      burgerImg,
      croissantImg,
      burgerImg
    ],
    calories: '490 kcal',
    portion: '1 full burger + crinkle fries portion',
    addOns: [
      { id: 'extra-cheese', name: 'Extra Melted Cheddar Slice', extraPrice: 20 },
      { id: 'caramelized-onions', name: 'Sweet Caramelized Onion Jam', extraPrice: 10 },
      { id: 'jalapeno', name: 'Pickled Jalapeño Slices', extraPrice: 0 }
    ],
    popularTags: ['Gourmet Burger', 'Brioche', 'Crispy Fillet', 'Friday Indulgence']
  },
  {
    id: 'mushroom-pizza',
    name: 'Artisan Mushroom Truffle Pizza',
    category: 'Pizza',
    isVeg: true,
    rating: 4.6,
    reviewCount: 128,
    prepTime: '15-20 mins',
    tag: 'Baked',
    tagType: 'baked',
    description: 'Stone-baked thin crust pizza topped with button & cremini mushrooms, mozzarella, and herb drizzle.',
    fullDescription: 'Hand-stretched sourdough crust fired on authentic baking stone. Layered with rich San Marzano tomato sauce, generous fresh mozzarella cheese, sautéed garlic button mushrooms, and finished with a fragrant oregano thyme glaze.',
    price: 80,
    originalPrice: 100,
    discount: '20% Off',
    images: [
      pizzaImg,
      paneerPuffImg,
      pizzaImg
    ],
    calories: '420 kcal',
    portion: 'Personal 8-inch pizza (4 slices)',
    addOns: [
      { id: 'chilli-flakes', name: 'Extra Crushed Red Pepper & Oregano', extraPrice: 0 },
      { id: 'garlic-butter-crust', name: 'Garlic Butter Brushed Crust', extraPrice: 10 },
      { id: 'extra-cheese', name: 'Extra Mozzarella Layer', extraPrice: 20 }
    ],
    popularTags: ['Thin Crust', 'Stone Baked', 'Wild Mushroom', 'Italian Herb']
  },
  {
    id: 'chicken-croissant',
    name: 'Buttery Chicken Croissant',
    category: 'Sandwiches',
    isVeg: false,
    rating: 4.8,
    reviewCount: 94,
    prepTime: '10-15 mins',
    tag: 'Healthy',
    tagType: 'healthy',
    description: 'Golden honeycomb croissant filled with tender roasted chicken, crisp garden greens, and honey mustard.',
    fullDescription: 'Authentic pure butter croissant with golden crisp exterior and feather-light honeycomb interior. Filled with herb-marinated grilled chicken breast slices, arugula, crunchy romaine lettuce, and honey Dijon mustard dressing.',
    price: 65,
    originalPrice: 85,
    discount: '24% Off',
    images: [
      croissantImg,
      burgerImg,
      croissantImg
    ],
    calories: '380 kcal',
    portion: '1 jumbo stuffed croissant + micro-salad',
    addOns: [
      { id: 'honey-mustard', name: 'Extra Honey Dijon Mustard', extraPrice: 0 },
      { id: 'melted-brie', name: 'Melted French Brie Cheese', extraPrice: 20 },
      { id: 'cold-press-juice', name: 'Orange Valencia Juice bottle', extraPrice: 35 }
    ],
    popularTags: ['French Butter', 'Honeycomb Croissant', 'Lean Protein', 'Cafe Special']
  },
  {
    id: 'vegetable-rice',
    name: 'Wok Fried Vegetable Rice Bowl',
    category: 'Rice & Bowls',
    isVeg: true,
    rating: 4.5,
    reviewCount: 110,
    prepTime: '10-15 mins',
    tag: 'Healthy',
    tagType: 'healthy',
    description: 'Fragrant jasmine rice tossed in high wok flame with tender carrots, green peas, scallions, and light soya.',
    fullDescription: 'Wholesome Asian-style wok tossed long grain rice prepared with ginger garlic oil, crunchy sweet corn, snap peas, diced bell peppers, and scallions. Lightly seasoned with sesame oil and naturally brewed low-sodium soy sauce.',
    price: 50,
    originalPrice: 65,
    discount: '23% Off',
    images: [
      riceImg,
      samosaImg,
      riceImg
    ],
    calories: '310 kcal',
    portion: 'Generous 350g bowl + chili vinegar dip',
    addOns: [
      { id: 'schezwan-sauce', name: 'Hot Fiery Schezwan Dip', extraPrice: 0 },
      { id: 'spring-onions', name: 'Extra Roasted Scallions', extraPrice: 0 },
      { id: 'paneer-skewers', name: '2 Charred Paneer Skewers', extraPrice: 25 }
    ],
    popularTags: ['Wok Tossed', 'Gluten Free Option', 'Fresh Veggies', 'Filling Meal']
  },
  {
    id: 'gulab-jamun',
    name: 'Warm Shahi Gulab Jamun',
    category: 'Sweets',
    isVeg: true,
    rating: 4.9,
    reviewCount: 280,
    prepTime: '5-10 mins',
    tag: 'Popular',
    tagType: 'popular',
    description: 'Soft melt-in-mouth milk dumplings soaked in green cardamom rose sugar syrup, topped with pistachios.',
    fullDescription: 'Hand-rolled milk solid dumplings slow-fried in pure cow ghee to a deep mahogany hue. Steeped in fragrant Persian rosewater and crushed green cardamom syrup, topped with slivered Iranian pistachios and edible silver vark.',
    price: 35,
    originalPrice: 45,
    discount: '22% Off',
    images: [
      sweetImg,
      paneerPuffImg,
      sweetImg
    ],
    calories: '290 kcal',
    portion: '2 large warm dumplings + rabdi drizzle',
    addOns: [
      { id: 'rabdi-shot', name: 'Thick Shahi Rabdi Drizzle', extraPrice: 15 },
      { id: 'silver-vark', name: 'Extra Roasted Pistachios', extraPrice: 0 },
      { id: 'served-warm', name: 'Delivered Steaming Warm', extraPrice: 0 }
    ],
    popularTags: ['Pure Ghee', 'Cardamom Rose', 'Melt in Mouth', 'Festive Sweet']
  },
  {
    id: 'mango-mint-cooler',
    name: 'Alphonso Mango Mint Cooler',
    category: 'Drinks',
    isVeg: true,
    rating: 4.7,
    reviewCount: 95,
    prepTime: '5 mins',
    tag: 'Healthy',
    tagType: 'healthy',
    description: 'Refreshing chilled crushed Alphonso mango puree with hand-torn garden mint, lemon spritz, and chia seeds.',
    fullDescription: 'Prepared using 100% natural Alphonso mango pulp, fresh lime juice, crushed ice, organic rock salt, and muddled fresh spear-mint leaves. Infused with hydrated chia seeds for a revitalizing afternoon energy boost.',
    price: 35,
    originalPrice: 45,
    discount: '22% Off',
    images: [
      drinkImg,
      sweetImg,
      drinkImg
    ],
    calories: '140 kcal',
    portion: '350ml chilled bottle with paper straw',
    addOns: [
      { id: 'chia-seeds', name: 'Extra Soaked Chia Seeds', extraPrice: 0 },
      { id: 'ice-level', name: 'Low Ice / Room Temp', extraPrice: 0 },
      { id: 'less-sweet', name: 'No Added Sugar', extraPrice: 0 }
    ],
    popularTags: ['Cold Pressed', 'Real Fruit', 'Digestive Mint', 'Refreshing']
  }
];

export const CATEGORIES = [
  'All',
  'Snacks',
  'Bakery',
  'Sandwiches',
  'Pizza',
  'Sweets',
  'Rice & Bowls',
  'Drinks'
] as const;
