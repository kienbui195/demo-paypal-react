export const getArrayId = (arr) => {
  return arr.map((item) => (
    item.id
  ))
}

export const calculateTotalAmount = (cart) => {
  let totalAmount = 0;

  cart.forEach((item) => {
    const price = item.price;
    const quantity = item.quantity;

    const itemTotal = price * quantity;
    totalAmount += itemTotal;
  });

  return totalAmount;
};