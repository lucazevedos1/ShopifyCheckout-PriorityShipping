import {
  reactExtension,
  Checkbox,
  useApplyCartLinesChange,
  useCartLines,
  useApi,
  useSettings
} from '@shopify/ui-extensions-react/checkout';
import { useState, useEffect } from 'react';

export default reactExtension(
  'purchase.checkout.reductions.render-before',
  () => <Extension />,
);

function Extension() {
  const applyCartLinesChange = useApplyCartLinesChange();
  const cartLines = useCartLines();
  const api = useApi();
  const { id_product } = useSettings();
  console.log(id_product);

  const variantId = `gid://shopify/ProductVariant/${id_product}`;

  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const priorityShippingLine = cartLines.find(line => line.merchandise.id === variantId);
    if (priorityShippingLine) {
      setIsChecked(true);
    }
  }, [cartLines]);

  const handleCheckboxChange = async (checked) => {
    setIsChecked(checked);
    console.log('Checkbox changed:', checked);

    if (checked) {
      const result = await applyCartLinesChange({
        type: 'addCartLine',
        merchandiseId: variantId,
        quantity: 1,
      });
      console.log('Add to cart result:', result);
    } else {
      const priorityShippingLine = cartLines.find(line => line.merchandise.id === variantId);

      if (priorityShippingLine) {
        const result = await applyCartLinesChange({
          type: 'removeCartLine',
          id: priorityShippingLine.id,
          quantity: 1,
        });
        console.log('Remove from cart result:', result);
      }
    }
  };
if (id_product) {
  return (
    <Checkbox
      checked={isChecked}
      onChange={handleCheckboxChange}
    >
      Add priority shipping
    </Checkbox>
  );
}
}
