import React, { useState, useEffect } from "react";
import "../../styles/admin/AdminControl.css";
import api from "../../services/api"; // Import the api.js file

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: "",
    picture: "",
    description: "",
    isAvailable: true,
  });
  const [editItem, setEditItem] = useState(null); // State to hold the item being edited

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await api.get("/menu-items");
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const handleAdd = async () => {
    if (newItem.name && newItem.price && newItem.category) {
      try {
        const response = await api.post("/menu-items", newItem);
        setMenuItems([...menuItems, response.data]);
        setNewItem({
          name: "",
          price: "",
          category: "",
          picture: "",
          description: "",
          isAvailable: true,
        });
        setShowAddForm(false);
      } catch (error) {
        console.error("Error adding menu item:", error);
      }
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.delete(`/menu-items/${id}`);
      setMenuItems(menuItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item); // Set the item to be edited
    setShowAddForm(true); // Show the form for editing
  };

  const handleUpdate = async () => {
    if (editItem.name && editItem.price && editItem.category) {
      try {
        const response = await api.put(`/menu-items/${editItem.id}`, editItem);
        setMenuItems(
          menuItems.map((item) =>
            item.id === editItem.id ? response.data : item
          )
        );
        setEditItem(null);
        setShowAddForm(false);
      } catch (error) {
        console.error("Error updating menu item:", error);
      }
    }
  };

  return (
    <div className="content">
      <button className="add-btn" onClick={() => setShowAddForm(true)}>
        Add Item
      </button>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Upload Picture</th>
            <th>Price</th>
            <th>Category</th>
            <th>Edit</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>
                {item.picture ? (
                  <img
                    src={item.picture}
                    alt={item.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td>{item.price}</td>
              <td>{item.category}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(item)}>
                  ✏️
                </button>
              </td>
              <td>
                <button className="remove-btn" onClick={() => handleRemove(item.id)}>
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editItem ? "Edit Menu Item" : "Add New Item"}</h3>
            <input
              type="text"
              name="name"
              placeholder="Item name"
              value={editItem ? editItem.name : newItem.name}
              onChange={(e) =>
                editItem
                  ? setEditItem({ ...editItem, name: e.target.value })
                  : setNewItem({ ...newItem, name: e.target.value })
              }
            />
            <input
              type="text"
              name="price"
              placeholder="Price"
              value={editItem ? editItem.price : newItem.price}
              onChange={(e) =>
                editItem
                  ? setEditItem({ ...editItem, price: e.target.value })
                  : setNewItem({ ...newItem, price: e.target.value })
              }
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={editItem ? editItem.category : newItem.category}
              onChange={(e) =>
                editItem
                  ? setEditItem({ ...editItem, category: e.target.value })
                  : setNewItem({ ...newItem, category: e.target.value })
              }
            />
            <input
              type="file"
              name="picture"
              onChange={(e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onloadend = () => {
                  editItem
                    ? setEditItem({ ...editItem, picture: reader.result })
                    : setNewItem({ ...newItem, picture: reader.result });
                };
                if (file) reader.readAsDataURL(file);
              }}
            />
            <button className="save-btn" onClick={editItem ? handleUpdate : handleAdd}>
              {editItem ? "Update" : "Save"}
            </button>
            <button className="close-btn" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
