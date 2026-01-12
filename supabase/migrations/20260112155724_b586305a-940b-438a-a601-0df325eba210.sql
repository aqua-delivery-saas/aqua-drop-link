-- Add container year columns to orders table
ALTER TABLE orders 
ADD COLUMN container_year_start integer,
ADD COLUMN container_year_end integer;

COMMENT ON COLUMN orders.container_year_start IS 'Ano inicial de fabricação do vasilhame do cliente';
COMMENT ON COLUMN orders.container_year_end IS 'Ano final de fabricação do vasilhame do cliente';