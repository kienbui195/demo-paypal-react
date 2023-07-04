import React, { useState } from "react";

const TableRow = ({ item, onClick }) => {
	const [quantity, setQuantity] = useState(0);
	
	const handleAddToCart = (item, quantity) => {
		const data =  {
			name: item.attributes.name,
			description: item.attributes.description,
			id: item.id,
			price: item.attributes.productAttributes[0].priceSale,
			stock: item.attributes.productAttributes[0].quantity,
			quantity: quantity
		}
		onClick && onClick(data)
		setQuantity(0)
	}
  
  return (
    <tr>
			<td>{item.id}</td>
			<td>{item.attributes.name}</td>
			<td>{item.attributes.description}</td>
			<td>{item.attributes.productAttributes[0].price}</td>
			<td>{item.attributes.productAttributes[0].quantity}</td>
			<td>
				<div style={{ display: 'flex' }}>
					<input disabled value={quantity} style={{ width: '50%', textAlign: 'center' }} />
					<button
						disabled={(quantity + 1) > item.attributes.productAttributes[0].quantity}
						onClick={() => {
							setQuantity(quantity + 1);
						}}>
						+
					</button>
					<button
						disabled={quantity - 1 < 0}
						onClick={() => {
							if (quantity - 1 < 0) {
								setQuantity(0);
							} else {
								setQuantity(quantity - 1);
							}
						}}>
						-
					</button>
				</div>
			</td>
			<td>
				<button disabled={quantity === 0} onClick={() => handleAddToCart(item, quantity)}>Add to cart</button>
			</td>
		</tr>
  )
}

export default TableRow;