import React, { useState, useEffect } from 'react';
import type { Box, CreateBoxRequest, UpdateBoxRequest, Room } from '../types';

interface BoxFormProps {
  box?: Box | null;
  rooms: Room[];
  onSubmit: (data: CreateBoxRequest | UpdateBoxRequest) => void;
  onCancel: () => void;
}

const BoxForm: React.FC<BoxFormProps> = ({ box, rooms, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    label: '',
    destination_room_id: '',
    box_type: 'standard',
    notes: ''
  });

  useEffect(() => {
    if (box) {
      setFormData({
        label: box.label,
        destination_room_id: box.destination_room_id || '',
        box_type: box.box_type,
        notes: box.notes || ''
      });
    }
  }, [box]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label.trim()) return;

    const submitData: CreateBoxRequest | UpdateBoxRequest = {
      label: formData.label.trim(),
      destination_room_id: formData.destination_room_id || undefined,
      box_type: formData.box_type,
      notes: formData.notes.trim() || undefined
    };

    onSubmit(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
          Box Label *
        </label>
        <input
          type="text"
          id="label"
          name="label"
          value={formData.label}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Kitchen Box 1, Living Room Electronics"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="box_type" className="block text-sm font-medium text-gray-700 mb-1">
            Box Type
          </label>
          <select
            id="box_type"
            name="box_type"
            value={formData.box_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="standard">Standard</option>
            <option value="fragile">Fragile</option>
            <option value="heavy">Heavy</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="kitchen">Kitchen</option>
            <option value="bathroom">Bathroom</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="destination_room_id" className="block text-sm font-medium text-gray-700 mb-1">
            Destination Room
          </label>
          <select
            id="destination_room_id"
            name="destination_room_id"
            value={formData.destination_room_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select destination room</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>{room.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Optional notes about the box contents or handling instructions"
        />
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
          {box ? 'Update Box' : 'Create Box'}
        </button>
      </div>
    </form>
  );
};

export default BoxForm;
