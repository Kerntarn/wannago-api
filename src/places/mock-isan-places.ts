import { Types } from 'mongoose';

export const mockIsanPlaces: any[] = [
  {
    _id: new Types.ObjectId('65275a5e3620e67160ad3701'),
    name: 'อุทยานแห่งชาติเขาใหญ่',
    imageUrl:
      'https://www.khaoyainationalpark.com/application/files/7316/3297/6568/DSC06823.JPG',
    location: [14.3109229, 101.5278612],
    description:
      'อุทยานแห่งชาติแห่งแรกของประเทศไทย, ครอบคลุมพื้นที่ 4 จังหวัด.',
    providerId: new Types.ObjectId('65275a5e3620e67160ad3001'),
    tags: ['national park', 'nature', 'adventure'],
    type: 'attraction',
    entryFee: 400, // Example entry fee for foreigners
  },
  {
    _id: new Types.ObjectId('65275a5e3620e67160ad3702'),
    name: 'ปราสาทหินพิมาย',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/%E0%B8%9B%E0%B8%A3%E0%B8%B2%E0%B8%AA%E0%B8%B2%E0%B8%97%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%A7%E0%B8%B1%E0%B8%95%E0%B8%B4%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C%E0%B8%9E%E0%B8%B4%E0%B8%A1%E0%B8%B2%E0%B8%A2.jpg/1200px-%E0%B8%9B%E0%B8%A3%E0%B8%B2%E0%B8%AA%E0%B8%B2%E0%B8%97%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%A7%E0%B8%B1%E0%B8%95%E0%B8%B4%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C%E0%B8%9E%E0%B8%B4%E0%B8%A1%E0%B8%B2%E0%B8%A2.jpg',
    location: [15.2200177, 102.4915711],
    description: 'ปราสาทหินทรายสีขาวที่ใหญ่และงดงามที่สุดแห่งหนึ่งในประเทศไทย',
    providerId: new Types.ObjectId('65275a5e3620e67160ad3001'),
    tags: ['historical', 'temple', 'culture'],
    type: 'attraction',
    entryFee: 100, // Example entry fee
  },
  {
    _id: new Types.ObjectId('65275a5e3620e67160ad3703'),
    name: 'สามพันโบก',
    imageUrl:
      'https://static.thairath.co.th/media/dFQROr7oWzulq5Fa5BYc3jnpBoy3UXU1dBSwHxeAWVb998QTHu47PX1UMCt7h916fnZ.jpg',
    location: [15.7938566, 105.3909063],
    description: 'แก่งหินขนาดใหญ่ในลำน้ำโขง ที่ถูกกระแสน้ำกัดเซาะจนเกิดเป็นโบก',
    providerId: new Types.ObjectId('65275a5e3620e67160ad3001'),
    tags: ['nature', 'unseen', 'river'],
    type: 'attraction',
    entryFee: 0,
  },
  {
    _id: new Types.ObjectId('65275a5e3620e67160ad3704'),
    name: 'ครัวสามพันโบก',
    imageUrl:
      'https://www.chillpainai.com/src/wewakeup/scoop/img_scoop/scoop/kat/00NEW/Ubonratchatani/Eat/Krua%20Sampanbok/IMG_2042.jpg',
    location: [15.7937803, 105.3962125],
    description: 'ร้านอาหารไทยอีสานรสชาติต้นตำรับ',
    providerId: new Types.ObjectId('65275a5e3620e67160ad3001'),
    tags: ['food', 'local food', 'restaurant'],
    type: 'restaurant',
    openingHours: "10:00:00",
    closingHours: "20:00:00",
    cuisineType: "Isan",
    contactInfo: "045-123-4567",
  },
  {
    _id: new Types.ObjectId('65275a5e3620e67160ad3705'),
    name: 'โรงแรมเดอะ เฮอริเทจ โคราช',
    imageUrl:
      'https://pix10.agoda.net/hotelImages/48948/0/a2dfea6d75c7d0b2e5f3d4dddac9c6f1.jpeg?s=414x232',
    location: [14.9660307, 102.1139477],
    description: 'โรงแรมหรูใจกลางเมืองโคราช',
    providerId: new Types.ObjectId('65275a5e3620e67160ad3001'),
    tags: ['hotel', 'luxury', 'accommodation'],
    type: 'accommodation',
    facilities: ["pool", "wifi", "restaurant", "gym"],
    starRating: 4,
    redirectUrl: "https://www.theheritagekorat.com/",
  },
  {
    _id: new Types.ObjectId('65275a5e3620e67160ad3706'),
    name: 'เป็นลาว',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6S4UgSoNSEq9cNUXc3Sy6c0m2vT6ensPlmA&s',
    location: [14.5140938, 101.3713913],
    description: 'ร้านอาหารอีสานฟิวชั่นชื่อดังใกล้เขาใหญ่',
    providerId: new Types.ObjectId('65275a5e3620e67160ad3001'),
    tags: ['food', 'local food', 'restaurant'],
    type: 'restaurant',
    openingHours: "11:00:00",
    closingHours: "22:00:00",
    cuisineType: "Isan Fusion",
    contactInfo: "081-987-6543",
  },
  {
    _id: new Types.ObjectId('65275a5e3620e67160ad3707'),
    name: 'โรงแรม เดอะ เปียโน รีสอร์ท เขาใหญ่',
    imageUrl:
      'https://content.r9cdn.net/rimg/himg/a0/da/fc/expedia_group-656808-235746883-742380.jpg?width=1200&height=630&crop=true',
    location: [14.5966113, 101.3688952],
    description: 'รีสอร์ทสวยท่ามกลางธรรมชาติของเขาใหญ่',
    providerId: new Types.ObjectId('65275a5e3620e67160ad3001'),
    tags: ['hotel', 'resort', 'nature', 'accommodation'],
    type: 'accommodation',
    facilities: ["pool", "garden", "wifi"],
    starRating: 3,
    redirectUrl: "https://www.thepianoresort.com/",
  },
];
