export type Product = {
	slug: string;
	model: string;
	name: string;
	shortName: string;
	description: string;
	image: string;
	gallery: { src: string; alt: string }[];
	category: string;
	material: string;
	features: string[];
	availability: string;
};

export const products: Product[] = [
	{
		slug: 'd4901', model: 'D4901', name: 'ตู้เสื้อผ้า 4 ฟุต 2 ประตู 2 ลิ้นชัก พร้อมกุญแจล็อก รุ่น D4901', shortName: 'ตู้เสื้อผ้า รุ่น D4901',
		description: 'ตู้เสื้อผ้า 4 ฟุต 2 ประตู พร้อม 2 ลิ้นชักและกุญแจล็อก รุ่น D4901 สำหรับร้านเฟอร์นิเจอร์ หอพัก อพาร์ตเมนต์ และโครงการที่ต้องการตู้เก็บเสื้อผ้าใช้งานคุ้มค่า', image: '/images/d4901-wardrobe-black-oak.png',
		gallery: [{ src: '/images/d4901-wardrobe-black-oak.png', alt: 'ตู้เสื้อผ้า 4 ฟุต 2 ประตู 2 ลิ้นชัก รุ่น D4901 สีเข้ม' }, { src: '/images/d4901-wardrobe-detail.png', alt: 'รายละเอียดลิ้นชักและพื้นที่เก็บของของตู้เสื้อผ้า รุ่น D4901' }],
		category: 'ตู้เสื้อผ้าและตู้เก็บของ', material: 'ไม้ปาร์ติเกิลและ MDF (สอบถามวัสดุและสีที่มีจำหน่าย)', features: ['ขนาด 4 ฟุต', '2 ประตู', '2 ลิ้นชัก', 'กุญแจล็อก', 'เหมาะสำหรับงานค้าส่งและโครงการ'], availability: 'https://schema.org/InStock',
	},
	{
		slug: 'b5012', model: 'B5012', name: 'เตียง 5 ฟุต ขาเหล็ก ข้างลอย รุ่น B5012', shortName: 'เตียง 5 ฟุต รุ่น B5012',
		description: 'เตียง 5 ฟุตขาเหล็กข้างลอย รุ่น B5012 โครงสร้างแข็งแรง สำหรับร้านเฟอร์นิเจอร์ หอพัก อพาร์ตเมนต์ และโครงการที่พัก', image: '/images/b5012-bed-detail.png',
		gallery: [{ src: '/images/b5012-bed-detail.png', alt: 'รายละเอียดเตียง 5 ฟุตขาเหล็กข้างลอย รุ่น B5012' }],
		category: 'เตียงและชุดห้องนอน', material: 'โครงเตียงเหล็กและวัสดุประกอบตามรุ่น (สอบถามรายละเอียดก่อนสั่งซื้อ)', features: ['ขนาด 5 ฟุต', 'ขาเหล็ก', 'ข้างลอย', 'โครงสร้างแข็งแรง', 'เหมาะสำหรับงานค้าส่งและโครงการ'], availability: 'https://schema.org/InStock',
	},
];
