import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import Modal from '../components/Modal';
import RoomForm from '../components/RoomForm';
import ItemForm from '../components/ItemForm';
import BoxForm from '../components/BoxForm';
import type { Room, Item, Box, ItemStats, BoxStats, RoomStats, ItemFilters, BoxFilters, CreateRoomRequest, UpdateRoomRequest, CreateItemRequest, UpdateItemRequest, CreateBoxRequest, UpdateBoxRequest } from '../types';

const InventoryManagement: React.FC = () => {
  const { moveId } = useParams<{ moveId: string }>();
  const [activeTab, setActiveTab] = useState<'rooms' | 'items' | 'boxes'>('rooms');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Data states
  const [rooms, setRooms] = useState<Room[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [itemStats, setItemStats] = useState<ItemStats | null>(null);
  const [boxStats, setBoxStats] = useState<BoxStats | null>(null);
  const [roomStats, setRoomStats] = useState<RoomStats[]>([]);

  // Filter states
  const [itemFilters, setItemFilters] = useState<ItemFilters>({});
  const [boxFilters, setBoxFilters] = useState<BoxFilters>({});

  // Modal states
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showBoxModal, setShowBoxModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editingBox, setEditingBox] = useState<Box | null>(null);

  useEffect(() => {
    if (moveId) {
      fetchAllData();
    }
  }, [moveId]);

  const fetchAllData = async () => {
    if (!moveId) return;
    
    setLoading(true);
    try {
      await Promise.all([
        fetchRooms(),
        fetchItems(),
        fetchBoxes(),
        fetchStats()
      ]);
    } catch (err) {
      setError('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    if (!moveId) return;
    const response = await apiService.getRooms(moveId);
    if (response.success && response.data) {
      setRooms(response.data);
    }
  };

  const fetchItems = async () => {
    if (!moveId) return;
    const response = await apiService.getItems(moveId, itemFilters);
    if (response.success && response.data) {
      setItems(response.data);
    }
  };

  const fetchBoxes = async () => {
    if (!moveId) return;
    const response = await apiService.getBoxes(moveId, boxFilters);
    if (response.success && response.data) {
      setBoxes(response.data);
    }
  };

  const fetchStats = async () => {
    if (!moveId) return;
    try {
      const [itemStatsRes, boxStatsRes, roomStatsRes] = await Promise.all([
        apiService.getItemStats(moveId),
        apiService.getBoxStats(moveId),
        apiService.getRoomStats(moveId)
      ]);

      if (itemStatsRes.success && itemStatsRes.data) {
        setItemStats(itemStatsRes.data);
      }
      if (boxStatsRes.success && boxStatsRes.data) {
        setBoxStats(boxStatsRes.data);
      }
      if (roomStatsRes.success && roomStatsRes.data) {
        setRoomStats(roomStatsRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleCreateRoom = async (roomData: CreateRoomRequest) => {
    if (!moveId) return;
    try {
      const response = await apiService.createRoom(moveId, roomData);
      if (response.success) {
        await fetchRooms();
        await fetchStats();
        setShowRoomModal(false);
        setEditingRoom(null);
      }
    } catch (err) {
      setError('Failed to create room');
    }
  };

  const handleUpdateRoom = async (roomData: UpdateRoomRequest) => {
    if (!editingRoom) return;
    try {
      const response = await apiService.updateRoom(editingRoom.id, roomData);
      if (response.success) {
        await fetchRooms();
        await fetchStats();
        setShowRoomModal(false);
        setEditingRoom(null);
      }
    } catch (err) {
      setError('Failed to update room');
    }
  };

  const handleCreateItem = async (itemData: CreateItemRequest) => {
    if (!moveId) return;
    try {
      const response = await apiService.createItem(moveId, itemData);
      if (response.success) {
        await fetchItems();
        await fetchStats();
        setShowItemModal(false);
        setEditingItem(null);
      }
    } catch (err) {
      setError('Failed to create item');
    }
  };

  const handleUpdateItem = async (itemData: UpdateItemRequest) => {
    if (!editingItem) return;
    try {
      const response = await apiService.updateItem(editingItem.id, itemData);
      if (response.success) {
        await fetchItems();
        await fetchStats();
        setShowItemModal(false);
        setEditingItem(null);
      }
    } catch (err) {
      setError('Failed to update item');
    }
  };

  const handleCreateBox = async (boxData: CreateBoxRequest) => {
    if (!moveId) return;
    try {
      const response = await apiService.createBox(moveId, boxData);
      if (response.success) {
        await fetchBoxes();
        await fetchStats();
        setShowBoxModal(false);
        setEditingBox(null);
      }
    } catch (err) {
      setError('Failed to create box');
    }
  };

  const handleUpdateBox = async (boxData: UpdateBoxRequest) => {
    if (!editingBox) return;
    try {
      const response = await apiService.updateBox(editingBox.id, boxData);
      if (response.success) {
        await fetchBoxes();
        await fetchStats();
        setShowBoxModal(false);
        setEditingBox(null);
      }
    } catch (err) {
      setError('Failed to update box');
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (window.confirm('Are you sure you want to delete this room? All items in this room will be unassigned.')) {
      try {
        const response = await apiService.deleteRoom(roomId);
        if (response.success) {
          await fetchRooms();
          await fetchItems();
          await fetchStats();
        }
      } catch (err) {
        setError('Failed to delete room');
      }
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await apiService.deleteItem(itemId);
        if (response.success) {
          await fetchItems();
          await fetchStats();
        }
      } catch (err) {
        setError('Failed to delete item');
      }
    }
  };

  const handleDeleteBox = async (boxId: string) => {
    if (window.confirm('Are you sure you want to delete this box? All items in this box will be unassigned.')) {
      try {
        const response = await apiService.deleteBox(boxId);
        if (response.success) {
          await fetchBoxes();
          await fetchItems();
          await fetchStats();
        }
      } catch (err) {
        setError('Failed to delete box');
      }
    }
  };

  const handleMoveItemToBox = async (itemId: string, boxId: string) => {
    try {
      const response = await apiService.moveItemToBox(itemId, boxId);
      if (response.success) {
        await fetchItems();
        await fetchBoxes();
      }
    } catch (err) {
      setError('Failed to move item to box');
    }
  };

  const handleRemoveItemFromBox = async (itemId: string) => {
    try {
      const response = await apiService.removeItemFromBox(itemId);
      if (response.success) {
        await fetchItems();
        await fetchBoxes();
      }
    } catch (err) {
      setError('Failed to remove item from box');
    }
  };

  const handleMarkBoxAsPacked = async (boxId: string) => {
    try {
      const response = await apiService.markBoxAsPacked(boxId);
      if (response.success) {
        await fetchBoxes();
        await fetchStats();
      }
    } catch (err) {
      setError('Failed to mark box as packed');
    }
  };

  const handleMarkBoxAsLoaded = async (boxId: string) => {
    try {
      const response = await apiService.markBoxAsLoaded(boxId);
      if (response.success) {
        await fetchBoxes();
        await fetchStats();
      }
    } catch (err) {
      setError('Failed to mark box as loaded');
    }
  };

  const handleMarkBoxAsDelivered = async (boxId: string) => {
    try {
      const response = await apiService.markBoxAsDelivered(boxId);
      if (response.success) {
        await fetchBoxes();
        await fetchStats();
      }
    } catch (err) {
      setError('Failed to mark box as delivered');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
              <p className="text-gray-600">Manage your move inventory</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Items</dt>
                      <dd className="text-lg font-medium text-gray-900">{itemStats?.total_items || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Packed Items</dt>
                      <dd className="text-lg font-medium text-gray-900">{itemStats?.packed_items || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Boxes</dt>
                      <dd className="text-lg font-medium text-gray-900">{boxStats?.total_boxes || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Value</dt>
                      <dd className="text-lg font-medium text-gray-900">${itemStats?.total_value?.toFixed(2) || '0.00'}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('rooms')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'rooms'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Rooms ({rooms.length})
                </button>
                <button
                  onClick={() => setActiveTab('items')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'items'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Items ({items.length})
                </button>
                <button
                  onClick={() => setActiveTab('boxes')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'boxes'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Boxes ({boxes.length})
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'rooms' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Rooms</h2>
                <button
                  onClick={() => setShowRoomModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Add Room
                </button>
              </div>

              {rooms.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No rooms yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating your first room.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rooms.map((room) => {
                    const stats = roomStats.find(s => s.id === room.id);
                    return (
                      <div key={room.id} className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">{room.name}</h3>
                          {room.description && (
                            <p className="text-sm text-gray-600 mb-4">{room.description}</p>
                          )}
                          <div className="space-y-2 text-sm text-gray-600">
                            <p><strong>Items:</strong> {stats?.item_count || 0}</p>
                            <p><strong>Packed:</strong> {stats?.packed_items || 0}</p>
                            <p><strong>Value:</strong> ${stats?.total_value?.toFixed(2) || '0.00'}</p>
                          </div>
                          <div className="mt-4 flex justify-between">
                            <button
                              onClick={() => {
                                setEditingRoom(room);
                                setShowRoomModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room.id)}
                              className="text-red-600 hover:text-red-500 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'items' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Items</h2>
                <button
                  onClick={() => setShowItemModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Add Item
                </button>
              </div>

              {/* Item Filters */}
              <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input
                      type="text"
                      placeholder="Search items..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={itemFilters.search || ''}
                      onChange={(e) => setItemFilters({ ...itemFilters, search: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={itemFilters.room_id || ''}
                      onChange={(e) => setItemFilters({ ...itemFilters, room_id: e.target.value || undefined })}
                    >
                      <option value="">All Rooms</option>
                      {rooms.map(room => (
                        <option key={room.id} value={room.id}>{room.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={itemFilters.category || ''}
                      onChange={(e) => setItemFilters({ ...itemFilters, category: e.target.value || undefined })}
                    >
                      <option value="">All Categories</option>
                      <option value="furniture">Furniture</option>
                      <option value="electronics">Electronics</option>
                      <option value="clothing">Clothing</option>
                      <option value="kitchen">Kitchen</option>
                      <option value="books">Books</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={itemFilters.condition || ''}
                      onChange={(e) => setItemFilters({ ...itemFilters, condition: e.target.value || undefined })}
                    >
                      <option value="">All Conditions</option>
                      <option value="new">New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={fetchItems}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No items yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by adding your first item.</p>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <li key={item.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {item.photo_url ? (
                                <img className="h-10 w-10 rounded-full object-cover" src={item.photo_url} alt={item.name} />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center">
                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                {item.is_fragile && (
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Fragile
                                  </span>
                                )}
                                {item.requires_special_handling && (
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Special Handling
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <p>{item.room_name && `Room: ${item.room_name}`}</p>
                                {item.box_label && <p className="ml-4">Box: {item.box_label}</p>}
                                {item.category && <p className="ml-4">Category: {item.category}</p>}
                                {item.estimated_value && <p className="ml-4">Value: ${item.estimated_value.toFixed(2)}</p>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setShowItemModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-red-600 hover:text-red-500 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'boxes' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Boxes</h2>
                <button
                  onClick={() => setShowBoxModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Add Box
                </button>
              </div>

              {/* Box Filters */}
              <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input
                      type="text"
                      placeholder="Search boxes..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={boxFilters.search || ''}
                      onChange={(e) => setBoxFilters({ ...boxFilters, search: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={boxFilters.box_type || ''}
                      onChange={(e) => setBoxFilters({ ...boxFilters, box_type: e.target.value || undefined })}
                    >
                      <option value="">All Types</option>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={boxFilters.is_packed === undefined ? '' : boxFilters.is_packed.toString()}
                      onChange={(e) => setBoxFilters({ ...boxFilters, is_packed: e.target.value === '' ? undefined : e.target.value === 'true' })}
                    >
                      <option value="">All Status</option>
                      <option value="false">Not Packed</option>
                      <option value="true">Packed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination Room</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={boxFilters.destination_room_id || ''}
                      onChange={(e) => setBoxFilters({ ...boxFilters, destination_room_id: e.target.value || undefined })}
                    >
                      <option value="">All Rooms</option>
                      {rooms.map(room => (
                        <option key={room.id} value={room.id}>{room.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={fetchBoxes}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>

              {boxes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No boxes yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating your first box.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {boxes.map((box) => (
                    <div key={box.id} className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-900">{box.label}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            box.is_delivered ? 'bg-green-100 text-green-800' :
                            box.is_loaded ? 'bg-blue-100 text-blue-800' :
                            box.is_packed ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {box.is_delivered ? 'Delivered' :
                             box.is_loaded ? 'Loaded' :
                             box.is_packed ? 'Packed' : 'Not Packed'}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <p><strong>Type:</strong> {box.box_type}</p>
                          {box.destination_room_name && (
                            <p><strong>Destination:</strong> {box.destination_room_name}</p>
                          )}
                          {box.notes && (
                            <p><strong>Notes:</strong> {box.notes}</p>
                          )}
                          <p><strong>QR Code:</strong> {box.qr_code}</p>
                        </div>
                        
                        <div className="mt-4 flex justify-between">
                          <div className="flex space-x-2">
                            {!box.is_packed && (
                              <button
                                onClick={() => handleMarkBoxAsPacked(box.id)}
                                className="text-green-600 hover:text-green-500 text-sm font-medium"
                              >
                                Mark Packed
                              </button>
                            )}
                            {box.is_packed && !box.is_loaded && (
                              <button
                                onClick={() => handleMarkBoxAsLoaded(box.id)}
                                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                              >
                                Mark Loaded
                              </button>
                            )}
                            {box.is_loaded && !box.is_delivered && (
                              <button
                                onClick={() => handleMarkBoxAsDelivered(box.id)}
                                className="text-purple-600 hover:text-purple-500 text-sm font-medium"
                              >
                                Mark Delivered
                              </button>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingBox(box);
                                setShowBoxModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBox(box.id)}
                              className="text-red-600 hover:text-red-500 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Room Modal */}
      <Modal
        isOpen={showRoomModal}
        onClose={() => {
          setShowRoomModal(false);
          setEditingRoom(null);
        }}
        title={editingRoom ? 'Edit Room' : 'Create Room'}
      >
        <RoomForm
          room={editingRoom}
          onSubmit={editingRoom ? handleUpdateRoom : handleCreateRoom}
          onCancel={() => {
            setShowRoomModal(false);
            setEditingRoom(null);
          }}
        />
      </Modal>

      {/* Item Modal */}
      <Modal
        isOpen={showItemModal}
        onClose={() => {
          setShowItemModal(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'Edit Item' : 'Create Item'}
      >
        <ItemForm
          item={editingItem}
          rooms={rooms}
          onSubmit={editingItem ? handleUpdateItem : handleCreateItem}
          onCancel={() => {
            setShowItemModal(false);
            setEditingItem(null);
          }}
        />
      </Modal>

      {/* Box Modal */}
      <Modal
        isOpen={showBoxModal}
        onClose={() => {
          setShowBoxModal(false);
          setEditingBox(null);
        }}
        title={editingBox ? 'Edit Box' : 'Create Box'}
      >
        <BoxForm
          box={editingBox}
          rooms={rooms}
          onSubmit={editingBox ? handleUpdateBox : handleCreateBox}
          onCancel={() => {
            setShowBoxModal(false);
            setEditingBox(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default InventoryManagement;
