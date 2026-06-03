export const parseWeight = (weightStr) => {
  if (!weightStr) return 0;
  const str = String(weightStr).toLowerCase().replace(/\s/g, '');
  const match = str.match(/([\d.]+)(kg|g)/);
  if (match) {
    const val = parseFloat(match[1]);
    const unit = match[2];
    if (unit === 'kg') return val * 1000;
    if (unit === 'g') return val;
  }
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
};

export const getTotalWeight = (selectedSizes) => {
  if (selectedSizes && selectedSizes.length > 0) {
    return Number(selectedSizes[0].weight_grams) || 0;
  }
  return 0;
};

export const calculateIngredientWeights = (totalWeightGrams, numIngredients) => {
  if (numIngredients === 0 || totalWeightGrams === 0) {
    return { ingredientTotalWeightGrams: 0, baseItemsWeightGrams: 0, weightPerIngredientGrams: 0 };
  }
  const ingredientTotalWeightGrams = totalWeightGrams * 0.8;
  const baseItemsWeightGrams = totalWeightGrams * 0.2;
  const weightPerIngredientGrams = ingredientTotalWeightGrams / numIngredients;
  
  return {
    ingredientTotalWeightGrams,
    baseItemsWeightGrams,
    weightPerIngredientGrams
  };
};

export const calculateCustomizedLadduPrice = ({
  selectedIngredients = [],
  selectedVarieties = [],
  selectedSizes = [],
  baseItemPricePerKg = 0
}) => {
  const totalWeightGrams = getTotalWeight(selectedSizes);
  
  let sizesCost = 0;
  selectedSizes.forEach(size => {
    sizesCost += (Number(size.price) || 0) * (size.qty || 1);
  });
  
  let varietiesCost = 0;
  selectedVarieties.forEach(variety => {
    varietiesCost += (Number(variety.price) || 0);
  });
  
  const { 
    ingredientTotalWeightGrams, 
    baseItemsWeightGrams, 
    weightPerIngredientGrams 
  } = calculateIngredientWeights(totalWeightGrams, selectedIngredients.length);
  
  let ingredientsCost = 0;
  const ingredientBreakdown = [];
  
  selectedIngredients.forEach(ing => {
    const pricePerKg = Number(ing.price) || 0;
    const cost = (weightPerIngredientGrams / 1000) * pricePerKg;
    ingredientsCost += cost;
    ingredientBreakdown.push({
      id: ing.id,
      name: ing.name,
      weightGrams: weightPerIngredientGrams,
      cost
    });
  });
  
  const baseItemsCost = (baseItemsWeightGrams / 1000) * baseItemPricePerKg;
  
  const finalPrice = ingredientsCost + baseItemsCost + sizesCost + varietiesCost;
  
  return {
    totalWeightGrams,
    ingredientTotalWeightGrams,
    baseItemsWeightGrams,
    ingredientsCost,
    baseItemsCost,
    sizesCost,
    varietiesCost,
    finalPrice,
    ingredientBreakdown
  };
};
