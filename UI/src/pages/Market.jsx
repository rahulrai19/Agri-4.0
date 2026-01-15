import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Filter, Plus, X, Minus, Trash2, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const Market = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [showSellModal, setShowSellModal] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Tools', company: '', image: '', description: '' });
    const { user } = useAuth();

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchItems();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [category, searchTerm]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            let url = '/api/market';
            const params = [];
            if (category !== 'All') params.push(`category=${category}`);
            if (searchTerm) params.push(`search=${searchTerm}`);
            if (params.length > 0) url += `?${params.join('&')}`;

            const response = await axios.get(url);
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching market items:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (item) => {
        const existing = cart.find(i => i._id === item._id);
        if (existing) {
            setCart(cart.map(i =>
                i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
            ));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const updateQuantity = (itemId, delta) => {
        setCart(cart.map(item => {
            if (item._id === itemId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => item._id !== itemId));
    };

    const getCartTotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleCheckout = () => {
        setShowCart(false);
        setShowCheckout(true);
    };

    const handlePayment = () => {
        // Demo payment - instant success
        setTimeout(() => {
            setShowCheckout(false);
            setOrderSuccess(true);
            setCart([]);

            setTimeout(() => {
                setOrderSuccess(false);
            }, 3000);
        }, 1500);
    };

    const handleSellSubmit = async (e) => {
        e.preventDefault();
        try {
            const itemToPost = {
                ...newItem,
                price: Number(newItem.price),
                image: newItem.image || 'https://via.placeholder.com/150?text=No+Image'
            };
            await axios.post('/api/market', itemToPost);
            setShowSellModal(false);
            setNewItem({ name: '', price: '', category: 'Tools', company: '', image: '', description: '' });
            fetchItems();
            alert("Item listed successfully!");
        } catch (error) {
            alert("Failed to list item.");
            console.error(error);
        }
    };

    const categories = ['All', 'Pesticides', 'Fertilizers', 'Seeds', 'Machinery', 'Fruits'];

    return (
        <div className="pb-24 relative">
            {/* Search Header */}
            <div className="sticky top-0 bg-white z-10 pb-4 pt-2 shadow-sm">
                <div className="flex items-center gap-2 mb-4 px-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-green-500 bg-gray-50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowCart(true)}
                        className="p-3 rounded-full bg-blue-100 text-blue-600 relative"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                {cart.reduce((sum, item) => sum + item.quantity, 0)}
                            </span>
                        )}
                    </button>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${category === cat
                                ? 'bg-green-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="p-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 pb-20">
                        {items.map(item => (
                            <div key={item._id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300">
                                <div className="relative h-40 bg-gray-100">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
                                        }}
                                    />
                                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-green-700 shadow-sm">
                                        {item.category}
                                    </div>
                                </div>

                                <div className="p-4 flex flex-col flex-1">
                                    <div className="mb-2">
                                        <h3 className="font-bold text-gray-900 text-base line-clamp-1">{item.name}</h3>
                                        <p className="text-xs text-gray-500 font-medium">{item.company}</p>
                                    </div>

                                    <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400">Price</span>
                                            <span className="font-extrabold text-lg text-green-700">₹{item.price}</span>
                                        </div>
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="bg-green-600 active:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-green-200 shadow-lg hover:shadow-xl transition-all flex items-center gap-1"
                                        >
                                            <Plus className="w-4 h-4" /> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cart Drawer */}
            {showCart && (
                <div className="fixed inset-0 bg-black/50 z-50">
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</h2>
                            <button onClick={() => setShowCart(false)}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {cart.length === 0 ? (
                                <div className="text-center py-12">
                                    <ShoppingCart className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500">Your cart is empty</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item._id} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800">{item.name}</h3>
                                            <p className="text-sm text-gray-500">{item.company}</p>
                                            <p className="text-green-700 font-bold mt-1">₹{item.price}</p>

                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="flex items-center gap-2 bg-white border rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item._id, -1)}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="font-bold px-2">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item._id, 1)}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item._id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-6 pb-24 border-t space-y-4 bg-gray-50">
                                <div className="flex justify-between items-center text-xl font-bold">
                                    <span>Total:</span>
                                    <span className="text-green-700">₹{getCartTotal()}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-colors shadow-lg"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Checkout Modal */}
            {showCheckout && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in">
                        <h2 className="text-2xl font-bold mb-6">Checkout</h2>

                        <div className="space-y-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Items ({cart.reduce((sum, i) => sum + i.quantity, 0)})</span>
                                    <span className="font-bold">₹{getCartTotal()}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Delivery</span>
                                    <span className="text-green-600 font-bold">FREE</span>
                                </div>
                                <div className="border-t pt-2 mt-2 flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span className="text-green-700">₹{getCartTotal()}</span>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    💳 <strong>Demo Mode:</strong> This is a demo checkout. No actual payment will be processed.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCheckout(false)}
                                className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePayment}
                                className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700"
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Success */}
            {orderSuccess && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-8 text-center animate-fade-in">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
                        <p className="text-gray-600 mb-4">Your order has been successfully placed.</p>
                        <p className="text-sm text-gray-500">Order Total: ₹{getCartTotal()}</p>
                    </div>
                </div>
            )}

            {/* Sell Modal */}
            {showSellModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 relative my-8">
                        <button onClick={() => setShowSellModal(false)} className="absolute top-4 right-4">
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-bold mb-4">Sell Item</h2>

                        <form onSubmit={handleSellSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Item Name</label>
                                <input
                                    required
                                    className="w-full border rounded-lg p-2"
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price (₹)</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full border rounded-lg p-2"
                                        value={newItem.price}
                                        onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <select
                                        className="w-full border rounded-lg p-2"
                                        value={newItem.category}
                                        onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                    >
                                        {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Company/Brand</label>
                                <input
                                    className="w-full border rounded-lg p-2"
                                    value={newItem.company}
                                    onChange={e => setNewItem({ ...newItem, company: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    className="w-full border rounded-lg p-2"
                                    rows={2}
                                    value={newItem.description}
                                    onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Image URL</label>
                                <input
                                    required
                                    className="w-full border rounded-lg p-2"
                                    placeholder="https://..."
                                    value={newItem.image}
                                    onChange={e => setNewItem({ ...newItem, image: e.target.value })}
                                />
                            </div>
                            <button className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700">
                                List Item
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating Sell Button */}
            {user && (
                <button
                    onClick={() => setShowSellModal(true)}
                    className="fixed bottom-24 right-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 flex items-center justify-center z-10"
                >
                    <Plus className="w-6 h-6" />
                </button>
            )}
        </div>
    );
};
