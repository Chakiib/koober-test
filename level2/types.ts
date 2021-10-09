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

export interface JsonData {
    articles: ArticleType[];
    carts: CartType[];
}

export type CalculatedCartType = {
    id: number;
    total: number;
};

export interface OutputType {
    carts: CalculatedCartType[];
}
