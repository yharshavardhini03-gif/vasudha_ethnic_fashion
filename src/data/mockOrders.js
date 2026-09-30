export const MOCK_ORDERS = [
  {
    id: "VE-1024",
    customer: {
      name: "Aishwarya Sharma",
      email: "aishwarya.s@gmail.com",
      phone: "+91 98201 44521",
      address: "Flat 402, Royale Heights, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050"
    },
    items: [
      {
        id: "ve-01",
        name: "Royal Emerald Kanjivaram Silk Saree",
        price: 4999,
        quantity: 1,
        size: "Free Size",
        color: "Emerald Green",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80"
      },
      {
        id: "ve-06",
        name: "Chikankari Georgette Flared Kurti with Mukaish",
        price: 1899,
        quantity: 1,
        size: "M",
        color: "Ivory Gold",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80"
      }
    ],
    amount: 6898,
    status: "Delivered",
    paymentMethod: "UPI (Google Pay)",
    date: "2026-09-17",
    estimatedDelivery: "2026-09-20",
    trackingNumber: "DTDC-VE-984210"
  },
  {
    id: "VE-1025",
    customer: {
      name: "Priyanka Verma",
      email: "priyanka.v@outlook.com",
      phone: "+91 94150 88219",
      address: "Villa 12, Palm Meadows, Whitefield",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560066"
    },
    items: [
      {
        id: "ve-04",
        name: "Royal Heritage Hand-Embroidered Bridal Lehenga",
        price: 12999,
        quantity: 1,
        size: "M",
        color: "Imperial Ruby & Gold",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80"
      }
    ],
    amount: 12999,
    status: "Packed",
    paymentMethod: "Credit Card (HDFC)",
    date: "2026-09-18",
    estimatedDelivery: "2026-09-22",
    trackingNumber: "BLUEDART-VE-77412"
  },
  {
    id: "VE-1026",
    customer: {
      name: "Radhika Kulkarni",
      email: "radhika.k@yahoo.com",
      phone: "+91 97654 32100",
      address: "14, Gulmohar Avenue, Koregaon Park",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001"
    },
    items: [
      {
        id: "ve-02",
        name: "Zari Embroidered Chanderi Silk Anarkali Set",
        price: 3499,
        quantity: 1,
        size: "S",
        color: "Dusty Rose Beige",
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80"
      }
    ],
    amount: 3499,
    status: "Shipped",
    paymentMethod: "UPI (PhonePe)",
    date: "2026-09-18",
    estimatedDelivery: "2026-09-21",
    trackingNumber: "DELHIVERY-VE-54129"
  },
  {
    id: "VE-1027",
    customer: {
      name: "Sunita Reddy",
      email: "sunita.reddy@gmail.com",
      phone: "+91 99890 12345",
      address: "Plot 88, Jubilee Hills Road No. 36",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500033"
    },
    items: [
      {
        id: "ve-05",
        name: "Pastel Meadow Hand-Painted Organza Saree",
        price: 2899,
        quantity: 1,
        size: "Free Size",
        color: "Champagne Cream & Rose",
        image: "https://images.unsplash.com/photo-1610030469668-93510cb67655?auto=format&fit=crop&w=300&q=80"
      },
      {
        id: "ve-03",
        name: "Handcrafted Banarasi Brocade Kurti & Pant Set",
        price: 2199,
        quantity: 1,
        size: "L",
        color: "Deep Forest Pine",
        image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=300&q=80"
      }
    ],
    amount: 5098,
    status: "Confirmed",
    paymentMethod: "NetBanking (ICICI)",
    date: "2026-09-18",
    estimatedDelivery: "2026-09-23",
    trackingNumber: "PENDING"
  },
  {
    id: "VE-1028",
    customer: {
      name: "Meera Sen",
      email: "meera.sen@gmail.com",
      phone: "+91 98300 98765",
      address: "Flat 2B, Southern Avenue",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700029"
    },
    items: [
      {
        id: "ve-10",
        name: "Emerald Green Mirror Work Flared Lehenga",
        price: 6999,
        quantity: 1,
        size: "M",
        color: "Deep Forest Green",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80"
      }
    ],
    amount: 6999,
    status: "Pending",
    paymentMethod: "Cash on Delivery",
    date: "2026-09-18",
    estimatedDelivery: "2026-09-24",
    trackingNumber: "PENDING"
  }
];

export const MOCK_ANALYTICS = {
  totalRevenue: 284500,
  monthlyGrowth: "+18.4%",
  totalOrders: 142,
  orderGrowth: "+12.1%",
  totalCustomers: 118,
  averageOrderValue: 4850,
  salesByDay: [
    { day: "Mon", revenue: 28400, orders: 12 },
    { day: "Tue", revenue: 34100, orders: 16 },
    { day: "Wed", revenue: 42000, orders: 19 },
    { day: "Thu", revenue: 38900, orders: 17 },
    { day: "Fri", revenue: 51200, orders: 24 },
    { day: "Sat", revenue: 64500, orders: 31 },
    { day: "Sun", revenue: 58900, orders: 23 }
  ],
  categoryShare: [
    { category: "Sarees", percentage: 38, revenue: 108110 },
    { category: "Lehengas", percentage: 28, revenue: 79660 },
    { category: "Dresses & Anarkalis", percentage: 18, revenue: 51210 },
    { category: "Kurtis", percentage: 11, revenue: 31295 },
    { category: "Ethnic Sets", percentage: 5, revenue: 14225 }
  ],
  topProducts: [
    { name: "Royal Emerald Kanjivaram Silk Saree", sold: 48, revenue: 239952 },
    { name: "Royal Heritage Bridal Lehenga", sold: 19, revenue: 246981 },
    { name: "Zari Embroidered Chanderi Anarkali", sold: 36, revenue: 125964 },
    { name: "Pastel Meadow Organza Saree", sold: 52, revenue: 150748 }
  ]
};
