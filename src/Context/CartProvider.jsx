import { useState, useEffect } from "react";
import { CartContext } from "./CartContext";

// usando uma função de inicialização onde vai dentro do navegador e busca @UrbanCandy:cart para ver se existe algo guardado
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const localData = localStorage.getItem('@UrbanCandy:cart');
        return localData ? JSON.parse(localData) : { items: [], total: 0 };
    });

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("@UrbanCandy:cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const index = prevCart.items.findIndex(i => i.id_product === product.id_product);
            let newItems = [...prevCart.items];

            if (index > -1) {
                newItems[index] = {
                    ...newItems[index],
                    quantity: newItems[index].quantity + 1,
                    sub_total: (newItems[index].quantity + 1) * Number(product.price)
                };
            } else {
                newItems.push({
                    id_product: product.id_product,
                    quantity: 1,
                    products: product,
                    sub_total: Number(product.price)
                });
            }

            const newTotal = newItems.reduce((acc, item) => acc + Number(item.sub_total), 0);
            return { items: newItems, total: Number(newTotal.toFixed(2)) };
        });
    };

    const removeItem = (idProduct) => {
        setCart((prevCart) => {
            const newItems = prevCart.items.filter(i => i.id_product !== idProduct);
            const newTotal = newItems.reduce((acc, item) => acc + Number(item.sub_total), 0);
            return { items: newItems, total: newTotal };
        });
    };

    const updateQuantity = (idProduct, newQuantity) => {
        setCart((prevCart) => {
            const newItems = prevCart.items.map((item) => {
                if (item.id_product === idProduct) {
                    const price = Number(item.products.price);
                    return {
                        ...item,
                        quantity: newQuantity,
                        sub_total: newQuantity * price
                    };
                }
                return item;
            });

            const newTotal = newItems.reduce((acc, item) => acc + Number(item.sub_total), 0);
            return { items: newItems, total: Number(newTotal.toFixed(2)) };
        });
    };

    const clearCart = () => {
        setCart({ items: [], total: 0 });
        localStorage.removeItem('@UrbanCandy:cart');
    };

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeItem, updateQuantity, isCartOpen, setIsCartOpen,
            isLoginModalOpen, setIsLoginModalOpen, clearCart
        }}>
            {children}
        </CartContext.Provider>
    );


};