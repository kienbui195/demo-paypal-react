import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import TableRow from './component/TableRow';
import ShoppingCart from './component/ShoppingCart';
import { getData, updateData } from './api';

export const CLIENT_ID = 'AWtKCqjzEauO0WX7QMeQ9oRw_u7ZMA-HBucJEWgL_4P3As-sHD1z-8V8PL5-zxCvd7GEU3n9ac8OuKnz';
export const SECRET_KEY = 'EOPL8UcYylD0rdl8KMl287Fin0J9TzlPWF5_wrIU1qohtXIF6Yz1yEtSG70krwFUPHEKhIHXOOj-yuGC';

const App = () => {
	const [products, setProducts] = useState();
	const [cart, setCart] = useState([]);

	const getProducts = () => {
		getData('/products', 'populate=deep,2')
			.then(res => {
				setProducts(res.data.data);
			})
			.catch(() => {});
	};

	const handleAddToCart = item => {
		const idx = cart.findIndex(data => data.id === item.id);

		if (idx !== -1) {
			let updateCart = [...cart];
			updateCart[idx].quantity = updateCart[idx].quantity + item.quantity;
			setCart(updateCart);
		} else {
			setCart([...cart, item]);
		}
	};

	useEffect(() => {
		getProducts();
	}, []);

	return (
		<PayPalScriptProvider
			options={{
				'client-id': CLIENT_ID, //xac dinh tai khoan paypal thiet lap va hoan tat giao dich
				currency: 'USD', //don vi tien te, default la USD
				// buyerCountry: 'VN', //quoc gia cua nguoi mua, default dua theo dia chi IP
				// commit: true, //trang thai commit cua giao dich: true la giao dich hoan tat tren trang paypal review page => sau do xuat hien nut pay now (tong tien phai tra k thay doi khi ng mua quay ve tu trang paypal)
				//; false => sau do xuat hien nut continue, tong so tien co the thay doi khi nguoi mua quay tro ve tu trang paypal (tong so tien thay doi do thue, phi van chuyen, ...)
				components: 'buttons,hosted-fields', //cac thanh phan hien thi tren web
				// components: 'buttons,marks,messages,funding-eligibility,hosted-fields,applepay', //cac thanh phan hien thi tren web
				debug: false, //enable che do debug, default la false,
				// disableFunding: 'none', //The disabled funding sources for the transaction, value: card, credit, bancontact, none, ...
				// enableFunding: 'none', //tuong tu ben tren
				// integrationDate: 'automatic',
				intent: 'capture', //Điều này xác định xem tiền có được thu ngay lập tức khi người mua có mặt trên trang hay không
				locale: 'en_VN', //ngon ngu hien thi cac thanh phan,
				// merchantId: '<id>', //id cua nguoi ban ma ban dang ho tro giao dich,
				vault: true, //thong tin thanh toan trong giao dich co duoc luu hay khong
				// dataCspNonce: '<abc>', //chinh sach bao mat noi dung
				// dataClientToken: '<abc>', //Mã thông báo của khách hàng được sử dụng để xác định người mua của bạn.
				// dataPageType: '<abc>', //chọn một loại trang để ghi lại mọi tương tác với các thành phần bạn sử dụng và loại trang mà SDK JavaScript tải
				// dataPartnerAttributionId: '<abc>', //Chuyển ID phân bổ đối tác của bạn hoặc mã ký hiệu xây dựng (BN) để nhận phân bổ doanh thu
			}}>
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Title</th>
							<th>Description</th>
							<th>Price (USD)</th>
							<th>Stock</th>
							<th>Set quantity</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>{products && products.map((item, idx) => <TableRow key={item.id} item={item} onClick={item => handleAddToCart(item)} />)}</tbody>
				</table>
				<div style={{ marginTop: '20px' }}>
					<ShoppingCart cart={cart} onFinish={() => {
						setCart([])
					}} />
				</div>
			</div>
		</PayPalScriptProvider>
	);
};

export default App;
