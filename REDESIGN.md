# AutoBlock vehicle auction marketplace

Branch: `codex/design-refresh`.

AutoBlock uses a charcoal, white and orange auction interface with an original SVG symbol and a dedicated stylesheet (`public/css/exchange.css`). It is visually independent of IronLot's navy/amber equipment dealership.

The opening displays a real featured auction with bid amount, bid count, time remaining and a bidding link, beside the three lots closing next. The catalogue includes nine home-page auctions, search by make/category, body-style links, no-reserve/ending-today/most-bids controls, watchlist links and direct buy/bid paths. The lower page explains bidding and provides support and stock alerts. The former lifestyle editorial hero and serif design are no longer loaded.

All bid information comes from the existing database/API; the existing 15-second polling updates supported fields and deadlines. The preview uses demo inventory; no fake bidders or manufactured scarcity were added. Catalogue photos are representative and remain credited at `/photo-credits`.

Validation: five route/API checks pass. Browser verification covers desktop, 768px tablet and 390px mobile, navigation, auction filtering, image loading and manufacturer browsing on IronLot. Backend bidding, identity checks, agreements and payments retain their existing implementation. Not deployed to production.
