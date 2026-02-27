import mongoose, { Schema, Document, Model } from 'mongoose';

// User Model
export interface IUser extends Document {
    full_name: string;
    mobile: string;
    password?: string;
    pin?: string;
    wallet_balance: number;
    bank_details_status: string;
    gpay_status: string;
    phonepe_status: string;
    paytm_status: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        full_name: { type: String, required: true },
        mobile: { type: String, required: true, unique: true },
        password: { type: String, required: false },
        pin: { type: String, required: false },
        wallet_balance: { type: Number, default: 0 },
        bank_details_status: { type: String, default: "0" },
        gpay_status: { type: String, default: "0" },
        phonepe_status: { type: String, default: "0" },
        paytm_status: { type: String, default: "0" },
    },
    { timestamps: true }
);

export const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// Game Model
export interface IGame extends Document {
    name: string;
    open_time: string;
    close_time: string;
}

const GameSchema: Schema = new Schema({
    name: { type: String, required: true },
    open_time: { type: String, required: true },
    close_time: { type: String, required: true },
});

export const Game: Model<IGame> =
    mongoose.models.Game || mongoose.model<IGame>('Game', GameSchema);

// Bid Model
export interface IBid extends Document {
    userId: mongoose.Types.ObjectId;
    gameName: string;
    betType: string;
    market: string;
    number: string;
    amount: number;
    status: 'Win' | 'Loss' | 'Pending';
    createdAt: Date;
    updatedAt: Date;
}

const BidSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        gameName: { type: String, required: true },
        betType: { type: String, required: true },
        market: { type: String, required: true },
        number: { type: String, required: true },
        amount: { type: Number, required: true },
        status: {
            type: String,
            enum: ['Win', 'Loss', 'Pending'],
            default: 'Pending',
        },
    },
    { timestamps: true }
);

export const Bid: Model<IBid> =
    mongoose.models.Bid || mongoose.model<IBid>('Bid', BidSchema);

// App Details Model
export interface IAppDetails extends Document {
    app_name: string;
    version_code: string;
    app_link: string;
    whatsapp_no: string;
    mobile_no: string;
    upi_id: string;
    add_fund_text: string;
    withdraw_fund_text: string;
}

const AppDetailsSchema: Schema = new Schema({
    app_name: { type: String, default: 'MatkaCalc' },
    version_code: { type: String, default: '1.0' },
    app_link: { type: String, default: '' },
    whatsapp_no: { type: String, default: '' },
    mobile_no: { type: String, default: '' },
    upi_id: { type: String, default: '' },
    add_fund_text: { type: String, default: 'Add funds easily.' },
    withdraw_fund_text: { type: String, default: 'Withdraw your winnings.' },
});

export const AppDetails: Model<IAppDetails> =
    mongoose.models.AppDetails ||
    mongoose.model<IAppDetails>('AppDetails', AppDetailsSchema);

// Transaction Model
export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, enum: ['credit', 'debit'], required: true },
        amount: { type: Number, required: true },
        description: { type: String, required: true },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Approved', // Auto-approved by default for now
        },
    },
    { timestamps: true }
);

export const Transaction: Model<ITransaction> =
    mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
