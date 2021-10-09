export type ArticleType = {
    id: number;
    name: string;
    price: number;
};

export type CartItemType = {
    article_id: number;
    quantity: number;
};

export type CartType = {
    id: number;
    items: CartItemType[];
};

export type EligibleTransactionVolumeType = {
    min_price: number;
    max_price: number | null;
};

export type DeliveryFeeType = {
    eligible_transaction_volume: EligibleTransactionVolumeType;
    price: number;
};

export enum DiscountTypeType {
    amount = 'amount',
    percentage = 'percentage',
}

export type DiscountType = {
    article_id: number;
    type: DiscountTypeType;
    value: number;
};

export interface JsonData {
    articles: ArticleType[];
    carts: CartType[];
    delivery_fees: DeliveryFeeType[];
    discounts: DiscountType[];
}

export type CalculatedCartType = {
    id: number;
    total: number;
};

export interface OutputType {
    carts: CalculatedCartType[];
}
