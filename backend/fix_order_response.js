export const fixOrderResponseQuery = `
  SELECT 
    o.id, 
    o.order_number AS number,
    o.customer_name AS customer, 
    o.customer_email, 
    o.customer_phone, 
    o.customer_address, 
    o.pickup_point AS pickup, 
    o.comment, 
    o.created_at AS date, 
    COALESCE(SUM(p.price * oi.quantity), 0) AS total,
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'product_id', oi.product_id,
        'quantity', oi.quantity
      )
    ) AS items
  FROM orders o
  LEFT JOIN order_items oi ON o.id = oi.order_id
  LEFT JOIN products p ON oi.product_id = p.id
  GROUP BY o.id
`;
