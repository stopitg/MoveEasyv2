import React, { useState, useEffect } from 'react';
import type { Item, CreateItemRequest, UpdateItemRequest, Room } from '../types';

interface ItemFormProps {
  item?: Item | null;
  rooms: Room[];
  onSubmit: (data: CreateItemRequest | UpdateItemRequest) => void;
  onCancel: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ item, rooms, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    room_id: '',
    photo_url: '',
    estimated_value: '',
    condition: '',
    category: '',
    is_fragile: false,
    requires_special_handling: false
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description || '',
        room_id: item.room_id || '',
        photo_url: item.photo_url || '',
        estimated_value: item.estimated_value?.toString() || '',
        condition: item.condition || '',
        category: item.category || '',
        is_fragile: item.is_fragile,
        requires_special_handling: item.requires_special_handling
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const submitData: CreateItemRequest | UpdateItemRequest = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      room_id: formData.room_id || undefined,
      photo_url: formData.photo_url.trim() || undefined,
      estimated_value: formData.estimated_value ? parseFloat(formData.estimated_value) : undefined,
      condition: formData.condition || undefined,
      category: formData.category || undefined,
      is_fragile: formData.is_fragile,
      requires_special_handling: formData.requires_special_handling
    };

    onSubmit(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Item Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Coffee Table, Laptop, Winter Coat"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Optional description of the item"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="room_id" className="block text-sm font-medium text-gray-700 mb-1">
            Room
          </label>
          <select
            id="room_id"
            name="room_id"
            value={formData.room_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a room</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>{room.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            <option value="furniture">Furniture</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="kitchen">Kitchen</option>
            <option value="books">Books</option>
            <option value="decor">Decor</option>
            <option value="tools">Tools</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
            Condition
          </label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select condition</option>
            <option value="new">New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        <div>
          <label htmlFor="estimated_value" className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Value ($)
          </label>
          <input
            type="number"
            id="estimated_value"
            name="estimated_value"
            value={formData.estimated_value}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label htmlFor="photo_url" className="block text-sm font-medium text-gray-700 mb-1">
          Photo URL
        </label>
        <input
          type="url"
          id="photo_url"
          name="photo_url"
          value={formData.photo_url}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/photo.jpg"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_fragile"
            name="is_fragile"
            checked={formData.is_fragile}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is_fragile" className="ml-2 block text-sm text-gray-700">
            Fragile item
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="requires_special_handling"
            name="requires_special_handling"
            checked={formData.requires_special_handling}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="requires_special_handling" className="ml-2 block text-sm text-gray-700">
            Requires special handling
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {item ? 'Update Item' : 'Create Item'}
        </button>
      </div>
    </form>
  );
};

export default ItemForm;
