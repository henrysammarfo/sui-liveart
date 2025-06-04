module sui_liveart::dynamic_nft {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::display;
    use sui::package;
    use sui::url::{Self, Url};
    use std::string::{Self, String};
    use sui::clock::{Self, Clock};
    use sui::event;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::table::{Self, Table};

    // =================== Constants & Errors ===================
    const EInvalidPrice: u64 = 1;
    const EInsufficientPayment: u64 = 2;
    const ENotOwner: u64 = 3;
    const ENotListed: u64 = 4;
    const EAlreadyListed: u64 = 5;

    // =================== Structs ===================
    
    /// Dynamic NFT that changes based on real-world data
    public struct LiveArtNFT has key, store {
        id: UID,
        name: String,
        description: String,
        image_url: Url,
        creator: address,
        data_source: String,
        // Dynamic properties that change with real-world data
        market_value: u64,
        sentiment_score: u8, // 1-10 scale
        volatility: String, // "low", "medium", "high"
        trend: String, // "bullish", "bearish", "neutral"
        last_updated: u64,
        // Visual properties that change
        color_scheme: String,
        animation_speed: u8,
        opacity: u8,
    }

    /// Admin capability for managing the system
    public struct AdminCap has key {
        id: UID,
    }

    /// Global marketplace for NFT trading
    public struct Marketplace has key {
        id: UID,
        listings: Table<address, Listing>,
        fee_percentage: u64, // basis points (100 = 1%)
        fee_balance: Balance<SUI>,
    }

    /// Individual NFT listing
    public struct Listing has store {
        seller: address,
        price: u64,
        listed_at: u64,
    }

    /// One-time witness for display creation
    public struct DYNAMIC_NFT has drop {}

    // =================== Events ===================
    
    public struct NFTMinted has copy, drop {
        nft_id: address,
        creator: address,
        name: String,
    }

    public struct NFTUpdated has copy, drop {
        nft_id: address,
        market_value: u64,
        sentiment_score: u8,
        trend: String,
    }

    public struct NFTListed has copy, drop {
        nft_id: address,
        seller: address,
        price: u64,
    }

    public struct NFTSold has copy, drop {
        nft_id: address,
        seller: address,
        buyer: address,
        price: u64,
    }

    // =================== Module Initializer ===================
    
    fun init(otw: DYNAMIC_NFT, ctx: &mut TxContext) {
        // Create admin capability
        let admin_cap = AdminCap {
            id: object::new(ctx),
        };

        // Create global marketplace
        let marketplace = Marketplace {
            id: object::new(ctx),
            listings: table::new(ctx),
            fee_percentage: 250, // 2.5%
            fee_balance: balance::zero(),
        };

        // Setup NFT display standard
        let keys = vector[
            string::utf8(b"name"),
            string::utf8(b"description"),
            string::utf8(b"image_url"),
            string::utf8(b"creator"),
            string::utf8(b"market_value"),
            string::utf8(b"sentiment"),
            string::utf8(b"trend"),
            string::utf8(b"data_source"),
        ];

        let values = vector[
            string::utf8(b"{name}"),
            string::utf8(b"{description}"),
            string::utf8(b"{image_url}"),
            string::utf8(b"By: {creator}"),
            string::utf8(b"${market_value}"),
            string::utf8(b"{sentiment_score}/10"),
            string::utf8(b"{trend}"),
            string::utf8(b"Data: {data_source}"),
        ];

        let publisher = package::claim(otw, ctx);
        let mut display = display::new_with_fields<LiveArtNFT>(
            &publisher, keys, values, ctx
        );
        display::update_version(&mut display);

        // Transfer ownership
        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));
        transfer::transfer(admin_cap, tx_context::sender(ctx));
        transfer::share_object(marketplace);
    }

    // =================== Core NFT Functions ===================

    /// Mint a new dynamic NFT
    public fun mint_nft(
        name: vector<u8>,
        description: vector<u8>,
        image_url: vector<u8>,
        data_source: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ): LiveArtNFT {
        let nft = LiveArtNFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            image_url: url::new_unsafe_from_bytes(image_url),
            creator: tx_context::sender(ctx),
            data_source: string::utf8(data_source),
            market_value: 100, // Starting value
            sentiment_score: 5,
            volatility: string::utf8(b"medium"),
            trend: string::utf8(b"neutral"),
            last_updated: clock::timestamp_ms(clock),
            color_scheme: string::utf8(b"blue"),
            animation_speed: 1,
            opacity: 100,
        };

        event::emit(NFTMinted {
            nft_id: object::uid_to_address(&nft.id),
            creator: tx_context::sender(ctx),
            name: nft.name,
        });

        nft
    }

    /// Public entry function to mint and transfer NFT
    public entry fun mint_and_transfer(
        name: vector<u8>,
        description: vector<u8>,
        image_url: vector<u8>,
        data_source: vector<u8>,
        recipient: address,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let nft = mint_nft(name, description, image_url, data_source, clock, ctx);
        transfer::public_transfer(nft, recipient);
    }

    /// Update NFT with real-world data (admin only)
    public entry fun update_nft_data(
        nft: &mut LiveArtNFT,
        _: &AdminCap,
        new_market_value: u64,
        new_sentiment: u8,
        new_volatility: vector<u8>,
        new_trend: vector<u8>,
        new_color: vector<u8>,
        new_speed: u8,
        new_opacity: u8,
        clock: &Clock,
        _ctx: &mut TxContext
    ) {
        nft.market_value = new_market_value;
        nft.sentiment_score = new_sentiment;
        nft.volatility = string::utf8(new_volatility);
        nft.trend = string::utf8(new_trend);
        nft.color_scheme = string::utf8(new_color);
        nft.animation_speed = new_speed;
        nft.opacity = new_opacity;
        nft.last_updated = clock::timestamp_ms(clock);

        event::emit(NFTUpdated {
            nft_id: object::uid_to_address(&nft.id),
            market_value: new_market_value,
            sentiment_score: new_sentiment,
            trend: nft.trend,
        });
    }

    // =================== Marketplace Functions ===================

    /// List NFT for sale
    public entry fun list_nft(
        marketplace: &mut Marketplace,
        nft: LiveArtNFT,
        price: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(price > 0, EInvalidPrice);
        let nft_id = object::uid_to_address(&nft.id);
        
        assert!(!table::contains(&marketplace.listings, nft_id), EAlreadyListed);

        let listing = Listing {
            seller: tx_context::sender(ctx),
            price,
            listed_at: clock::timestamp_ms(clock),
        };

        table::add(&mut marketplace.listings, nft_id, listing);

        event::emit(NFTListed {
            nft_id,
            seller: tx_context::sender(ctx),
            price,
        });

        // Transfer NFT to marketplace for escrow
        transfer::public_transfer(nft, object::uid_to_address(&marketplace.id));
    }

    /// Buy NFT from marketplace
    public entry fun buy_nft(
        marketplace: &mut Marketplace,
        nft_id: address,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        assert!(table::contains(&marketplace.listings, nft_id), ENotListed);
        
        let listing = table::remove(&mut marketplace.listings, nft_id);
        let Listing { seller, price, listed_at: _ } = listing;

        let payment_amount = coin::value(&payment);
        assert!(payment_amount >= price, EInsufficientPayment);

        // Calculate marketplace fee
        let fee_amount = (price * marketplace.fee_percentage) / 10000;
        let seller_amount = price - fee_amount;

        // Handle payments
        if (fee_amount > 0) {
            let fee_coin = coin::split(&mut payment, fee_amount, ctx);
            balance::join(&mut marketplace.fee_balance, coin::into_balance(fee_coin));
        };

        let seller_payment = coin::split(&mut payment, seller_amount, ctx);
        transfer::public_transfer(seller_payment, seller);

        // Return excess payment
        if (coin::value(&payment) > 0) {
            transfer::public_transfer(payment, tx_context::sender(ctx));
        } else {
            coin::destroy_zero(payment);
        };

        event::emit(NFTSold {
            nft_id,
            seller,
            buyer: tx_context::sender(ctx),
            price,
        });

        // Note: In real implementation, you'd retrieve and transfer the NFT
        // This requires additional object management
    }

    /// Delist NFT (seller only)
    public entry fun delist_nft(
        marketplace: &mut Marketplace,
        nft_id: address,
        ctx: &mut TxContext
    ) {
        assert!(table::contains(&marketplace.listings, nft_id), ENotListed);
        
        let listing = table::borrow(&marketplace.listings, nft_id);
        assert!(listing.seller == tx_context::sender(ctx), ENotOwner);
        
        table::remove(&mut marketplace.listings, nft_id);
        
        // Note: In real implementation, return NFT to seller
    }

    // =================== View Functions ===================

    public fun get_nft_info(nft: &LiveArtNFT): (String, u64, u8, String, String) {
        (nft.name, nft.market_value, nft.sentiment_score, nft.trend, nft.volatility)
    }

    public fun get_nft_visual_properties(nft: &LiveArtNFT): (String, u8, u8) {
        (nft.color_scheme, nft.animation_speed, nft.opacity)
    }

    public fun get_listing_info(marketplace: &Marketplace, nft_id: address): (address, u64, u64) {
        let listing = table::borrow(&marketplace.listings, nft_id);
        (listing.seller, listing.price, listing.listed_at)
    }

    public fun is_listed(marketplace: &Marketplace, nft_id: address): bool {
        table::contains(&marketplace.listings, nft_id)
    }

    // =================== Admin Functions ===================

    /// Withdraw marketplace fees
    public entry fun withdraw_fees(
        marketplace: &mut Marketplace,
        _: &AdminCap,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let fee_amount = balance::value(&marketplace.fee_balance);
        if (fee_amount > 0) {
            let fee_coin = coin::from_balance(
                balance::split(&mut marketplace.fee_balance, fee_amount),
                ctx
            );
            transfer::public_transfer(fee_coin, recipient);
        };
    }

    /// Update marketplace fee
    public entry fun update_fee(
        marketplace: &mut Marketplace,
        _: &AdminCap,
        new_fee_percentage: u64,
        _ctx: &mut TxContext
    ) {
        marketplace.fee_percentage = new_fee_percentage;
    }
}