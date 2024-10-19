import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import axios from "axios";
import './menu.css'; // Custom styles
import { UserContext } from "../../UserGlobalContext";

const MenuItemsCard = () => {
  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const { addToCart, userId } = useContext(UserContext);

  const firebaseCategoriesUrl = 'https://foodgenie-298de-default-rtdb.firebaseio.com/categories.json';
  const firebaseRecipesUrl = 'https://foodgenie-298de-default-rtdb.firebaseio.com/recipes.json';

  useEffect(() => {
    const fetchCategoriesAndRecipes = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await axios.get(firebaseCategoriesUrl);
        console.log(categoriesResponse.data);

        Object.entries(categoriesResponse.data).map(([id, category]) => ({ ...category, id }));
//here we convert the category response.data into array of key value pairs where this array contains "unique id" as key and
// "category object" as value
     // Firebase might return:
// {
//   "categoryId1": { name: "Pizza", imageUrl: "pizza.jpg" },
//   "categoryId2": { name: "Pasta", imageUrl: "pasta.jpg" }
// }

 // After Object.entries(categoriesResponse.data):
// [
//   ["categoryId1", { name: "Pizza", imageUrl: "pizza.jpg" }],
//   ["categoryId2", { name: "Pasta", imageUrl: "pasta.jpg" }]
// ]
// .map(([id, category]) => ...) part destructures each key-value pair (where id is the Firebase key and category is the value).
// { ...category, id }: The spread operator ...category takes all the properties of the category object and includes them in the new
// object.Then, the id is added to the new object, associating the category with its unique Firebase ID. 
        const fetchedCategories = categoriesResponse.data
        
          ? Object.entries(categoriesResponse.data).map(([id, category]) => ({ ...category, id }))
          : [];
        setCategories(fetchedCategories);

        console.log(fetchedCategories)

        // Fetch recipes
        const recipesResponse = await axios.get(firebaseRecipesUrl);
        const fetchedRecipes = recipesResponse.data
          ? Object.entries(recipesResponse.data).map(([id, recipe]) => ({ ...recipe, id }))
          : [];
        setRecipes(fetchedRecipes);

      } catch (error) {
        console.error('Error fetching categories and recipes:', error);
      }
    };

    fetchCategoriesAndRecipes();
  }, []);

  // Function to handle adding to cart
  const handleAddToCart = (recipe, quantity) => {
    if (!userId) {
      alert('User is not authenticated!');
      return;
    }

    // Create a cart item object
    const cartItem = { ...recipe, quantity };

    // Call the context's addToCart function
    addToCart(cartItem);
    // alert(`${recipe.dishName} added to cart!`);
  };

  return (
    <div className="menu-items-container">
      {categories.map((category) => {
        const categoryRecipes = recipes.filter(recipe => recipe.category === category.name);

        if (categoryRecipes.length === 0) {
          return null;
        }

        return (
          <div key={category.id} className="category-section">
            <div className="category-banner" style={{ backgroundImage: `url(${category.imageUrl})` }}>
              <h2 className="category-title">{category.name}</h2>
            </div>

            <hr className="category-divider" />

            <Row>
              {categoryRecipes.map((recipe) => (
                <Col md={4} key={recipe.id} className="mb-4">
                  <Card className="h-100">
                    <Card.Img variant="top" src={recipe.imageUrl} alt={recipe.dishName} style={{ height: '200px', objectFit: 'cover' }} />
                    <Card.Body>
                      <Card.Title>{recipe.dishName}</Card.Title>
                      <Card.Text>{recipe.recipeDescription}</Card.Text>
                      <Card.Text><strong>Price: </strong> ₹{recipe.price}</Card.Text>

                      <Form.Group controlId={`quantity-${recipe.id}`}>
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          defaultValue="1"
                          onChange={(e) => recipe.quantity = parseInt(e.target.value)} 
                        />
                      </Form.Group>

                      <Button
                        variant="primary"
                        className="mt-2"
                        onClick={() => handleAddToCart(recipe, recipe.quantity || 1)}
                      >
                        Add to Cart
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        );
      })}
    </div>
  );
};

export default MenuItemsCard;


{/* categories.map(): This iterates over the categories array stored in the state.
For each category, it performs a filtering operation on the recipes array.
It uses recipes.filter() to find all recipes that belong to the current category by comparing recipe.category with category.name. 
If there are no recipes in a category, the component returns null, skipping rendering for that category.
A div is created with a unique key (category.id).
The category’s name and image are displayed using category.name and category.imageUrl.
For each category, the filtered categoryRecipes are mapped over using categoryRecipes.map().
For each recipe:
A Card is created displaying the recipe's details: image (recipe.imageUrl), dish name (recipe.dishName), description 
(recipe.recipeDescription), and price (recipe.price).
The user can input the quantity for each recipe, which is updated in the recipe.quantity property through onChange.
A button is provided to add the recipe to the cart using handleAddToCart. */}

// add to cart part
