# Execute Men Power Migration

Since the Supabase CLI is having authentication issues, please follow these steps to manually execute the migration:

## Option 1: Supabase Dashboard SQL Editor (Recommended)

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/bmdrmzzuzexewzyudrmr
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the following SQL:

```sql
-- Migration to add men_power column to orders table
-- This stores the number of workers selected for installation/teardown services

-- Add men_power column to orders table
ALTER TABLE orders ADD COLUMN men_power integer DEFAULT 3;

-- Add constraint to ensure reasonable values (3-20 workers)
ALTER TABLE orders ADD CONSTRAINT orders_men_power_check CHECK (men_power >= 3 AND men_power <= 20);

-- Add comment for documentation
COMMENT ON COLUMN orders.men_power IS 'Number of workers selected for installation/teardown services (3-20)';
```

5. Click **Run** to execute the migration
6. You should see a success message confirming the column was added

## Option 2: Verify Migration Success

After running the migration, verify it worked by running this query:

```sql
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'men_power';
```

You should see:
- column_name: men_power
- data_type: integer
- column_default: 3
- is_nullable: YES

## What This Migration Does

- Adds a `men_power` column to the `orders` table
- Sets the default value to 3 (minimum number of workers)
- Adds a check constraint to ensure values are between 3 and 20
- Adds documentation comment explaining the column's purpose

## Next Steps

Once the migration is complete:
1. The checkout page will now save the selected number of workers to the database
2. The order summary will display the "Men Power" information
3. All existing orders will have a default value of 3 workers

---

**Note**: This migration is safe to run and will not affect existing data. All existing orders will automatically get the default value of 3 workers.