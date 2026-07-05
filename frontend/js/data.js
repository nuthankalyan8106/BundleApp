// ── BUNDLE DATA ──
const BUNDLES = [
  { id:1, cat:'fashion', emoji:'👔', name:'Interview Ready Bundle', badge:'Fashion',
    desc:'Everything you need to nail your first impression at any job interview.',
    items:[
      {icon:'👕', name:'Formal Shirt',    brand:'Peter England', price:999},
      {icon:'👖', name:'Formal Trousers', brand:'Raymond',       price:1499},
      {icon:'👞', name:'Oxford Shoes',    brand:'Bata',          price:1799},
      {icon:'⌚', name:'Classic Watch',   brand:'Casio',         price:1299},
      {icon:'👔', name:'Leather Belt',    brand:'UCB',           price:699},
      {icon:'💼', name:'Laptop Bag',      brand:'Skybags',       price:999},
    ], price:5799, original:7294, save:'20%' },

  { id:2, cat:'home', emoji:'🍳', name:'Kitchen Starter Kit', badge:'Home Setup',
    desc:'A complete kitchen setup for anyone moving into a new home.',
    items:[
      {icon:'🍳', name:'Non-stick Frying Pan',   brand:'Prestige',   price:799},
      {icon:'🥘', name:'Pressure Cooker 3L',      brand:'Hawkins',    price:1099},
      {icon:'🔪', name:'Knife Set',               brand:'Victorinox', price:999},
      {icon:'🍽', name:'Dinner Set 6pcs',         brand:'Cello',      price:699},
      {icon:'🥄', name:'Steel Spoon Set',          brand:'Borosil',    price:349},
      {icon:'📦', name:'Storage Containers (5pc)', brand:'Tupperware', price:899},
    ], price:4299, original:5844, save:'26%' },

  { id:3, cat:'college', emoji:'🎓', name:'College Hostel Bundle', badge:'College',
    desc:'Everything a college fresher needs for a smooth hostel life.',
    items:[
      {icon:'💻', name:'Laptop',          brand:'Lenovo Ideapad', price:34999},
      {icon:'🎒', name:'Backpack',        brand:'Wildcraft',      price:1299},
      {icon:'📓', name:'Notebook Set',   brand:'Classmate',      price:199},
      {icon:'🔌', name:'Extension Board', brand:'Havells',        price:499},
      {icon:'☕', name:'Electric Kettle', brand:'Prestige',       price:799},
      {icon:'🔒', name:'Padlock',         brand:'Godrej',         price:249},
      {icon:'💡', name:'Study Lamp',      brand:'Philips',        price:649},
    ], price:38499, original:39693, save:'3%' },

  { id:4, cat:'work', emoji:'💻', name:'Work From Home Setup', badge:'Work',
    desc:'Build a productive, ergonomic home office without the guesswork.',
    items:[
      {icon:'🖥', name:'24" IPS Monitor',         brand:'LG',         price:12999},
      {icon:'⌨', name:'Mechanical Keyboard',      brand:'Logitech',   price:3499},
      {icon:'🖱', name:'Wireless Mouse',           brand:'Logitech',   price:1499},
      {icon:'🎧', name:'Noise-Cancel Headphones',  brand:'Sony',       price:5999},
      {icon:'📷', name:'HD Webcam',               brand:'Logitech',   price:2499},
      {icon:'💺', name:'Ergonomic Chair',          brand:'Green Soul', price:14999},
    ], price:39999, original:41494, save:'4%' },

  { id:5, cat:'gaming', emoji:'🎮', name:'Gaming Bundle', badge:'Gaming',
    desc:'Level up your setup with this complete PC gaming bundle.',
    items:[
      {icon:'🎮', name:'Gaming Mouse',      brand:'Razer DeathAdder', price:3499},
      {icon:'⌨', name:'RGB Gaming Keyboard', brand:'Corsair K70',    price:8999},
      {icon:'🎧', name:'Gaming Headset 7.1', brand:'HyperX',          price:4999},
      {icon:'🖱', name:'XXL Mouse Pad',      brand:'SteelSeries',     price:1999},
      {icon:'💺', name:'Gaming Chair',       brand:'Green Soul Beast', price:17999},
      {icon:'🖥', name:'27" 144Hz Monitor',  brand:'MSI',             price:22999},
    ], price:59999, original:60494, save:'1%' },

  { id:6, cat:'fitness', emoji:'🏋', name:'Home Workout Bundle', badge:'Fitness',
    desc:'Build a solid home gym without spending a fortune on equipment.',
    items:[
      {icon:'🏋', name:'Dumbbell Set 10kg',  brand:'Kore',             price:1299},
      {icon:'🧘', name:'Yoga Mat 6mm',       brand:'Boldfit',          price:499},
      {icon:'💪', name:'Resistance Bands',   brand:'Boldfit',          price:399},
      {icon:'💧', name:'Shaker Bottle',      brand:'Optimum Nutrition', price:299},
      {icon:'🧤', name:'Gym Gloves',         brand:'Nivia',            price:349},
      {icon:'🎧', name:'Wireless Earbuds',   brand:'boAt',             price:1299},
    ], price:3799, original:4134, save:'8%' },

  { id:7, cat:'travel', emoji:'✈', name:'Weekend Trip Bundle', badge:'Travel',
    desc:'Everything you need for a 2-3 day getaway, packed and ready.',
    items:[
      {icon:'🎒', name:'Cabin Backpack 40L',    brand:'American Tourister', price:2499},
      {icon:'🪥', name:'Toiletry Kit',          brand:'Lavie',              price:599},
      {icon:'🔋', name:'20000mAh Power Bank',   brand:'Mi',                 price:1299},
      {icon:'😴', name:'Neck Pillow',           brand:'Cabeau',             price:799},
      {icon:'💧', name:'Insulated Water Bottle', brand:'Hydracy',           price:499},
    ], price:5299, original:5695, save:'7%' },

  { id:8, cat:'baby', emoji:'👶', name:'Newborn Essentials Bundle', badge:'Baby',
    desc:'A thoughtfully curated starter kit for new parents.',
    items:[
      {icon:'🍼', name:'Baby Feeding Bottles',  brand:"Dr. Brown's", price:999},
      {icon:'🧻', name:'Baby Wipes 3 packs',   brand:'Pampers',     price:499},
      {icon:'🧴', name:'Baby Wash & Lotion',   brand:'Dove Baby',   price:599},
      {icon:'🧸', name:'Soft Toys Set',        brand:'Fisher-Price', price:899},
      {icon:'🛌', name:'Muslin Swaddle Blankets', brand:'MamaEarth', price:699},
    ], price:3399, original:3695, save:'8%' },

  { id:9, cat:'wedding', emoji:'💍', name:'Groom Bundle', badge:'Wedding',
    desc:'Look sharp on the most important day of your life.',
    items:[
      {icon:'🤵', name:'Sherwani/Suit',  brand:'Manyavar',        price:14999},
      {icon:'👞', name:'Formal Shoes',   brand:'Woodland',        price:3499},
      {icon:'⌚', name:'Premium Watch',  brand:'Titan',           price:8999},
      {icon:'💆', name:'Grooming Kit',  brand:'The Man Company', price:1499},
      {icon:'🌸', name:'Perfume',       brand:'Fogg',            price:799},
    ], price:27999, original:29795, save:'6%' },

  { id:10, cat:'pet', emoji:'🐶', name:'Dog Starter Bundle', badge:'Pet',
    desc:'Everything your new furry friend needs to feel right at home.',
    items:[
      {icon:'🦴', name:'Dog Food 5kg',        brand:'Pedigree',          price:999},
      {icon:'🛌', name:'Orthopedic Dog Bed',  brand:'Heads Up For Tails', price:1499},
      {icon:'🥣', name:'Steel Food & Water Bowl', brand:'Ferplast',      price:499},
      {icon:'🐾', name:'Leash & Collar Set',  brand:'Paw Paw',           price:599},
      {icon:'🎾', name:'Chew Toys Set',       brand:'Kong',              price:699},
    ], price:3999, original:4295, save:'7%' },

  { id:11, cat:'gift', emoji:'🎁', name:'Gift Bundle for Him', badge:'Gifts',
    desc:'A curated gift set for the man who has it all.',
    items:[
      {icon:'⌚', name:'Smart Watch',     brand:'Noise',       price:3499},
      {icon:'🌸', name:'Premium Perfume', brand:'Park Avenue', price:899},
      {icon:'💆', name:'Grooming Kit',   brand:'Beardo',      price:1299},
      {icon:'☕', name:'Coffee Mug Set', brand:'Borosil',     price:599},
      {icon:'🎧', name:'Wireless Earbuds', brand:'boAt',      price:1299},
    ], price:6799, original:7595, save:'10%' },

  { id:12, cat:'fashion', emoji:'🌧', name:'Monsoon Collection Bundle', badge:'Fashion',
    desc:'Stay dry and stylish through the rains with this seasonal pack.',
    items:[
      {icon:'🌂', name:'Compact Umbrella',    brand:'Stormfit',  price:499},
      {icon:'🩴', name:'Waterproof Slippers', brand:'Crocs',     price:1499},
      {icon:'🧥', name:'Raincoat',            brand:'Wildcraft', price:1999},
      {icon:'🎒', name:'Waterproof Bag Cover', brand:'Quechua', price:399},
    ], price:3999, original:4396, save:'9%' },
];

const CREATOR_BUNDLES = [
  { id:101, cat:'work', emoji:'🖥', name:'Minimal Office Under ₹50,000', badge:'By @designwithrahul',
    desc:'A clean, distraction-free home office for deep work.',
    items:[
      {icon:'🖥', name:'Ultrawide Monitor', brand:'LG',         price:22999},
      {icon:'⌨', name:'Keychron K2',       brand:'Keychron',   price:6999},
      {icon:'💺', name:'Chair',             brand:'Featherlite', price:12999},
      {icon:'🖱', name:'Trackpad',          brand:'Apple',      price:7499},
    ], price:49999, original:51496, save:'3%' },

  { id:102, cat:'travel', emoji:'🌍', name:'Best Europe Travel Kit', badge:'By @travelmeetspriya',
    desc:'Curated by someone who did 12 countries in 30 days.',
    items:[
      {icon:'🧳', name:'Hardcase Luggage 26"', brand:'Samsonite', price:9999},
      {icon:'🔌', name:'Universal Adapter',    brand:'Skross',    price:1499},
      {icon:'💼', name:'Anti-theft Backpack',  brand:'Pacsafe',   price:4999},
      {icon:'📋', name:'Travel Wallet',        brand:'Bellroy',   price:2999},
    ], price:18999, original:19496, save:'3%' },

  { id:103, cat:'fitness', emoji:'💪', name:'Complete Gym Bag Kit ₹8k', badge:'By @fitnessbro_sid',
    desc:'Everything a serious gym-goer needs in one bag.',
    items:[
      {icon:'👟', name:'Training Shoes', brand:'Puma',      price:3499},
      {icon:'🧤', name:'Gym Gloves',    brand:'Nivia',     price:349},
      {icon:'🧴', name:'Protein Shaker', brand:'GNC',      price:499},
      {icon:'🎒', name:'Gym Duffel Bag', brand:'Nike',     price:2999},
      {icon:'🏃', name:'Gym Towel',     brand:'Decathlon', price:399},
    ], price:7299, original:7745, save:'6%' },
];
