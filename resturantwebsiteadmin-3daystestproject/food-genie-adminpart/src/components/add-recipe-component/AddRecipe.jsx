import React, { useContext, useState, useEffect } from 'react';
import { MyContext } from '../../GlobalContext';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import './AddRecipe.css'; // Custom styles
import CustomNavbar from '../navbar-component/CustomNavbar';

const AddRecipe = () => {
  const { categories, recipes, setRecipes } = useContext(MyContext);

  // Recipe form states
  const [dishName, setDishName] = useState(''); // Dish Name field
  const [recipeDescription, setRecipeDescription] = useState(''); // Updated to reflect it's a description
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [vegOrNonVeg, setVegOrNonVeg] = useState('veg'); // State for Veg or Non-Veg
  const [editMode, setEditMode] = useState(false); // To track edit mode
  const [currentRecipeId, setCurrentRecipeId] = useState(null);

  // Firebase Recipes URL
  const firebaseRecipesUrl = 'https://foodgenie-298de-default-rtdb.firebaseio.com/recipes.json';

  // Fetch recipes on component mount
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(firebaseRecipesUrl);
        const fetchedRecipes = response.data
          ? Object.entries(response.data).map(([id, recipe]) => ({ ...recipe, id }))
          : [];
        setRecipes(fetchedRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, [setRecipes]);

  // Handle form input changes
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  // Add ingredient field
  const addIngredientField = () => {
    setIngredients([...ingredients, '']);
  };

  // Remove ingredient field
  const removeIngredientField = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Handle form submission (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRecipe = {
      dishName,
      recipeDescription, // Now uses description instead of name
      category,
      ingredients,
      price,
      imageUrl,
      vegOrNonVeg, // Include vegOrNonVeg state
    };

    if (editMode) {
      // Edit mode: Update recipe
      try {
        const recipeUrl = `https://foodgenie-298de-default-rtdb.firebaseio.com/recipes/${currentRecipeId}.json`;
        await axios.put(recipeUrl, newRecipe);
        setRecipes(
          recipes.map((recipe) =>
            recipe.id === currentRecipeId ? { ...newRecipe, id: currentRecipeId } : recipe
          )
        );
        alert('Recipe updated successfully!');
        resetForm();
      } catch (error) {
        console.error('Error updating recipe:', error);
      }
    } else {
      // Add mode: Add a new recipe
      try {
        const response = await axios.post(firebaseRecipesUrl, newRecipe);
        if (response.status === 200) {
          setRecipes([...recipes, { ...newRecipe, id: response.data.name }]);
          alert('Recipe added successfully!');
          resetForm();
        }
      } catch (error) {
        console.error('Error adding recipe:', error);
      }
    }
  };

  // Delete recipe
  const handleDelete = async (recipeId) => {
    try {
      await axios.delete(`https://foodgenie-298de-default-rtdb.firebaseio.com/recipes/${recipeId}.json`);
      setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
      alert('Recipe deleted successfully!');
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  // Edit recipe
  const handleEdit = (recipe) => {
    setDishName(recipe.dishName);
    setRecipeDescription(recipe.recipeDescription); // Adjusted for description
    setCategory(recipe.category);
    setIngredients(recipe.ingredients);
    setPrice(recipe.price);
    setImageUrl(recipe.imageUrl);
    setVegOrNonVeg(recipe.vegOrNonVeg); // Set veg or non-veg state
    setEditMode(true);
    setCurrentRecipeId(recipe.id);
  };

  // Reset form after adding or editing
  const resetForm = () => {
    setDishName('');
    setRecipeDescription(''); // Clear description
    setCategory('');
    setIngredients(['']);
    setPrice('');
    setImageUrl('');
    setVegOrNonVeg('veg'); // Default to veg
    setEditMode(false);
    setCurrentRecipeId(null);
  };

  return (
    <div className="container mt-5">
    <CustomNavbar/>
      <div className="recipe-form-box p-4 shadow-sm">
        <h2>{editMode ? 'Edit Recipe' : 'Add Recipe'}</h2>
        <Form onSubmit={handleSubmit}>

          <Form.Group controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              value={category}
              onChange={handleInputChange(setCategory)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="dishName">
            <Form.Label>Dish Name</Form.Label>
            <Form.Control
              type="text"
              value={dishName}
              onChange={handleInputChange(setDishName)}
              required
            />
          </Form.Group>

          <Form.Group controlId="ingredients">
            <Form.Label>Ingredients</Form.Label>
            {ingredients.map((ingredient, index) => (
              <Row key={index}>
                <Col md={10}>
                  <Form.Control
                    type="text"
                    value={ingredient}
                    onChange={(e) =>
                      setIngredients(ingredients.map((ing, i) => (i === index ? e.target.value : ing)))
                    }
                    required
                  />
                </Col>
                <Col md={2}>
                  <Button variant="danger" onClick={() => removeIngredientField(index)}>
                    Remove
                  </Button>
                </Col>
              </Row>
            ))}
            <Button variant="secondary" onClick={addIngredientField} className="mt-2">
              Add Ingredient
            </Button>
          </Form.Group>

          <Form.Group controlId="recipeDescription">
            <Form.Label>Recipe Description</Form.Label> {/* Updated label */}
            <Form.Control
              as="textarea"
              rows={3} // Allows for better readability in longer descriptions
              value={recipeDescription}
              onChange={handleInputChange(setRecipeDescription)} // Description instead of name
              required
            />
          </Form.Group>

          <Form.Group controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={price}
              onChange={handleInputChange(setPrice)}
              required
            />
          </Form.Group>

          <Form.Group controlId="imageUrl">
            <Form.Label>Recipe Image URL</Form.Label>
            <Form.Control
              type="text"
              value={imageUrl}
              onChange={handleInputChange(setImageUrl)}
              required
            />
          </Form.Group>

          <Form.Group controlId="vegOrNonVeg">
            <Form.Label>Veg or Non-Veg</Form.Label>
            <div>
              <Form.Check
                inline
                label="Veg"
                type="radio"
                value="veg"
                name="vegOrNonVeg"
                checked={vegOrNonVeg === 'veg'}
                onChange={handleInputChange(setVegOrNonVeg)}
              />
              <Form.Check
                inline
                label="Non-Veg"
                type="radio"
                value="nonveg"
                name="vegOrNonVeg"
                checked={vegOrNonVeg === 'nonveg'}
                onChange={handleInputChange(setVegOrNonVeg)}
              />
            </div>
          </Form.Group>

          <Button variant="primary" type="submit">
            {editMode ? 'Update Recipe' : 'Add Recipe'}
          </Button>
        </Form>
      </div>

      <hr className="my-4" />

      <h3>Recipes List</h3>
      <Row>
        {recipes.map((recipe) => (
          <Col md={4} key={recipe.id} className="mb-4">
            <Card className="fixed-card-size">
              <div className="image-container">
                <Card.Img variant="top" src={recipe.imageUrl} className="card-img-fixed" />
              </div>
              <Card.Body>
                <Card.Title>
                  {recipe.dishName}
                  <span
                    className="ml-2"
                    style={{
                      display: 'inline-block',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: recipe.vegOrNonVeg === 'veg' ? 'green' : 'red',
                    }}
                  />
                </Card.Title>
                <Card.Text>
                  <strong>Category:</strong> {recipe.category}
                  <br />
                  <strong>Ingredients:</strong> {recipe.ingredients.join(', ')}
                  <br />
                  <strong>Description:</strong> {recipe.recipeDescription} {/* Updated to show description */}
                  <br />
                  <strong>Price:</strong> ₹{recipe.price}
                </Card.Text>
                <Button variant="warning" onClick={() => handleEdit(recipe)}>
                  Edit
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(recipe.id)}>
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AddRecipe;
