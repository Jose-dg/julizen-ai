export interface IMoneyV2 {
    amount: number;
    currencyCode: string;
}

export interface IMailingAddress {
    address1?: string;
    address2?: string;
    city?: string;
    company?: string;
    country?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    province?: string;
    zip?: string;
}

export interface IAttribute {
    key: string;
    value: string;
}

export interface ILineItem {
    customAttributes?: IAttribute[];
    quantity: number;
    variantId: string;
}

// Extended for UI purposes (Cart)
export interface ICartLineItem extends ILineItem {
    id: string; // Unique ID for the line item in cart
    title: string;
    variantTitle?: string;
    image: string;
    price: IMoneyV2;
}

export interface ICheckout {
    id: string;
    email?: string;
    lineItems: ICartLineItem[];
    shippingAddress?: IMailingAddress;
    subtotalPrice: IMoneyV2;
    totalPrice: IMoneyV2;
    totalTax: IMoneyV2;
    currencyCode: string;
    completedAt?: string | null;
    webUrl?: string;
}
