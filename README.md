# Fashion Fusion — Online Clothing Store

A front-end implementation of the *Online Clothing Store* project, built with HTML, CSS
and JavaScript. It follows the scenario set out in the project documentation: three user
roles (Visitor, User, Admin), a product catalogue with search and filters, a shopping
cart, a checkout with delivery and payment options, order tracking, product reviews, and
an administration panel.

No frameworks, no build step, no internet connection required.

---

## Running it

**Option 1 — open it directly**

Double-click `index.html`. Everything works, but some browsers block local storage on
`file://` URLs, so your cart and orders may reset when you refresh.

**Option 2 — run it on localhost (recommended)**

This matches the local-host setup described in the design constraints, and data persists
properly between refreshes.

    cd fashion-fusion
    python -m http.server 8000

Then open <http://localhost:8000> in your browser.

In VS Code you can instead right-click `index.html` and choose *Open with Live Server*.

---

## Demo accounts

| Role     | Email                      | Password    |
| -------- | -------------------------- | ----------- |
| Customer | ayesha@example.com         | ayesha123   |
| Admin    | admin@fashionfusion.pk     | admin1234   |

You can also register a new customer account from the site itself.

---

## Folder structure

    fashion-fusion/
    ├── index.html        page structure: header, navigation, main container, footer
    ├── css/
    │   └── style.css     design tokens, layout, components, light and dark themes
    ├── js/
    │   └── app.js        seed data, views, router, cart, checkout, admin, storage
    └── README.md

`app.js` is organised in eight commented sections: storage, seed data, garment artwork,
helpers, router, views, admin panel, and authentication/startup.

---

## How it maps to the documentation

| Requirement in the document        | Where it is implemented                                      |
| ---------------------------------- | ------------------------------------------------------------ |
| View website without signing in    | The full catalogue, search and filters are open to visitors   |
| Client registration                | First name, last name, email, password, confirm password      |
| Customer_001 — View product        | Product page with description, colours, sizes, stock, reviews |
| Customer_003 — Add to cart         | Sign-in required; stock checked before the item is added      |
| Exception E1 — insufficient stock  | The site states the maximum quantity that can be ordered      |
| Customer_002 — Checkout            | Address → delivery option → payment → order confirmation      |
| Search product functionality       | Live autocomplete; a no-match search offers categories instead |
| Multiple delivery options          | Standard, Express, and collection from the store              |
| Admin-001 — Manage categories      | Admin panel → Categories                                      |
| Admin-002/003 — Manage/view orders | Admin panel → Orders, with status changes and stock returns   |
| Admin — manage products, customers | Admin panel → Products, Customers                             |
| Admin — manage/withdraw payments   | Admin panel → Payments                                        |
| Reviews and ratings                | Signed-in customers can rate and review any product           |
| Suggestive products                | "You may also like" on every product page                     |
| Wishlist                           | Heart icon on every card and product page, saved list at "Wishlist" |
| Mobile friendly design             | Responsive from desktop down to phone widths                  |

---

## Data model

The four entities from the data design section exist as JavaScript objects and are saved
in the browser's local storage:

- **Users** — id, firstName, lastName, email, password, role, shipping address
- **Products** — id, name, price, description, category, colours, sizes, stock, rating
- **Orders** — id, trackingId, userId, items, subtotal, delivery, payment, shipping,
  total, status, date
- **Reviews** — id, userId, name, rating, comment, date (stored inside each product)

When you move to PHP and MySQL, these four objects map directly onto four tables. The
only code that touches storage is `save()` and `load()` near the top of `app.js`, so
replacing local storage with API calls is contained to that one place.

---

## Notes and limitations

- Payments are simulated. No card is charged and no bank or wallet is contacted, as
  stated in the design and implementation constraints.
- Confirmation emails are shown on screen rather than actually sent.
- Product, category and hero photography is loaded from Unsplash by URL (see
  `PRODUCT_IMG` near the top of `app.js`), so an internet connection is needed to see
  the images — everything else works offline. An admin can attach a different photo to
  any product from the "Add product" / "Edit" form.
- Typefaces load from Google Fonts when you are online; without a connection the site
  falls back to system fonts and still looks correct.
- Clearing your browser's site data resets the store to its original catalogue.
