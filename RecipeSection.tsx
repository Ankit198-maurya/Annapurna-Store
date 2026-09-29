import { useState } from 'react';
import { Recipe, Product, CartItem } from '../types';
import { recipes, products } from '../data';
import { Clock, ChefHat, Plus, Check, ShoppingCart, ChevronRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RecipeSectionProps {
  onAddMultipleToCart: (items: { productId: string; quantity: number }[]) => void;
  cartItems: CartItem[];
}

export default function RecipeSection({ onAddMultipleToCart, cartItems }: RecipeSectionProps) {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  const currentRecipe = recipes.find((r) => r.id === selectedRecipeId) || null;

  const handleSelectRecipe = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    // Auto check all ingredients by default
    const recipe = recipes.find((r) => r.id === recipeId);
    if (recipe) {
      const initialChecked: Record<string, boolean> = {};
      recipe.ingredients.forEach((ing) => {
        initialChecked[ing.productId] = true;
      });
      setCheckedIngredients(initialChecked);
    }
  };

  const toggleIngredientChecked = (productId: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleAddIngredientsToCart = () => {
    if (!currentRecipe) return;

    const itemsToAdd = currentRecipe.ingredients
      .filter((ing) => checkedIngredients[ing.productId])
      .map((ing) => ({
        productId: ing.productId,
        quantity: ing.quantityRequired,
      }));

    if (itemsToAdd.length === 0) {
      alert('Please select at least one ingredient to add to your basket!');
      return;
    }

    onAddMultipleToCart(itemsToAdd);

    // Show a temporary visual success or alert
    alert(`Successfully added ${itemsToAdd.length} recipe ingredients to your basket!`);
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm" id="recipe-bundler-section">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-700">
            <ChefHat className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-wider">Smart Cook Integration</span>
          </div>
          <h2 className="text-xl font-extrabold text-neutral-800 mt-1">Instant Recipe Ingredient Bundles</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Select a popular recipe and load all its authentic ingredients directly into your cart!
          </p>
        </div>
      </div>

      {/* Grid: Left - Recipe list selector, Right - Selected recipe cooking instructions and bundle checker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT CARD COLUMN: Recipe Selection list */}
        <div className="col-span-1 lg:col-span-4 space-y-3">
          {recipes.map((recipe) => {
            const isSelected = selectedRecipeId === recipe.id;
            return (
              <div
                key={recipe.id}
                onClick={() => handleSelectRecipe(recipe.id)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex gap-3 ${
                  isSelected
                    ? 'bg-emerald-50/50 border-emerald-500 shadow-md ring-1 ring-emerald-200'
                    : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300'
                }`}
                id={`recipe-selector-${recipe.id}`}
              >
                {/* Visual meal emoji */}
                <div className="w-12 h-12 bg-white rounded-xl border border-neutral-100 shadow-sm flex items-center justify-center text-2xl">
                  {recipe.imagePlaceholder}
                </div>

                {/* Meta details */}
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-xs text-neutral-800 leading-snug">
                      {recipe.name}
                    </h3>
                    <p className="text-[10px] text-neutral-400 font-medium line-clamp-1 mt-0.5">
                      {recipe.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {recipe.prepTime}
                    </span>
                    <span>•</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] ${
                      recipe.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT CARD COLUMN: Detailed Recipe details & Bundle adding */}
        <div className="col-span-1 lg:col-span-8 bg-neutral-50 rounded-2xl border border-neutral-200 p-5 min-h-[300px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {currentRecipe ? (
              <motion.div
                key={currentRecipe.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 flex flex-col justify-between h-full"
              >
                {/* Content top */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b border-neutral-200 pb-3">
                    <div>
                      <h3 className="font-extrabold text-base text-neutral-800">
                        {currentRecipe.name}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1">
                        {currentRecipe.description}
                      </p>
                    </div>
                    <span className="text-3xl">{currentRecipe.imagePlaceholder}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Ingredients bundling check list */}
                    <div className="space-y-2.5">
                      <h4 className="text-[11px] font-black text-neutral-400 tracking-wider uppercase">
                        Bundle Ingredients Checker
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {currentRecipe.ingredients.map((ing) => {
                          const product = products.find((p) => p.id === ing.productId);
                          if (!product) return null;

                          const isChecked = !!checkedIngredients[ing.productId];
                          const alreadyInCart = cartItems.find((ci) => ci.product.id === product.id)?.quantity || 0;

                          return (
                            <div
                              key={ing.productId}
                              onClick={() => toggleIngredientChecked(ing.productId)}
                              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                                isChecked
                                  ? 'bg-white border-emerald-300 shadow-sm'
                                  : 'bg-neutral-100/50 border-neutral-200 opacity-60'
                              }`}
                              id={`ingredient-check-${ing.productId}`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div className={`w-4 h-4 rounded border flex justify-center items-center ${
                                  isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-neutral-300 bg-white'
                                }`}>
                                  {isChecked && <span className="text-[10px] font-black">✓</span>}
                                </div>
                                <div className="text-left">
                                  <p className="text-xs font-bold text-neutral-800 leading-tight">
                                    {product.name}
                                  </p>
                                  <p className="text-[9px] text-neutral-400 font-semibold">
                                    Needs {ing.quantityRequired} {product.unit} pack • {ing.customNote}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="font-extrabold text-xs text-neutral-700">₹{product.price}</span>
                                {alreadyInCart > 0 && (
                                  <span className="block text-[8px] bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded font-black mt-0.5">
                                    {alreadyInCart} in basket
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick steps preview */}
                    <div className="space-y-2.5">
                      <h4 className="text-[11px] font-black text-neutral-400 tracking-wider uppercase flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Quick Cook Steps</span>
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {currentRecipe.steps.map((step, index) => (
                          <div key={index} className="flex gap-2 text-xs leading-relaxed text-neutral-600">
                            <span className="font-black text-emerald-600 shrink-0">{index + 1}.</span>
                            <span className="font-medium text-neutral-700">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bundling adding footer trigger */}
                <div className="pt-4 border-t border-neutral-200 flex justify-between items-center mt-4">
                  <div className="text-left">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">Estimated Bundle Price</p>
                    <p className="text-lg font-black text-neutral-800">
                      ₹
                      {currentRecipe.ingredients
                        .filter((ing) => checkedIngredients[ing.productId])
                        .reduce((sum, ing) => {
                          const p = products.find((p) => p.id === ing.productId);
                          return sum + (p ? p.price * ing.quantityRequired : 0);
                        }, 0)}
                    </p>
                  </div>

                  <button
                    onClick={handleAddIngredientsToCart}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-3 px-5 rounded-xl shadow-md transition-colors flex items-center gap-2"
                    id="add-recipe-ingredients-btn"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>LOAD SELECTED RECIPE BUNDLE</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex-grow flex flex-col justify-center items-center text-center text-neutral-400 p-8">
                <ChefHat className="w-12 h-12 stroke-[1.5] mb-2 animate-pulse text-emerald-600/60" />
                <h4 className="font-extrabold text-sm text-neutral-700">No Recipe Selected</h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs font-medium">
                  Choose one of our quick-cook recipes from the left panel to examine preparation steps and load full ingredient bundles instantly.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
