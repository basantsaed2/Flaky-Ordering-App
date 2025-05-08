import React, { useEffect, useMemo, useState } from "react";
import Cart from "./Cart";
import { useDispatch, useSelector } from "react-redux";
import {
  removeProductsCard,
  setTotalPrice,
  UpdateOrder,
} from "../../../Store/CreateSlices";

const Carts = () => {
  const items = useSelector((state) => state?.productsCard?.data || []);
  const taxType = useSelector((state) => state?.taxType?.data || "");
  const order = useSelector((state) => state?.order?.data || {});
  const dispatch = useDispatch();

  const [totalFoodPrice, setTotalFoodPrice] = useState(0);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);

  const handleDelete = (productId) => {
    dispatch(removeProductsCard(productId));
  };

  // Total calculations
  useEffect(() => {
    if (!items.length) {
      setTotalFoodPrice(0);
      setTax(0);
      setDiscount(0);
      return;
    }

    const calculateTotalPriceAddons = (addons, key = "price") =>
      addons.reduce(
        (total, addon) => total + (addon?.[key] || 0) * addon.count,
        0
      );

    const total = items.reduce(
      (acc, item) => acc + (Number(item.passProductPrice) * item.count || 0),
      0
    );

    const calculatedTax = items.reduce((acc, item) => {
      const prices = item.passProductPrice;
      if (item.tax?.type === "precentage") {
        return acc + prices * (item.tax.amount / 100) * item.count;
      } else if (item.tax?.type === "value") {
        return acc + (Number(item.tax.amount) * item.count || 0);
      }
      return acc;
    }, 0);

    const calculatedDiscount = items.reduce((acc, item) => {
      const priceWithoutAddons =
        item.passProductPrice - calculateTotalPriceAddons(item.addons || []);
      if (item.discount?.type === "precentage") {
        return (
          acc + priceWithoutAddons * (item.discount.amount / 100) * item.count
        );
      } else if (item.discount?.type === "value") {
        return acc + (Number(item.discount.amount) * item.count || 0);
      }
      return acc;
    }, 0);

    setTotalFoodPrice(total);
    setTax(Math.round(calculatedTax * 100) / 100);
    setDiscount(calculatedDiscount);
  }, [items]);

  // useMemo for calculateTotal
  const calculateTotal = useMemo(() => {
    const baseTotal = totalFoodPrice;
    return taxType === "excluded"
      ? baseTotal + tax - discount
      : baseTotal - discount;
  }, [totalFoodPrice, tax, discount, taxType]);

  // Update amount, tax, discount in order
  useEffect(() => {
    dispatch(
      UpdateOrder({
        ...order,
        amount: calculateTotal,
        total_tax: tax,
        total_discount: discount,
      })
    );
    dispatch(setTotalPrice(calculateTotal));
  }, [calculateTotal, dispatch, tax, discount]);

  // ✅ Add this effect to update full product list with notes, addons, etc.
  useEffect(() => {
    dispatch(UpdateOrder({
      ...order,
      products: items.map(product => ({
        product_id: product.productId,
        note: product.note,
        count: product.count,
        addons: (product?.addons || []).map(addon => ({
          addon_id: addon.id,
          count: addon.count,
        })),
        variation: (product.variations || []).map(variation => ({
          variation_id: variation.variation_id,
          option_id: (product?.options || [])
            .filter(option => option.variation_id === variation.variation_id)
            .map(option => option.id),
        })),
        extra_id: [
          ...(product?.extraProduct || []).map(ex => ex.id),
          ...(product?.extraOptions || []).map(ex => ex.id),
        ],
        exclude_id: product?.excludes,
      }))
    }));
  }, [items]); // reruns when cart changes

  return (
    <div className="w-full flex flex-col items-center justify-center gap-y-7">
      {items.length > 0 ? (
        items.map((item, index) => (
          <Cart
            key={item.numberId}
            id={item.id}
            suppId={item.numberId}
            image={item.image || "/assets/Images/RedLogo.png"}
            name={item.name}
            description={item.description}
            note={item.note}
            productPriceBase={item.passPrice}
            productPrice={item.total}
            passProductPrice={item.passProductPrice}
            discount={item.discount}
            tax={item.tax}
            addons={item.addons}
            options={item.options}
            taxType={taxType}
            onDelete={() => handleDelete(item.numberId)}
          />
        ))
      ) : (
        <span className="text-mainColor text-2xl font-TextFontMedium">
          Your cart is empty
        </span>
      )}

      <div className="w-full flex flex-col items-start justify-start gap-3">
        <span className="w-full text-3xl font-TextFontMedium text-mainColor">
          Total Food: {totalFoodPrice.toFixed(2)} EGP
        </span>

        {taxType === "excluded" && (
          <span className="w-full text-3xl font-TextFontMedium text-mainColor">
            Tax: {tax.toFixed(2)} EGP
          </span>
        )}

        <span className="w-full text-3xl font-TextFontMedium text-mainColor">
          Discount: {discount.toFixed(2)} EGP
        </span>

        <div className="w-full py-3 border-t-2 border-mainColor">
          <span className="w-full text-4xl font-TextFontSemiBold text-mainColor">
            Total: {calculateTotal.toFixed(2)} EGP
          </span>
        </div>
      </div>
    </div>
  );
};

export default Carts;
