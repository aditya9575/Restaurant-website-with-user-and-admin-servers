import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import CustomNavbar from '../navbar-component/CustomNavbar';
import { MyContext } from '../../GlobalContext';

const AddCategoryForm = () => {
    const { categories, setCategories } = useContext(MyContext);
    const [categoryName, setCategoryName] = useState('');
    const [categoryImage, setCategoryImage] = useState('');
    const [validationError, setValidationError] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null); // Track the category being edited

    const firebaseUrl = 'https://foodgenie-298de-default-rtdb.firebaseio.com/categories';
    
    // Fetch categories from Firebase on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${firebaseUrl}.json`);
                const fetchedCategories = response.data ? Object.keys(response.data).map(key => ({
                    id: key,
                    ...response.data[key]
                })) : [];
                setCategories(fetchedCategories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, [setCategories]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for empty fields
        if (!categoryName || !categoryImage) {
            setValidationError('Please fill in both fields');
            return;
        }

        // Validate URL format
        const isUrlValid = validateUrl(categoryImage);
        if (!isUrlValid) {
            setValidationError('Please enter a valid image URL');
            return;
        }

        // Check if category already exists
        const existingCategory = categories.find(category => category.name.toLowerCase() === categoryName.toLowerCase() && category.id !== editingCategoryId);
        if (existingCategory) {
            setValidationError('This category already exists. Please add another one.');
            return;
        }

        const newCategory = {
            name: categoryName,
            imageUrl: categoryImage
        };

        try {
            if (editingCategoryId) {
                // Update existing category
                await axios.put(`${firebaseUrl}/${editingCategoryId}.json`, newCategory);
                setCategories(categories.map(category => (category.id === editingCategoryId ? { ...newCategory, id: editingCategoryId } : category)));
                alert('Category updated successfully!');
            } else {
                // Add new category
                const response = await axios.post(`${firebaseUrl}.json`, newCategory);
                if (response.status === 200) {
                    setCategories([...categories, { ...newCategory, id: response.data.name }]); // response.data.name contains the new category ID
                    alert('Category added successfully!');
                }
            }

            // Reset the form fields
            setCategoryName('');
            setCategoryImage('');
            setValidationError('');
            setEditingCategoryId(null); // Reset editing state
        } catch (error) {
            console.error('Error adding/updating category:', error);
        }
    };

    // Function to validate URL format
    const validateUrl = (url) => {
        try {
            new URL(url); // Try to create a new URL object
            return true;
        } catch (error) {
            return false;
        }
    };

    // Function to handle editing a category
    const handleEdit = (category) => {
        setCategoryName(category.name);
        setCategoryImage(category.imageUrl);
        setEditingCategoryId(category.id);
    };

    // Function to handle deleting a category
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${firebaseUrl}/${id}.json`); // Correct URL for deleting the category
            setCategories(categories.filter(category => category.id !== id)); // Update local state
            alert('Category deleted successfully!');
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return (
        <Container
            fluid
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ minHeight: '100vh' }}
        >
            <CustomNavbar />
            <Row className="justify-content-center w-100">
                <Col xs={11} sm={9} md={7} lg={5} xl={4}>
                    <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
                        <h3 className="text-center mb-4">Add/Edit Category</h3>

                        <Form.Group controlId="formCategoryName" className="mb-3">
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter category name"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formCategoryImage" className="mb-3">
                            <Form.Label>Category Image URL</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter image URL"
                                value={categoryImage}
                                onChange={(e) => setCategoryImage(e.target.value)}
                                required
                            />
                            {validationError && <Form.Text className="text-danger">{validationError}</Form.Text>}
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            {editingCategoryId ? 'Update Category' : 'Add Category'}
                        </Button>
                    </Form>
                    {validationError && (
                        <div className="alert alert-danger mt-3" role="alert">
                            {validationError}
                        </div>
                    )}
                </Col>
            </Row>

            {/* Horizontal Rule */}
            <hr className="my-4" />

            {/* Display categories in a grid format */}
            <Row className="justify-content-center w-100 mt-4">
                <Col xs={11}>
                    <h4 className="text-center mb-4">Categories</h4>
                    {categories.length > 0 ? (
                        <Row>
                            {categories.map((category, index) => (
                                <Col key={category.id} xs={12} sm={6} md={4} className="mb-4">
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>{category.name}</Card.Title>
                                            <Card.Img
                                                variant="top"
                                                src={category.imageUrl}
                                                style={{ height: '150px', objectFit: 'cover' }}
                                            />
                                            <div className="d-flex justify-content-between mt-3">
                                                <Button
                                                    variant="warning"
                                                    onClick={() => handleEdit(category)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDelete(category.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className="alert alert-info text-center">
                            No categories added yet.
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default AddCategoryForm;
