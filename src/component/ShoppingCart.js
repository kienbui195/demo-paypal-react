import { PayPalButtons } from '@paypal/react-paypal-js';
import React, { useEffect, useState } from 'react';
import Button from './Button';
import { createData, getData, updateData } from '../api';
import { calculateTotalAmount } from '../function';
import axios from 'axios';
import qs from 'qs';

let items = [];
let totalAmount = 0;

const ShoppingCart = ({ cart, onFinish }) => {
	const [loading, setLoading] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [transactionId, setTransactionId] = useState('');
	const [transactionInfo, setTransactionInfo] = useState({
		status: 'none',
		transactionId: '',
	});
	const [paypal, setPaypal] = useState(false);

	const handleCreateOrder = () => {
		const orderDetail = cart.map(item => {
			return {
				product: +item.id,
			};
		});

		setLoading(true);
		createData('/ecommerce/order', {
			user: 1,
			orderDetail: orderDetail,
			totalAmount: totalAmount,
			paymentMethod: 'Paypal',
		})
			.then(res => {
				createData('/ecommerce/transaction', {
					order: res.data.data.id,
					user: 1,
					amount: totalAmount,
					paymentChannel: 'Paypal',
				})
					.then(data => {
						setLoading(false);
						setDisabled(true);
						setTransactionId(data.data.data.id);
						setPaypal(true);
						// handlePay()
					})
					.catch(() => {
						setLoading(false);
					});
			})
			.catch(() => {
				setLoading(false);
			});
	};

	const createOrder = (data, actions) => {
		const purchase_units = [
			{
				amount: {
					currency_code: 'USD',
					value: `${totalAmount}`,
					breakdown: {
						item_total: {
							currency_code: 'USD',
							value: `${totalAmount}`,
						},
					},
				},
				items: items,
			},
		];

		return actions.order
			.create({
				purchase_units: purchase_units,
			})
			.then(res => {
				updateData(`/ecommerce/transaction/${transactionId}`, {
					payerName: res,
				});

				return res;
			});
	};

	const onApprove = (data, actions) => {
		return actions.order.capture().then(details => {
			setTransactionInfo({
				...transactionInfo,
				status: 'success',
				transactionId: details.id,
			});
		});
	};

	useEffect(() => {
		if (transactionInfo.status === 'success') {
			getData(
				`/ecommerce/transaction`,
				qs.stringify({
					filters: {
						payerName: transactionInfo.transactionId,
					},
				})
			).then(res => {
				console.log(res.data);

				updateData(`/ecommerce/transaction/${res.data.data[0].id}`, {
					status: 'Completed',
				}).then(data => {
					setTransactionInfo({
						status: 'none',
						transactionId: ''
					})
				})
			});
		}
	}, [transactionInfo]);

	useEffect(() => {
		if (cart.length === 0) {
			setDisabled(true);
		} else {
			setDisabled(false);
		}

		items = cart.map(item => {
			return {
				name: item.name,
				quantity: `${item.quantity}`,
				unit_amount: {
					currency_code: 'USD',
					value: `${item.price}`,
				},
			};
		});

		totalAmount = calculateTotalAmount(cart);
	}, [cart]);

	return (
		<div style={{ background: 'wheat', padding: '8px', width: '800px', height: '400px', display: 'flex', flexDirection: 'column' }}>
			<h5>Cart({cart.length})</h5>
			<div style={{ background: 'yellow' }}>
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Quantity</th>
							<th>Amount</th>
						</tr>
					</thead>
					<tbody>
						{cart &&
							cart.map((item, idx) => (
								<tr key={idx}>
									<td style={{ textAlign: 'center' }}>{item.id}</td>
									<td>{item.name}</td>
									<td>
										{item.price}x{item.quantity}
									</td>
									<td>{item.price * item.quantity}</td>
								</tr>
							))}
					</tbody>
				</table>
				<div style={{ textAlign: 'right' }}>Total: {calculateTotalAmount(cart)} USD</div>
			</div>
			<div>
				<Button label={'Create Order'} loading={loading} disabled={disabled} onClick={handleCreateOrder} />
				{paypal && (
					<PayPalButtons
						createOrder={createOrder}
						onApprove={onApprove}
						onError={err => {
							console.log(err);
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default ShoppingCart;
