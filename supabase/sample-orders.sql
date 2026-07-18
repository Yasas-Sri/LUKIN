-- Sample orders for the management reports (Appendix C).
-- Paste into the Supabase SQL Editor. Each run adds 30 more orders with
-- random products, quantities, statuses and dates spread over the last
-- ~4 months, attached to random existing users. Run 1-2 times.
-- (Runs as postgres, so RLS does not apply. Requires at least one signed-up
-- user and the payment_method/payment_ref columns on orders.)

do $$
declare
  uid uuid;
  oid int;
  n int;
  pid int;
  pprice numeric;
  qty int;
  tot numeric;
begin
  for i in 1..30 loop
    select id into uid from auth.users order by random() limit 1;
    if uid is null then
      raise exception 'No users exist yet — sign up at least one account first.';
    end if;

    insert into orders (user_id, total, status, payment_method, created_at)
    values (
      uid,
      0, -- fixed up below once the items are known
      (array['pending','confirmed','shipped','delivered'])[1 + floor(random() * 4)],
      (array['cod','card'])[1 + floor(random() * 2)],
      now() - (random() * 120 || ' days')::interval
    )
    returning id into oid;

    tot := 0;
    n := 1 + floor(random() * 3); -- 1-3 line items per order
    for j in 1..n loop
      select id, price into pid, pprice from products order by random() limit 1;
      qty := 1 + floor(random() * 3);
      insert into order_items (order_id, product_id, quantity, unit_price)
      values (oid, pid, qty, pprice);
      tot := tot + qty * pprice;
    end loop;

    update orders set total = tot where id = oid;
  end loop;
end $$;
